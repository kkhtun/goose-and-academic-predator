const R = require("ramda");

const generateLayout = require("crossword-layout-generator");
const KbChunkModel = require("../models/kb-chunk.model");
const { QUIZ_TYPE, DIFFICULTY } = require("../utils/quiz.util");
const { generateQuiz } = require("./llm/openai.llm-adapter");

function getRandomQuizType() {
    const weights = {
        [QUIZ_TYPE.CROSS_WORDS]: 0.4,
        [QUIZ_TYPE.MCQ]: 0.4,
        [QUIZ_TYPE.TRUE_FALSE]: 0.2,
    };

    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const rand = Math.random() * totalWeight;

    let cumulative = 0;

    for (const [type, weight] of Object.entries(weights)) {
        cumulative += weight;
        if (rand < cumulative) {
            return type;
        }
    }
}

async function retrieveRandomContext({ type = "ABSTRACT", count = 10 }) {
    // For now, retrieve random stuff (not using quizType or difficulty)
    const results = await KbChunkModel.aggregate([
        { $match: { type } },
        { $sample: { size: count } },
    ]);
    return results;
}

async function generateCrossword({ difficulty = DIFFICULTY.MEDIUM }) {
    const chunks = await retrieveRandomContext({ type: "TERM", count: 10 });
    const wordList = await generateQuiz({
        type: QUIZ_TYPE.CROSS_WORDS,
        chunks,
    });
    const layout = generateLayout.generateLayout(wordList);
    return layout;
}

async function generateMcq({ difficulty = DIFFICULTY.MEDIUM }) {
    const chunks = await retrieveRandomContext({ count: 10 });
    const quiz = await generateQuiz({
        type: QUIZ_TYPE.MCQ,
        chunks,
    });
    return quiz;
}

async function generateTrueFalse({ difficulty = DIFFICULTY.MEDIUM }) {
    const chunks = await retrieveRandomContext({ count: 4 });
    const quiz = await generateQuiz({
        type: QUIZ_TYPE.TRUE_FALSE,
        chunks,
    });
    return quiz;
}

const QUIZ_GENERATORS = {
    [QUIZ_TYPE.CROSS_WORDS]: generateCrossword,
    [QUIZ_TYPE.MCQ]: generateMcq,
    [QUIZ_TYPE.TRUE_FALSE]: generateTrueFalse,
};

async function getRandomQuiz({}) {
    const quizType = getRandomQuizType();
    const generator = QUIZ_GENERATORS[quizType] || generateMcq;
    const params = {}; // passed here from args

    return {
        quiz: await generator(params),
        quizType,
    };
}

module.exports = {
    generateCrossword,
    generateMcq,
    generateTrueFalse,
    getRandomQuiz,
};
