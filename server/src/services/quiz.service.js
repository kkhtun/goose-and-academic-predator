const R = require("ramda");

const QuizModel = require("../models/quiz.model");

const generateLayout = require("crossword-layout-generator");
const KbChunkModel = require("../models/kb-chunk.model");
const { QUIZ_TYPE } = require("../utils/quiz.util");
const { generateQuiz } = require("./llm/openai.llm-adapter");
const { REALM_TYPE } = require("../utils/game.util");

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

async function retrieveRandomContext({ type = "ABSTRACT", level, count = 1 }) {
    const pipeline = [{ $match: { type } }];

    if (level) {
        pipeline.push({ $match: { level } });
    }

    pipeline.push({ $sample: { size: count } });

    const results = await KbChunkModel.aggregate(pipeline);
    return results;
}

async function generateCrossword({ level }) {
    const chunks = await retrieveRandomContext({
        type: "TERM",
        level,
        count: 2,
    });
    const wordList = await generateQuiz({
        type: QUIZ_TYPE.CROSS_WORDS,
        chunks,
    });
    const layout = generateLayout.generateLayout(wordList);
    return layout;
}

async function generateMcq({ level }) {
    const chunks = await retrieveRandomContext({
        type: "ABSTRACT",
        level,
        count: 2,
    });
    const quiz = await generateQuiz({
        type: QUIZ_TYPE.MCQ,
        chunks,
    });
    return quiz;
}

async function generateTrueFalse({ level }) {
    const chunks = await retrieveRandomContext({
        type: "ABSTRACT",
        level,
        count: 1,
    });
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

async function getQuiz({ type, level, realm }) {
    const pipeline = [];

    // Only in heaven?
    // if (realm && realm === REALM_TYPE.HEAVEN) {
    //     pipeline.push({ $match: { type: "QUESTION" } });
    //     pipeline.push({ $sample: { size: 1 } });
    //     return await QuizModel.aggregate(pipeline);
    // }

    if (level) {
        pipeline.push({ $match: { level } });
    }

    // If there is no type, then will get a random quiz
    if (type) {
        pipeline.push({ $match: { type } });
    }

    pipeline.push({ $sample: { size: 1 } });
    const randomQuiz = await QuizModel.aggregate(pipeline);
    return randomQuiz.length > 0 ? randomQuiz[0] : {}; // Maybe template quiz here if {}
}

async function seedBatchQuizzes({}) {
    // Note: We do not need to consider realm here
    // Generate n MCQ / Crossword / TF quizzes for each level 0, 1
    // Generate question only quizzes for level 2
    // But for now, we will use level 1 chunks for generating level 2 quizzes
    const levels = [0, 1, 2];

    const QUIZZES_PER_TYPE = 2;
    const CONCURRENCY_LIMIT = 2; // avoid hammering LLM APIs

    const quizPlan = levels.flatMap((level) =>
        Object.values(QUIZ_TYPE).flatMap((type) =>
            Array.from({ length: QUIZZES_PER_TYPE }, () => ({
                level,
                type,
            }))
        )
    );

    // We can add open-question type quiz here later!

    // Generation start
    const results = [];
    for (let i = 0; i < quizPlan.length; i += CONCURRENCY_LIMIT) {
        const { type, level } = quizPlan[i];
        const generator = QUIZ_GENERATORS[type];
        const batch = Array.from({ length: CONCURRENCY_LIMIT }, async () => {
            try {
                const content = await generator({
                    level: level >= 2 ? 1 : level, // For now, we don't have level 2 question quizzes so we reuse level 1 quizzes for level 2
                });
                return {
                    type,
                    content,
                    level, // Final formatting for quiz insertion happens here
                };
            } catch (err) {
                console.error(`Error generating ${type}:`, err.message);
                return null;
            }
        });

        const resolved = await Promise.all(batch);
        results.push(...resolved.filter(Boolean));
    }

    return results;
}

module.exports = {
    generateCrossword,
    generateMcq,
    generateTrueFalse,
    getRandomQuiz,
    getQuiz,
    seedBatchQuizzes,
};
