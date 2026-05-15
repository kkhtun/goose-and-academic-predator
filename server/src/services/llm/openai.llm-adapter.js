const OpenAI = require("openai");

const {
    normalizeCrosswordResponse,
    normalizeMcqResponse,
    normalizeTrueFalseResponse,
} = require("./prompt-builder.llm");
const { DIFFICULTY, QUIZ_TYPE } = require("../../utils/quiz.util");
const { CustomError } = require("../../utils/CustomError");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const modelName =
    process.env.OPENAI_MODEL || "gpt-5.4" || "gpt-5.4-mini" || "gpt-4o";

// Embedding Utils
const EMBEDDING_MODEL = "text-embedding-3-small";

function normalizeText(text) {
    return String(text || "")
        .replace(/\s+/g, " ")
        .trim();
}

async function embedText(text) {
    const input = normalizeText(text);

    if (!input) {
        throw new Error("Cannot embed empty text");
    }

    const resp = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input,
    });

    return resp.data[0].embedding;
}

// OpenAI Quiz Generation
function formatChunkIntoContextString(chunks) {
    return chunks.map((c, i) => `${c.text}`).join("\n\n");
}

// Functions that call Open AI API
async function callLLMSummarizeContent({ content }) {
    const resp = await client.chat.completions.create({
        model: modelName,
        temperature: 0.2,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "note_summary",
                strict: true,
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
- Keep it concise.

Note:
${content}
`,
            },
        ],
    });
    return JSON.parse(resp.choices[0].message.content);
}

async function callLLMMCQ({ context }) {
    const resp = await client.chat.completions.create({
        model: modelName,
        temperature: 0.4,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "mcq",
                strict: true,
                schema: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        questionText: { type: "string" },
                        options: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                A: { type: "string" },
                                B: { type: "string" },
                                C: { type: "string" },
                                D: { type: "string" },
                            },
                            required: ["A", "B", "C", "D"],
                        },
                        correctAnswer: {
                            type: "string",
                            enum: ["A", "B", "C", "D"],
                        },
                        explanation: { type: "string" },
                    },
                    required: [
                        "questionText",
                        "options",
                        "correctAnswer",
                        "explanation",
                    ],
                },
            },
        },
        messages: [
            {
                role: "system",
                content: `
You are a quiz generator. Use only the provided context for factual grounding.
Generate one high-quality multiple-choice question that tests understanding of the main generalizable idea, not memorization of document-specific details.
`,
            },
            {
                role: "user",
                content: `
CONTEXT:
${context}

Generate ONE MCQ.

Rules:
- The question must be answerable from the context.
- Options A-D must contain full answer text, not just letters.
- Test the main concept or implication, not a minor detail.
- Avoid asking about author names, paper titles, study names, copyright notices, publication years, or specific source details.
- Avoid over-specific named entities unless the entity is essential to the learning objective.
- Prefer general phrasing that a learner can answer by understanding the paragraph.
- Do not mention "context", "chunk", "paper", "study", "source", or "article".
- Distractors must be plausible misconceptions, not obviously silly.
- There must be exactly one correct answer.
- Explanation should briefly explain why the correct answer is right.
- Do not mention context, chunks, papers, studies, or internal sources in either the questionText, options or in explanation.
- Assume that the quiz taker will not have access to the context provided.
`,
            },
        ],
    });
    return JSON.parse(resp.choices[0].message.content);
}

async function callLLMTrueFalse({ context }) {
    const answer = Math.random() < 0.5 ? true : false;

    const resp = await client.chat.completions.create({
        model: modelName,
        temperature: 0.4,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "true_false_question",
                strict: true,
                schema: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        statement: { type: "string" },
                        answer: { type: "boolean" },
                        explanation: { type: "string" },
                    },
                    required: ["statement", "answer", "explanation"],
                },
            },
        },
        messages: [
            {
                role: "system",
                content: `
You are a quiz generator for learners.

Use only the provided context for factual grounding.
Generate one high-quality true/false statement.
`.trim(),
            },
            {
                role: "user",
                content: `
CONTEXT:
${context}

Generate ONE true/false statement.

The correct answer MUST be ${answer.toString().toUpperCase()}.
Return "answer": ${answer}.

Rules:
- Write the statement as a general learning principle, not as a description of the specific source material.
- Avoid source-specific nouns from the input when possible.
- Do not use exact numbers, names, titles, author groups, editorial boards, report labels, or source-specific categories unless they are essential to the learning point.
- Avoid words such as commentary, abstract, editorial board, selected topics, report, article, paper, study, source, and authors.
- Assume that the quiz taker will not have access to the context provided.

Rules for TRUE statements:
- If the answer is TRUE, the statement must accurately reflect the context.

Rules for FALSE statements:
- If the answer is FALSE, the statement must clearly contradict the main general idea.
- The contradiction must change the core meaning, conclusion, cause, limitation, or implication.
- Do NOT make a false statement by only rephrasing a true statement.
- Do NOT rely on tiny wording differences.
- Do NOT make the statement obviously absurd.
- Make the false statement a plausible misconception a learner might have.
- Prefer a general misconception over a source-specific false detail.

Explanation rules:
- Explain why the answer is correct.
- For FALSE statements, explicitly state what the correct idea is.
- Do not mention context, chunks, papers, studies, reports, sources, or internal materials.
`.trim(),
            },
        ],
    });

    return JSON.parse(resp.choices[0].message.content);
}

async function callLLMCrossword({ context }) {
    const resp = await client.chat.completions.create({
        model: modelName,
        temperature: 0.3,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "crossword_entries",
                strict: true,
                schema: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        entries: {
                            type: "array",
                            minItems: 6,
                            maxItems: 8,
                            items: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    answer: {
                                        type: "string",
                                        pattern: "^[A-Z]{4,10}$",
                                        description:
                                            "Single uppercase word, A-Z only, 4-10 letters",
                                    },
                                    clue: {
                                        type: "string",
                                        minLength: 20,
                                        maxLength: 300,
                                        description:
                                            "Concise crossword clue, 10-30 words",
                                    },
                                },
                                required: ["answer", "clue"],
                            },
                        },
                    },
                    required: ["entries"],
                },
            },
        },
        messages: [
            {
                role: "system",
                content: `
You are a crossword puzzle generator.
Use the provided context to generate high-quality crossword entries.
`,
            },
            {
                role: "user",
                content: `
CONTEXT:
${context}

Generate 6-8 crossword entries.

Rules:
- Each answer must be a SINGLE WORD in uppercase (A-Z only).
- Length must be between 4 and 10 letters.
- Each clue must be 10-30 words and clearly point to the answer.
- Do NOT include the answer word inside the clue.
- Avoid duplicates.
- Avoid very obscure terms.
- Prefer important and meaningful terms from the context.
- Clues should be natural and human-readable.
- Do not mention context, chunks, papers, studies, or internal sources in the clues.

`,
            },
        ],
    });

    const parsed = JSON.parse(resp.choices[0].message.content);
    return parsed.entries;
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
    let response = {};
    let normalizedRes = {};

    if (type === QUIZ_TYPE.CROSS_WORDS) {
        response = await callLLMCrossword({ context });
        normalizedRes = normalizeCrosswordResponse(response);
    } else if (type === QUIZ_TYPE.TRUE_FALSE) {
        response = await callLLMTrueFalse({ context });
        normalizedRes = normalizeTrueFalseResponse(response);
    } else {
        // By default MCQ
        response = await callLLMMCQ({ context });
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
    EMBEDDING_MODEL,
    formatChunkIntoContextString,
    generateQuiz,
    generateInfo,
};
