const OpenAI = require("openai");

const {
    normalizeQuizObject,
    buildMcqBatchPrompt,
    buildMcqPrompt,
    normalizeCrosswordResponse,
    normalizeMcqResponse,
    buildCrosswordPrompt,
} = require("./prompt-builder.llm");
const { DIFFICULTY, QUIZ_TYPE } = require("../../utils/quiz.util");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function embedText(text) {
    const response = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}

function formatChunkIntoContextString(chunks) {
    return chunks.map((c, i) => `CHUNK ${i + 1}:\n${c.text}`).join("\n\n");
}

async function callLLM({ prompt }) {
    const resp = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
        // response_format: { type: "json_object" }, // model returns a JSON object, we’ll parse the array from it safely
    });
    const raw = resp.choices[0].message.content;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.log("Raw : ", raw);
        throw new Error("Failed to parse JSON");
    }
}

async function callGenerateMcqBatchFromContext({
    topic,
    difficulty,
    retrievedChunks,
    count = 3,
}) {
    const context = retrievedChunks
        .map((c, i) => `CHUNK ${i + 1}:\n${c.text}`)
        .join("\n\n");

    const prompt = buildMcqBatchPrompt({ topic, difficulty, context, count });

    const resp = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
        // response_format: { type: "json_object" }, // model returns a JSON object, we’ll parse the array from it safely
    });

    const raw = resp.choices[0].message.content;
    let parsed;
    try {
        parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) throw new Error("");
    } catch (error) {
        throw new Error("Failed to parse JSON");
    }
    const validationResult = parsed.map(normalizeQuizObject);
    const finalResult = [];
    validationResult.forEach((quiz) => {
        if (quiz.isValid) {
            finalResult.push({
                ...quiz.entry,
                topic,
                difficulty,
                contextChunks: retrievedChunks.map((c) => c._id),
            });
        }
    });

    return finalResult;
}

// Generate single quiz
async function generateQuiz({ type, chunks, difficulty = DIFFICULTY.MEDIUM }) {
    const context = formatChunkIntoContextString(chunks);

    let prompt = "";
    if (type === QUIZ_TYPE.CROSS_WORDS) {
        prompt = buildCrosswordPrompt({
            difficulty,
            context,
            wordCount: 8,
        });
    } else {
        // By default MCQ
        prompt = buildMcqPrompt({
            difficulty,
            context,
        });
    }

    const response = await callLLM({ prompt });

    // Validate response
    if (type === QUIZ_TYPE.CROSS_WORDS) {
        return normalizeCrosswordResponse(response);
    } else {
        const { entry, isValid } = normalizeMcqResponse(response);
        // Assume valid for now
        return entry;
    }
}

module.exports = {
    embedText,
    callGenerateMcqBatchFromContext,
    formatChunkIntoContextString,
    generateQuiz,
};
