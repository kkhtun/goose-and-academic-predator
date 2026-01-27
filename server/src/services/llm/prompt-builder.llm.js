const QUIZ_TYPE = Object.freeze({
  MULTIPLE_CHOICE: "multiple_choice",
});

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

// Build prompt for generation
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

function isString(value) {
  return value && typeof value === "string";
}

// Normalize output
function normalizeQuizObject(obj) {
  const entry = {};
  if (obj.type && Object.values(QUIZ_TYPE).includes(obj.type)) {
    entry.type = obj.type;
  }

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
    isValid: Object.keys(entry).length === 5,
  };
}

module.exports = {
  buildMcqBatchPrompt,
  normalizeQuizObject,
};
