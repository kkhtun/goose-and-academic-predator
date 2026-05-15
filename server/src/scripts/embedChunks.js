require("dotenv").config();
const mongoose = require("mongoose");
const KbChunkModel = require("../models/kb-chunk.model");
const {
    EMBEDDING_MODEL,
    embedText,
} = require("../services/llm/openai.llm-adapter");

async function backfillChunkEmbeddings() {
    const cursor = KbChunkModel.find({
        type: { $in: ["ABSTRACT", "QUESTION"] },
        $or: [
            { embedding: { $exists: false } },
            { embedding: { $size: 0 } },
            { embeddingModel: { $ne: EMBEDDING_MODEL } },
        ],
    }).cursor();

    let count = 0;

    for await (const chunk of cursor) {
        if (typeof chunk.text !== "string" || !chunk.text.trim()) {
            continue;
        }

        const embedding = await embedText(chunk.text);

        chunk.embedding = embedding;
        chunk.embeddingModel = EMBEDDING_MODEL;

        await chunk.save();

        count += 1;
        console.log(`Embedded ${count}: ${chunk._id}`);
    }

    console.log(`Done. Embedded ${count} chunks.`);
}

async function embedChunks() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    await backfillChunkEmbeddings();
    await mongoose.disconnect();
    console.log("Disconnected");
}

embedChunks();
