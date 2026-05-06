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

// async function seedInfo() {
//     await InfoModel.deleteMany({});
//     console.log("Cleared existing infos");

//     const allInfos = await seedBatchInfo({});

//     await InfoModel.insertMany(allInfos);
//     console.log(`Inserted ${allInfos.length} info`);
// }

// async function seedQuizzes() {
//     await QuizModel.deleteMany({});
//     console.log("Cleared existing quizzes");

//     const allQuizzes = await seedBatchQuizzes({});

//     await QuizModel.insertMany(allQuizzes);
//     console.log(`Inserted ${allQuizzes.length} quizzes`);
// }

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // await seedInfo();

    // const res = await generateMcq({ level: 0 });
    // const res = await generateTrueFalse({ level: 0 });
    // const res = await generateCrossword({ level: 0 });
    // console.log(res);

    await mongoose.disconnect();
    console.log("Disconnected");
}

seed();
