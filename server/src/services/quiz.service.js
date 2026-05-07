const R = require("ramda");

const QuizModel = require("../models/quiz.model");
const InfoModel = require("../models/info.model.js"); // Not the best practice to mix services, but will do for now

const generateLayout = require("crossword-layout-generator");
const KbChunkModel = require("../models/kb-chunk.model");
const { QUIZ_TYPE } = require("../utils/quiz.util");
const { generateQuiz, generateInfo } = require("./llm/openai.llm-adapter");
const { REALM_TYPE } = require("../utils/game.util");

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

async function generateSummarizedInfo({ level }) {
    const chunk = await retrieveRandomContext({
        type: "ABSTRACT",
        level: Math.min(level, 1),
        count: 1,
    }).then(R.head);
    const res = await generateInfo({ chunk });
    return { content: res.takeaway || "" };
}

// These two functions fetch pre-generated quiz and info respectively from database
// We use a mix of NEW vs USED quizzes and infos
const NEW_VS_USED_RATIO = 0.5; // For now, we will just use NEW quizzes when possible
async function getQuiz({ type, level, realm }) {
    const basePipeline = [];
    const status = Math.random() < NEW_VS_USED_RATIO ? "NEW" : "USED";

    // Only in heaven?
    // if (realm && realm === REALM_TYPE.HEAVEN) {
    //     pipeline.push({ $match: { type: "QUESTION" } });
    //     pipeline.push({ $sample: { size: 1 } });
    //     return await QuizModel.aggregate(pipeline);
    // }

    if (level) {
        basePipeline.push({ $match: { level } });
    }

    // If there is no type, then will get a random quiz
    if (type) {
        basePipeline.push({ $match: { type } });
    }

    // First try with preferred status
    if (status) {
        const preferredPipeline = [
            ...basePipeline,
            { $match: { status } },
            { $sample: { size: 1 } },
        ];

        const preferredQuiz = await QuizModel.aggregate(preferredPipeline);
        if (preferredQuiz.length > 0) return preferredQuiz[0];
    }

    // Fallback: query without status restriction
    const fallbackPipeline = [...basePipeline, { $sample: { size: 1 } }];
    const randomQuiz = await QuizModel.aggregate(fallbackPipeline);
    return randomQuiz.length > 0 ? randomQuiz[0] : {};
}

async function getInfo({ level }) {
    const basePipeline = [];
    if (level) {
        basePipeline.push({ $match: { level } });
    }
    // First try with preferred status
    const status = Math.random() < NEW_VS_USED_RATIO ? "NEW" : "USED";
    if (status) {
        const preferredPipeline = [
            ...basePipeline,
            { $match: { status } },
            { $sample: { size: 1 } },
        ];

        const preferredInfo = await InfoModel.aggregate(preferredPipeline);
        if (preferredInfo.length > 0) return preferredInfo[0];
    }

    // Fallback: query without status restriction
    const fallbackPipeline = [...basePipeline, { $sample: { size: 1 } }];
    const randomInfo = await InfoModel.aggregate(fallbackPipeline);
    return randomInfo.length > 0 ? randomInfo[0] : {};
}

// These mark the quiz or info as used
async function markQuizUsed({ quizId }) {
    return await QuizModel.findOneAndUpdate(
        { _id: quizId },
        { $set: { status: "USED" } },
        { new: true }
    );
}
async function markInfoUsed({ infoId }) {
    return await InfoModel.findOneAndUpdate(
        { _id: infoId },
        { $set: { status: "USED" } },
        { new: true }
    );
}

// Seed functions to add quizzes (communicate with LLM)
async function getQuizCounts() {
    const result = await QuizModel.aggregate([
        {
            $group: {
                _id: {
                    level: "$level",
                    status: "$status",
                },
                count: { $sum: 1 },
            },
        },
    ]);
    const output = {
        0: { NEW: 0, USED: 0 },
        1: { NEW: 0, USED: 0 },
        2: { NEW: 0, USED: 0 },
    };

    for (const row of result) {
        const { level, status } = row._id;
        output[level][status] = row.count;
    }
    return output;
}

async function getInfoCounts() {
    const result = await InfoModel.aggregate([
        {
            $group: {
                _id: {
                    level: "$level",
                    status: "$status", // No level awareness in info
                },
                count: { $sum: 1 },
            },
        },
    ]);
    const output = {
        0: { NEW: 0, USED: 0 },
        1: { NEW: 0, USED: 0 },
        2: { NEW: 0, USED: 0 },
    };

    for (const row of result) {
        const { level, status } = row._id;
        output[level][status] = row.count;
    }
    return output;
}

async function addBatchInfo({}) {
    const levels = [0, 1, 2];

    const INFO_PER_LEVEL = 2;
    const CONCURRENCY_LIMIT = 2;

    const infoPlan = levels.flatMap((level) =>
        Array.from({ length: INFO_PER_LEVEL }, () => ({ level }))
    );

    const results = [];
    for (let i = 0; i < infoPlan.length; i += CONCURRENCY_LIMIT) {
        const batchPlan = infoPlan.slice(i, i + CONCURRENCY_LIMIT);

        const batch = batchPlan.map(async ({ level }) => {
            try {
                const { content } = await generateSummarizedInfo({
                    level: level >= 2 ? 1 : level, // For now, we don't have level 2 chunks so we reuse from level 1
                });
                return {
                    content,
                    level,
                };
            } catch (err) {
                console.error(
                    `Error generating info level ${level}:`,
                    err.message
                );
                return null;
            }
        });

        const resolved = await Promise.all(batch);
        results.push(...resolved.filter(Boolean));
    }

    await InfoModel.insertMany(results);
    console.log(`Inserted ${results.length} info`);
}

async function seedBatchQuizzes({ levels = [] } = {}) {
    // Note: We do not need to consider realm here
    // Generate n MCQ / Crossword / TF quizzes for each level 0, 1
    // Generate question only quizzes for level 2
    // But for now, we will use level 1 chunks for generating level 2 quizzes
    levels = levels.length > 0 ? levels : [0, 1, 2];

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
        const batchPlan = quizPlan.slice(i, i + CONCURRENCY_LIMIT);
        const batch = batchPlan.map(async ({ type, level }) => {
            try {
                const generator = QUIZ_GENERATORS[type];
                const content = await generator({
                    level: level >= 2 ? 1 : level,
                });
                return {
                    type,
                    content,
                    level,
                };
            } catch (err) {
                console.error(`Error generating ${type}:`, err.message);
                return null;
            }
        });
        const resolved = await Promise.all(batch);
        results.push(...resolved.filter(Boolean));
    }

    await QuizModel.insertMany(results);
    console.log(`Inserted ${results.length} quizzes`);
}

module.exports = {
    generateCrossword,
    generateMcq,
    generateTrueFalse,
    getQuizCounts,
    getInfoCounts,
    getQuiz,
    getInfo,
    markQuizUsed,
    markInfoUsed,
    seedBatchQuizzes,
    addBatchInfo,
    generateSummarizedInfo,
};
