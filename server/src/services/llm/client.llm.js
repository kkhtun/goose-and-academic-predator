const { openaiAdapter } = require("./openai.llm-adapter.js");

const provider = "openai";
const adapters = {
    openai: openaiAdapter,
    // vllm: vllmAdapter,
};

module.exports = {
    llmClient: adapters[provider],
};
