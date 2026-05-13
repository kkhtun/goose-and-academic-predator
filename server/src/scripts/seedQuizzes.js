const mongoose = require("mongoose");
require("dotenv").config();
const QuizModel = require("../models/quiz.model.js");
const {
    generateMcq,
    generateCrossword,
    generateTrueFalse,
    seedBatchQuizzes,
    generateSummarizedInfo,
    addBatchInfo,
} = require("../services/quiz.service.js");
const InfoModel = require("../models/info.model.js");
const { REALM_TYPE } = require("../utils/game.util.js");

async function seedInfo(append = false) {
    if (!append) {
        await InfoModel.deleteMany({});
        console.log("Cleared existing infos");
    }
    await addBatchInfo({});
}

async function seedQuizzes(append = false) {
    if (!append) {
        await QuizModel.deleteMany({});
        console.log("Cleared existing quizzes");
    }
    await seedBatchQuizzes({});
}

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    await seedInfo(true);
    await seedQuizzes(true);

    // const res = await generateMcq({ level: 0 });
    // const res = await generateTrueFalse({ level: 0 });
    // const res = await generateCrossword({ level: 0 });
    // const res = await generateSummarizedInfo({
    //     level: 2,
    //     realm: REALM_TYPE.HEAVEN,
    // });
    // console.log(res);

    await mongoose.disconnect();
    console.log("Disconnected");
}

seed();
