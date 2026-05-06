const mongoose = require("mongoose");
require("dotenv").config();
const QuizModel = require("../models/quiz.model.js");
const {
    generateMcq,
    generateCrossword,
    generateTrueFalse,
    seedBatchQuizzes,
    generateSummarizedInfo,
    seedBatchInfo,
} = require("../services/quiz.service.js");
const InfoModel = require("../models/info.model.js");

const QUIZ_GENERATORS = {
    MCQ: generateMcq,
    CROSS_WORDS: generateCrossword,
    TRUE_FALSE: generateTrueFalse,
};

const QUIZZES_PER_TYPE = 12;
const CONCURRENCY_LIMIT = 3; // avoid hammering LLM APIs

// async function generateBatch(type, generator, count) {
//     const results = [];

//     for (let i = 0; i < count; i += CONCURRENCY_LIMIT) {
//         const batch = Array.from({ length: CONCURRENCY_LIMIT }, async () => {
//             try {
//                 const content = await generator({});
//                 return {
//                     type,
//                     content,
//                 };
//             } catch (err) {
//                 console.error(`Error generating ${type}:`, err.message);
//                 return null;
//             }
//         });

//         const resolved = await Promise.all(batch);
//         results.push(...resolved.filter(Boolean));
//     }

//     return results;
// }

async function seedInfo() {
    await InfoModel.deleteMany({});
    console.log("Cleared existing infos");

    const allInfos = await seedBatchInfo({});

    await InfoModel.insertMany(allInfos);
    console.log(`Inserted ${allInfos.length} info`);
}

async function seedQuizzes() {
    await QuizModel.deleteMany({});
    console.log("Cleared existing quizzes");

    const allQuizzes = await seedBatchQuizzes({});

    await QuizModel.insertMany(allQuizzes);
    console.log(`Inserted ${allQuizzes.length} quizzes`);
}

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    await seedInfo();

    await mongoose.disconnect();
    console.log("Disconnected");
}

seed();
