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
    return chunks.map((c, i) => `${c.text}`).join("\n\n");
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

async function callLLMMCQ({ context }) {
    const resp = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
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
You are a quiz generator. Use only the provided context.
Generate one high-quality multiple-choice question.
`,
            },
            {
                role: "user",
                content: `
CONTEXT:
${context}

Generate ONE MCQ.

Rules:
- The question must be answerable only from the context.
- Options A-D must contain full answer text, not just letters.
- Exactly one option must be correct.
- Distractors must be plausible but clearly wrong.
- Explanation should explain why the correct answer is right.
- Do not mention context, chunks, papers, studies, or internal sources in either the questionText, options or in explanation.
`,
            },
        ],
    });

    return JSON.parse(resp.choices[0].message.content);
}

async function callLLMTrueFalse({ context }) {
    const resp = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "true_false_question",
                strict: true,
                schema: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        statement: {
                            type: "string",
                            description:
                                "A concise statement that is clearly true or false based only on the provided context.",
                        },
                        answer: {
                            type: "boolean",
                            description:
                                "Whether the statement is true or false.",
                        },
                        explanation: {
                            type: "string",
                            description:
                                "Natural explanation of why the answer is correct, without mentioning the context or chunks.",
                        },
                    },
                    required: ["statement", "answer", "explanation"],
                },
            },
        },
        messages: [
            {
                role: "system",
                content: `
You are a quiz generator. Use only the provided context.
Generate one true/false question.
`,
            },
            {
                role: "user",
                content: `
CONTEXT:
${context}

Generate ONE true/false statement.

Rules:
- The statement must be fully verifiable using only the context.
- The statement must be concise and unambiguous.
- Ensure a balanced mix of TRUE and FALSE across multiple generations (do not always return TRUE).
- Explanation should explain why the answer is correct in natural language.
- Do not mention context, chunks, papers, studies, or internal sources in either the statement or explanation.
`,
            },
        ],
    });

    return JSON.parse(resp.choices[0].message.content);
}

async function callLLMCrossword({ context }) {
    const resp = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
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
    formatChunkIntoContextString,
    generateQuiz,
    generateInfo,
};
