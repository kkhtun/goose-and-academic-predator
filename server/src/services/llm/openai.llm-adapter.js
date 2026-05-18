const OpenAI = require("openai");

const {
    normalizeCrosswordResponse,
    normalizeMcqResponse,
    normalizeTrueFalseResponse,
} = require("./prompt-builder.llm");
const { DIFFICULTY, QUIZ_TYPE } = require("../../utils/quiz.util");
const { CustomError } = require("../../utils/CustomError");
const { shuffleArray } = require("../../utils/common.util");

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
function shuffleAndTakeTerms(termString, limit = 100) {
    if (typeof termString !== "string") return "";

    const terms = termString
        .split("|")
        .map((term) => term.trim())
        .filter(Boolean);

    // Fisher-Yates shuffle
    return shuffleArray(terms).slice(0, limit).join(" | ");
}

function formatChunkIntoContextString(chunks) {
    return chunks.map((c, i) => {
        return `CHUNK ${i}\n
        SOURCE TITLE : ${c.sourceTitle}\n
        SOURCE : \n${c.text}\n\n
        `;
    });
    // return chunks.map((c, i) => `${c.text}`).join("\n\n");
}

function getRandomTrueFalseStylePrompt() {
    const styles = [
        `
Question style:
- Use a short realistic scenario involving a researcher, journal, publisher, conference, peer review process, fee request, indexing claim, licensing policy, editorial board, or publication decision.
- Write a True/False statement about what the researcher should conclude, check, avoid, or do next.
- The statement should require applying the idea to the situation, not merely recognizing wording from the material.
`.trim(),
        `
Question style:
- The statement should test the practical meaning, implication, risk, or misconception behind the idea.
- Avoid simple definition statements or statements that merely copy/rephrase the material.
`.trim(),
    ];
    return styles[Math.floor(Math.random() * styles.length)];
}

function getRandomMCQStylePrompt() {
    const styles = [
        `
Question style:
- Use a short realistic scenario involving a researcher, journal, publisher, conference, peer review process, fee request, indexing claim, licensing policy, editorial board, or publication decision.
- The question should ask what the researcher should conclude, check, avoid, or do next.
- Do not simply ask for a definition or repeat a sentence from the material.
- The correct answer must require applying the idea.
- Distractors must be plausible mistakes, not obviously wrong.
`.trim(),
        `
Question style:
- The question should test the practical meaning, implication, risk, or misconception behind the idea.
- Avoid simple "what is X?" or "why is X important?" questions unless there is no better option.
- Do not simply ask the learner to recall wording from the material.
- Distractors must be plausible mistakes, not obviously wrong.
`.trim(),
    ];
    return styles[Math.floor(Math.random() * styles.length)];
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
                            description:
                                "A concise researcher-facing takeaway, usually 1-2 sentences.",
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
                content: `
You turn research notes into concise, practical takeaways for researchers, graduate students, and early-career academics.

Focus on the general lesson, risk, implication, or best practice. Avoid trivia, source-specific details, and abstract-style summaries.
`.trim(),
            },
            {
                role: "user",
                content: `
MATERIAL:
${content}

Write one concise takeaway.

Rules:
- Assume the reader will not see the original material.
- Write for researchers, graduate students, and early-career academics.
- Focus on the practical scholarly communication lesson, not minor methods or source details.
- Do not mention "the paper", "the study", "the abstract", "researchers", "authors", "respondents", or any source.
- Do not include sample sizes, countries, dates, publisher names, copyright notices, or methodology unless essential to the lesson.
- Avoid meta-language such as "this shows", "this suggests", "the material highlights", or "the findings reveal".
- Preserve the core nuance and implication.
- Keep it 1-2 sentences, concise but meaningful.
`.trim(),
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
                        explanation: {
                            type: "string",
                            description:
                                "A brief explanation of why the answer is correct. Do not mention the exact option label in the text (e.g Option A or A)",
                        },
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
You are a quiz generator for researchers. Use only the provided context for factual grounding.
Generate one high-quality multiple-choice question that tests understanding of the main generalizable idea, not memorization of document-specific details.
The goal is not to test whether they can recognize a sentence, but whether they can make a publishing judgment.

Bad quiz style:
Question: Why is fee transparency important?
A. It helps authors understand costs.
B. It is never relevant.
C. It guarantees acceptance.
D. It replaces peer review.

This is too easy because the correct answer is the only reasonable option.

Good quiz style:
Question: A journal says it is open access and asks for payment after acceptance, but its website gives no clear APC amount, refund policy, or licensing terms. What is the most defensible concern?
A. The unclear fee and licensing information makes it difficult for authors to evaluate their rights, costs, and the publisher's transparency.
B. Any journal that charges a fee is automatically predatory.
C. The lack of fee information is acceptable if the journal promises fast publication.
D. Licensing terms matter only after an article receives citations.

Why this is better:
It tests judgment. The distractors are plausible misconceptions, not silly answers.

Wording variety:
- Do not reuse stock phrases from these instructions or examples, such as "most defensible judgment", "most appropriate concern", "warning signs", or "publishing judgment". Vary the wording naturally across generations.
- Phrase the question naturally.
- The examples are guides for quality, not templates to copy.
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
- There must be exactly one correct answer.
- Test the main concept or implication, not a minor detail.
- Avoid over-specific named entities unless the entity is essential to the learning objective.
- Assume that the quiz taker will not have access to the context provided, therefore, avoid mentining context, chunks, papers, studies or any internal sources.
- Target audience: researchers, graduate students, and early-career academics.
- You may use external knowledge of academic publishing to increase complexity of questions and make the questions realistic while grounding the theme in provided context.
- Distractors should be plausible but flawed choices a researcher might actually consider.
- Explanation should explain why the correct answer is right.

${getRandomMCQStylePrompt()}

You should internally draft 3 candidate questions and choose the strongest one.
Return only the final JSON.

The strongest question:
- is appropriate for researchers,
- tests judgment rather than sentence recognition,
- distinguishes legitimate scholarly practice from questionable or predatory practice,
- has plausible distractors,
- does not make the correct answer obvious by tone, length, or ethical wording.

Include at least one subtle misconception among the distractors.
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
You are a quiz generator for researchers, graduate students, and early-career academics.

Use the provided context for factual grounding.
Generate one high-quality True/False statement that tests judgment, application, or misconception correction rather than sentence recognition.

Good True/False items should be plausible enough that a researcher must think carefully.
Bad True/False items merely copy the material, use absurd claims, or reveal the answer through extreme wording.

Wording variety:
- Do not reuse stock phrases from these instructions or examples.
- Phrase the statement naturally.
- The guidance is for quality, not a template to copy.
`.trim(),
            },
            {
                role: "user",
                content: `
CONTEXT:
${context}

Generate ONE True/False statement.

The correct answer MUST be ${answer.toString().toUpperCase()}.
Return "answer": ${answer}.

Rules:
- The statement must be answerable from the context.
- Write the statement as a general learning principle or realistic publishing judgment, not as a description of the specific source material.
- Target audience: researchers, graduate students, and early-career academics.
- Assume that the quiz taker will not have access to the context.
- Do not mention context, chunks, papers, studies, reports, sources, abstracts, or internal materials.
- Avoid source-specific names, titles, exact numbers, author groups, report labels, or highly specific categories unless essential.
- You may use general academic publishing knowledge to make the statement more realistic and less trivial, but the correct answer and explanation must remain supported by the provided context.
- Avoid statements that can be answered by recognizing wording from the context.
- Avoid extreme words such as "always", "never", "guarantees", "automatically", or "impossible" unless the concept specifically requires that distinction.

Rules for TRUE statements:
- If the answer is TRUE, the statement must accurately reflect the main idea or implication.
- It should not be a trivial restatement.
- It should require understanding why the idea matters in publishing practice.

Rules for FALSE statements:
- If the answer is FALSE, the statement must express a plausible misconception.
- The false statement should contradict the main idea, implication, limitation, or practical consequence.
- Do not make the statement false through tiny wording differences.
- Do not make the statement obviously absurd.
- Prefer a realistic misconception a researcher might have.

Explanation rules:
- Explain why the answer is correct.
- For FALSE statements, clearly state the correct idea.
- Do not mention the context or source material.

${getRandomTrueFalseStylePrompt()}

Internally consider 3 possible statements and choose the strongest one.
Return only the final JSON.

The strongest statement:
- is appropriate for researchers,
- tests judgment rather than sentence recognition,
- is not obvious from wording alone,
- avoids silly or extreme claims,
- and reflects a meaningful distinction about scholarly publishing, predatory practices, or academic integrity.
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
                                        pattern: "^[A-Z]{4,14}$",
                                        description:
                                            "Single uppercase word, A-Z only, 4-14 letters. No spaces, punctuation, hyphens, apostrophes, or numbers.",
                                    },
                                    clue: {
                                        type: "string",
                                        minLength: 20,
                                        maxLength: 300,
                                        description:
                                            "Concise crossword clue, 10-30 words. Must not contain the answer word.",
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
You are a crossword puzzle generator for researchers, graduate students, and early-career academics.
Generate clean, meaningful crossword entries about academic publishing, research integrity, open access, predatory publishing, peer review, journal evaluation, and scholarly communication.
Use the provided terms or their derivatives.
Prioritize natural single-word answers that are suitable for a crossword puzzle.

`.trim(),
            },
            {
                role: "user",
                content: `
PROVIDED TERMS:
${context}

Generate 6-8 crossword entries.

Answer rules:
- Each answer must be exactly ONE natural English word.
- Each answer must use uppercase A-Z letters only.
- Each answer must be 4-14 letters long.
- Do not use spaces, punctuation, hyphens, apostrophes, numbers, or symbols.
- Do not force multiword terms into one artificial word.
- If the source term is multiword, select one meaningful single word from it or a closely related single-word concept.
- Avoid acronyms and abbreviations unless they are widely meaningful in academic publishing.
- Avoid malformed or noisy terms.
- Use natural, commonly used terms. Avoid awkward truncations, rare variants, or shortened forms such as "transpare" when the standard term is "transparency".
- Avoid duplicate answers or near-duplicate concepts.
- Choose answers from the provided terms or from direct single-word concepts strongly implied by them. Do not treat instructions or examples as a word bank.

Bad answer examples:
- OPENACCESS
- PEERREVIEW
- THINKCHECK
- SCIMAGO
- WESTERN
- OMICS
- KSCIENS

Clue rules:
- Intended audience: researchers.
- Each clue must clearly point to the answer.
- Do not include the answer word inside the clue.
- Do not mention context, chunks, papers, studies, or internal sources (assume user will not have access to the context).
- Clues should be natural, concise, and human-readable.
- Clues should test meaningful academic publishing knowledge, not trivia.
`.trim(),
            },
        ],
    });

    const parsed = JSON.parse(resp.choices[0].message.content);

    return parsed.entries;
}

async function generateInfo({ chunk }) {
    const { text } = chunk;
    const response = await callLLMSummarizeContent({ content: text });
    return response;
}

async function generateQuiz({ type, chunks }) {
    let prompt = "";
    let response = {};
    let normalizedRes = {};

    if (type === QUIZ_TYPE.CROSS_WORDS) {
        const { text } = chunks[0];
        const context = shuffleAndTakeTerms(text, 30);
        response = await callLLMCrossword({ context });
        normalizedRes = normalizeCrosswordResponse(response);
    } else if (type === QUIZ_TYPE.TRUE_FALSE) {
        const context = formatChunkIntoContextString(chunks);
        response = await callLLMTrueFalse({ context });
        normalizedRes = normalizeTrueFalseResponse(response);
    } else {
        // By default MCQ
        const context = formatChunkIntoContextString(chunks);
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
