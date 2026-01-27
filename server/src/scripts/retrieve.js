const mongoose = require("mongoose");
require("dotenv").config();
const { retrieveContext } = require("../services/llm/openai.llm-adapter.js");

async function retrieve() {
  await mongoose.connect(process.env.MONGO_URI);
  const results = await retrieveContext({
    topic: "peer_review",
    query: "How do predatory journals handle peer review?",
    limit: 3,
  });

  console.log(results);
  await mongoose.disconnect();
}
retrieve();
