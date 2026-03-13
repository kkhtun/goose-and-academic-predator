const R = require("ramda");

const generateLayout = require("crossword-layout-generator");
const KbChunkModel = require("../models/kb-chunk.model");
const { QUIZ_TYPE, DIFFICULTY } = require("../utils/quiz.util");
const { generateQuiz } = require("./llm/openai.llm-adapter");

async function retrieveRandomContext({ count = 10 }) {
    // For now, retrieve random stuff (not using quizType or difficulty)
    const results = await KbChunkModel.aggregate([
        { $sample: { size: count } },
    ]);
    return results;
}

async function generateCrossword({ difficulty = DIFFICULTY.MEDIUM }) {
    const chunks = await retrieveRandomContext({ count: 10 });
    const wordList = await generateQuiz({
        type: QUIZ_TYPE.CROSS_WORDS,
        chunks,
    });
    const layout = generateLayout.generateLayout(wordList);
    return layout;
}

async function generateMcq({ difficulty = DIFFICULTY.MEDIUM }) {
    const chunks = await retrieveRa.ndomContext({ count: 10 });
    const quiz = await generateQuiz({
        type: QUIZ_TYPE.MCQ,
        chunks,
    });
    return quiz;
}

async function getRandomQuiz({}) {
    const quizType =
        Math.random() > 0.5 ? QUIZ_TYPE.CROSS_WORDS : QUIZ_TYPE.MCQ;
    return {
        quiz:
            quizType === QUIZ_TYPE.CROSS_WORDS
                ? await generateCrossword({})
                : await generateMcq({}),
        quizType,
    };
}

module.exports = { generateCrossword, generateMcq, getRandomQuiz };
