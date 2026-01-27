require("dotenv").config();
const mongoose = require("mongoose");
const { retrieveContext } = require("../services/game.service");

async function retrieve() {
    await mongoose.connect(process.env.MONGO_URI);
    const results = await retrieveContext({
        topic: "predatory_publishing",
        difficulty: "medium",
        query: "How do predatory journals handle peer review?",
        limit: 100,
    });

    console.log(results);
    await mongoose.disconnect();
}
retrieve();
