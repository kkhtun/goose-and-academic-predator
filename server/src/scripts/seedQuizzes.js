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

async function setAllInfoToNew() {
    const result = await InfoModel.updateMany({}, { $set: { status: "NEW" } });
    console.log(`Matched ${result.matchedCount} info`);
    console.log(`Updated ${result.modifiedCount} info`);
    return result;
}

async function setAllQuizzesToNew() {
    const result = await QuizModel.updateMany({}, { $set: { status: "NEW" } });
    console.log(`Matched ${result.matchedCount} quizzes`);
    console.log(`Updated ${result.modifiedCount} quizzes`);
    return result;
}

async function setAllEntriesToNew() {
    await setAllQuizzesToNew();
    await setAllInfoToNew();
}

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    // await setAllEntriesToNew();
    await seedInfo(true);
    await seedQuizzes(true);

    // const res = await generateMcq({ level: 0 });
    // const res = await generateTrueFalse({ level: 0 });
    // const res = await generateCrossword({ level: 0 });
    // const res = await generateSummarizedInfo({
    //     level: 2,
    //     realm: REALM_TYPE.SAVELIST,
    // });
    // console.log(res);

    await mongoose.disconnect();
    console.log("Disconnected");
}

seed();
