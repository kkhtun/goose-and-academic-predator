function buildQuizPrompt({ domain, difficulty, context }) {
  return `
You are a quiz generator. Use ONLY the information in the CONTEXT section.
If the answer is unknown, say so explicitly in the explanation.

DOMAIN: ${domain}
DIFFICULTY: ${difficulty}
CONTEXT:
${context}

OUTPUT STRICTLY IN THIS JSON FORMAT:
{
  "type": "multiple_choice",
  "question_text": "string",
  "options": ["A","B","C","D"],
  "correct_answer": "string",
  "explanation": "string"
}
`;
}

// Normalize output
function normalizeQuiz(raw) {
  try {
    const obj = JSON.parse(raw);
    return {
      type: obj.type || "multiple_choice",
      question_text: obj.question_text,
      options: obj.options || [],
      correct_answer: obj.correct_answer,
      explanation: obj.explanation || "",
    };
  } catch (err) {
    console.error("LLM returned invalid JSON:", raw);
    throw new Error("InvalidQuizFormat");
  }
}

module.exports = { buildQuizPrompt, normalizeQuiz };
