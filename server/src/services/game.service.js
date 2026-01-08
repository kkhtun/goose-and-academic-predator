const { sendQuizPrompt } = require("./llm/openai.llm-adapter");

function roll() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    return {
        die1,
        die2,
        total: die1 + die2,
    };
}

async function generateQuiz() {
    const quizParams = {
        domain: "ACADEMIC PRACTICE",
        difficulty: "EASY",
        context: "PREDATORY PUBLISHING PRACTICES BY JOURNALS",
    };
    return await sendQuizPrompt(quizParams);
}

module.exports = { roll, generateQuiz };
