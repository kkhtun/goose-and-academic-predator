const OpenAI = require("openai");

const {
    buildMcqPrompt,
    normalizeCrosswordResponse,
    normalizeMcqResponse,
    buildCrosswordPrompt,
    normalizeTrueFalseResponse,
    buildTrueFalsePrompt,
} = require("./prompt-builder.llm");
const { DIFFICULTY, QUIZ_TYPE } = require("../../utils/quiz.util");
const { CustomError } = require("../../utils/CustomError");

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

// Functions that call Open AI API
async function callLLMSummarizeContent({ content }) {
    const resp = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "note_summary",
                schema: {
                    type: "object",
                    properties: {
                        takeaway: {
                            type: "string",
                            description: "2-3 line general knowledge summary",
                        },
                    },
                    required: ["takeaway"],
                    additionalProperties: false,
                },
            },
        },
        messages: [
            {
                role: "system",
                content: `You convert research notes into concise, general knowledge takeaways.`,
            },
            {
                role: "user",
                content: `
Summarize the note into 2-3 lines.

Rules:
- Do NOT mention "the paper", "the study", "researchers", or any source.
- Write as general knowledge or practical insight.
- Preserve nuance and core argument.
- Avoid meta-language like "this shows", "this suggests"
- Keep it concise (2-3 lines max).

Note:
${content}
`,
            },
        ],
    });

    return JSON.parse(resp.choices[0].message.content);
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

// Wrapper functions

async function generateInfo({ chunk }) {
    const { text } = chunk;
    const response = await callLLMSummarizeContent({ content: text });
    return response;
}

async function generateQuiz({ type, chunks }) {
    const context = formatChunkIntoContextString(chunks);

    let prompt = "";
    if (type === QUIZ_TYPE.CROSS_WORDS) {
        prompt = buildCrosswordPrompt({
            context,
            wordCount: 8,
        });
    } else if (type === QUIZ_TYPE.TRUE_FALSE) {
        prompt = buildTrueFalsePrompt({
            context,
        });
    } else {
        // By default MCQ
        prompt = buildMcqPrompt({
            context,
        });
    }

    const response = await callLLM({ prompt });

    // Validate response
    let normalizedRes;
    if (type === QUIZ_TYPE.CROSS_WORDS) {
        normalizedRes = normalizeCrosswordResponse(response);
    } else if (type === QUIZ_TYPE.TRUE_FALSE) {
        normalizedRes = normalizeTrueFalseResponse(response);
    } else {
        normalizedRes = normalizeMcqResponse(response);
    }
    const { isValid, entry } = normalizedRes;

    if (isValid) return entry;

    console.log(`[ADAPTER] Unable to normalize the response : `);
    console.log(response);
    throw new CustomError(
        `[ADAPTER] Unable to normalize LLM Response. Skipping quiz generation...`
    );
}

module.exports = {
    embedText,
    formatChunkIntoContextString,
    generateQuiz,
    generateInfo,
};
