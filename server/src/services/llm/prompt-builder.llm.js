const { isString } = require("../../utils/common.util");

// function buildMultipleChoiceQuizPrompt({
//   domain,
//   difficulty,
//   context,
//   count = 10,
// }) {
//   return `
// You are a quiz generator. Use ONLY the information in the CONTEXT section.
// If the answer is unknown, say so explicitly in the explanation.

// DOMAIN: ${domain}
// DIFFICULTY: ${difficulty}
// COUNT: ${count}
// CONTEXT:
// ${context}

// OUTPUT STRICTLY AS VALID JSON (no markdown, no extra text).
// Return a JSON array of exactly ${count} objects in this format:

// {
//   "type": ${QUIZ_TYPE.MULTIPLE_CHOICE},
//   "questionText": "string",
//   "options": ["A","B","C","D"],
//   "correctAnswer": "string",
//   "explanation": "string"
// }

// Rules:
// - "correctAnswer" must be exactly one of the values in "options".
// - Options must be plausible and distinct.
// `;
// }

// Build MCQ prompt for generation
function buildMcqBatchPrompt({ topic, difficulty, context, count = 3 }) {
    return `
You are a quiz generator. Use ONLY the information in the CONTEXT section.
Do NOT use outside knowledge. Each question must be fully answerable from the CONTEXT.

TOPIC: ${topic}
DIFFICULTY: ${difficulty}
COUNT: ${count}

CONTEXT:
${context}

OUTPUT STRICTLY AS VALID JSON (no markdown, no extra text).
Return a JSON array of exactly ${count} objects in this format:

[
  {
    "type": "multiple_choice",
    "questionText": "string",
    "options": ["A","B","C","D"],
    "correctAnswer": "A|B|C|D",
    "explanation": "string"
  }
]

Rules:
- No duplicates within the batch.
- Options must be plausible and distinct.
- correctAnswer must be exactly one of the options ("A","B","C","D").
- Keep explanations short and clearly tied to the CONTEXT.
`;
}

// Build Crossword prompt for generation
function buildCrosswordPrompt({ topic, difficulty, context, wordCount = 8 }) {
    return `
You are a crossword puzzle generator.

Use ONLY the information in the CONTEXT section.
Do NOT use outside knowledge.

DIFFICULTY: ${difficulty}
COUNT: ${wordCount}

CONTEXT:
${context}

Your task:
Generate ${wordCount} crossword entries based strictly on the context.

OUTPUT STRICTLY AS VALID JSON (no markdown, no extra text).
Return a JSON array of exactly ${wordCount} objects in this format:

[
  {
    "answer": "WORD",
    "clue": "crossword clue"
  }
]

Rules:
- "answer" must be a SINGLE WORD in uppercase.
- Only letters A-Z (no spaces, no hyphens).
- Word length must be between 4 and 10 letters.
- Clues must be concise (10-30 words).
- Each clue must be clearly answerable using the CONTEXT.
- Avoid duplicates.
- Avoid very obscure terms.
- Prefer important concepts or entities from the CONTEXT.
- Do NOT include the answer word inside the clue.
`;
}

function buildMcqPrompt({ topic, difficulty, context }) {
    return `
You are a quiz generator. Use ONLY the information in the CONTEXT section.
Do NOT use outside knowledge. The question must be fully answerable from the CONTEXT.

DIFFICULTY: ${difficulty}

CONTEXT:
${context}

Generate ONE multiple choice question.

OUTPUT STRICTLY AS VALID JSON (no markdown, no extra text).
Return exactly ONE object in this format:

{
  "questionText": "string",
  "options": ["A","B","C","D"],
  "correctAnswer": "A|B|C|D",
  "explanation": "string"
}

Rules:
- The question must be clearly answerable from the CONTEXT.
- Options must be plausible and distinct.
- Only ONE option can be correct.
- "correctAnswer" must match exactly one of the options ("A","B","C","D").
- Write explanations in natural, human-readable language as if explaining the answer to a person (Do NOT reference CONTEXT, CHUNK numbers or internal sources).
`;
}

function buildTrueFalsePrompt({ topic, difficulty, context }) {
    return `
You are a quiz generator. Use ONLY the information in the CONTEXT section.
Do NOT use outside knowledge. The statement must be fully verifiable from the CONTEXT.

DIFFICULTY: ${difficulty}

CONTEXT:
${context}

Generate ONE true/false statement.

OUTPUT STRICTLY AS VALID JSON (no markdown, no extra text).
Return exactly ONE object in this format:

{
  "statement": "string",
  "answer": true,
  "explanation": "string"
}

Rules:
- The statement must be clearly verifiable as TRUE or FALSE from the CONTEXT.
- Ensure a balanced mix of TRUE and FALSE across multiple generations (do not always return TRUE).
- The statement should be concise and unambiguous.
- "answer" must be a boolean: true or false.
- Write explanations in natural, human-readable language as if explaining the answer to a person (Do NOT reference CONTEXT, CHUNK numbers or internal sources).
`;
}

function normalizeMcqResponse(obj) {
    const entry = {};

    if (isString(obj.questionText)) {
        entry.questionText = obj.questionText;
    }

    if (obj.options && Array.isArray(obj.options) && obj.options.length >= 4) {
        entry.options = obj.options;
    }

    if (isString(obj.correctAnswer) && obj.correctAnswer.length === 1) {
        entry.correctAnswer = obj.correctAnswer;
    }

    if (isString(obj.explanation)) {
        entry.explanation = obj.explanation;
    }

    return {
        entry,
        isValid: Object.keys(entry).length === 4,
    };
}

function normalizeTrueFalseResponse(obj) {
    const entry = {};

    if (isString(obj.statement)) {
        entry.statement = obj.statement;
    }

    if (typeof obj.answer === "boolean") {
        entry.answer = obj.answer;
    }

    if (isString(obj.explanation)) {
        entry.explanation = obj.explanation;
    }

    return {
        entry,
        isValid: Object.keys(entry).length === 3,
    };
}

function normalizeCrosswordResponse(arr) {
    // Maybe check if 6-8 words?
    console.log("LLM Response for CROSS_WORDS", arr);
    const filteredWords = arr.filter((item) => {
        if (typeof item !== "object" || item === null) return false;
        const { answer, clue } = item;

        if (typeof answer !== "string") return false;
        if (!/^[A-Z]{4,}$/.test(answer)) return false;
        if (typeof clue !== "string") return false;
        if (clue.trim().length === 0) return false;
        return true;
    });

    return { isValid: filteredWords.length >= 6, entry: filteredWords };
}

module.exports = {
    buildMcqBatchPrompt,
    // normalizeQuizObject,
    // Single normalize
    normalizeCrosswordResponse,
    normalizeMcqResponse,
    normalizeTrueFalseResponse,
    // Single quiz builder prompts
    buildTrueFalsePrompt,
    buildCrosswordPrompt,
    buildMcqPrompt,
};
