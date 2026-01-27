const mongoose = require("mongoose");
require("dotenv").config();
const KbChunkModel = require("../models/kb-chunk.model.js");
const { testChunks } = require("./testChunks.js");
const { embedText } = require("../services/llm/openai.llm-adapter.js");

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await KbChunkModel.deleteMany({});

    for (const chunk of testChunks) {
        const embedding = await embedText(chunk.text);
        await KbChunkModel.create({
            ...chunk,
            embedding,
        });

        console.log("Inserted:", chunk.topic);
    }

    await mongoose.disconnect();
}

seed();
