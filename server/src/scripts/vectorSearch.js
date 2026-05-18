require("dotenv").config();
const mongoose = require("mongoose");
const { getRandomAnchor } = require("../models/anchors");
const {
    embedText,
    EMBEDDING_MODEL,
} = require("../services/llm/openai.llm-adapter");
const { retrieveRandomContext } = require("../services/quiz.service");
const KbChunkModel = require("../models/kb-chunk.model");

// async function buildEmbeddings() {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to DB");

//     // use KbChunkModel attribute embedding and embeddingModel
//     // extract only type where ABSTRACT

//     await mongoose.disconnect();
//     console.log("Disconnected");
// }

async function testVectorSearch() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const anchor = getRandomAnchor();
    const queryEmbedding = await embedText(anchor.text);

    const results = await retrieveRandomContext({
        type: ["ABSTRACT", "QUESTION"],
        count: 1,
        queryEmbedding,
    });

    console.log("Anchor:", anchor.id, anchor.label);
    for (const result of results) {
        console.log("----");
        console.log("Score:", result.vectorScore);
        console.log("Type:", result.type);
        console.log("Source:", result.sourceTitle);
        console.log(result.text);
        console.log("\n");
    }

    await mongoose.disconnect();
    console.log("Disconnected");
}

testVectorSearch();
