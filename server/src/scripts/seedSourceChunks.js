const mongoose = require("mongoose");
require("dotenv").config();
const KbChunkModel = require("../models/kb-chunk.model.js");
// const { embedText } = require("../services/llm/openai.llm-adapter.js");
const fs = require("fs");
const path = require("path");

async function seedAbstract() {
    const seedDir = path.join(__dirname, "kb-seed-abstract");
    const files = fs.readdirSync(seedDir).filter((f) => f.endsWith(".json"));
    const testChunks = files.flatMap((file) =>
        JSON.parse(fs.readFileSync(path.join(seedDir, file), "utf-8"))
    );
    console.log(
        `[SEEDING ABSTRACT] Found ${testChunks.length} chunks across ${files.length} files.`
    );

    const result = await KbChunkModel.insertMany(testChunks);
    console.log(`[SEEDING ABSTRACT] Inserted ${result.length} chunks.`);

    // const embedding = [];

    // for (const chunk of testChunks) {
    //     // const embedding = await embedText(chunk.text);
    //     await KbChunkModel.create({
    //         ...chunk,
    //         embedding,
    //     });

    //     console.log("Inserted:", chunk.topic);
    // }

    // await mongoose.disconnect();
}

async function seedTerms() {
    const seedDir = path.join(__dirname, "kb-seed-terms");
    const files = fs.readdirSync(seedDir).filter((f) => f.endsWith(".json"));
    const testChunks = files.flatMap((file) =>
        JSON.parse(fs.readFileSync(path.join(seedDir, file), "utf-8"))
    );
    console.log(
        `[SEEDING TERMS] Found ${testChunks.length} chunks across ${files.length} files.`
    );

    const result = await KbChunkModel.insertMany(testChunks);
    console.log(`[SEEDING TERMS] Inserted ${result.length} chunks.`);
}

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await KbChunkModel.deleteMany({});

    try {
        await seedAbstract();
        await seedTerms();
    } catch (err) {
        console.error("[SEEDING] Insert failed:", err);
    }

    await mongoose.disconnect();
}

seed();
