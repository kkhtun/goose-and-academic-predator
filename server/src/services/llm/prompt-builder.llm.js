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
  "question_id": "string",
  "type": "multiple_choice",
  "difficulty": "${difficulty}",
  "question_text": "string",
  "options": ["A","B","C","D"],
  "correct_answer": "string",
  "explanation": "string (refer to context)",
  "source_ids": []
}
`;
}

function normalizeQuiz(raw) {
    try {
        const obj = JSON.parse(raw);
        return {
            question_id: obj.question_id || "unknown",
            type: obj.type || "multiple_choice",
            difficulty: obj.difficulty,
            question_text: obj.question_text,
            options: obj.options || [],
            correct_answer: obj.correct_answer,
            explanation: obj.explanation || "",
            source_ids: obj.source_ids || [],
        };
    } catch (err) {
        console.error("LLM returned invalid JSON:", raw);
        throw new Error("InvalidQuizFormat");
    }
}

module.exports = { buildQuizPrompt, normalizeQuiz };
