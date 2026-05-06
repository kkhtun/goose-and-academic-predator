const mongoose = require("mongoose");
require("dotenv").config();
const QuizModel = require("../models/quiz.model.js");
const {
    generateMcq,
    generateCrossword,
    generateTrueFalse,
    seedBatchQuizzes,
    generateSummarizedInfo,
} = require("../services/quiz.service.js");

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
    return await generateSummarizedInfo({ level: 0 });
}

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // await QuizModel.deleteMany({});
    // console.log("Cleared existing quizzes");

    // const allQuizzes = [];
    // for (const [type, generator] of Object.entries(QUIZ_GENERATORS)) {
    //     console.log(`Generating ${QUIZZES_PER_TYPE} ${type} quizzes...`);
    //     const quizzes = await generateBatch(type, generator, QUIZZES_PER_TYPE);
    //     allQuizzes.push(...quizzes);
    // }

    const res = await seedInfo();
    console.log(res);

    // const allQuizzes = await seedBatchQuizzes({});

    // await QuizModel.insertMany(allQuizzes);
    // console.log(`Inserted ${allQuizzes.length} quizzes`);

    await mongoose.disconnect();
    console.log("Disconnected");
}

seed();
