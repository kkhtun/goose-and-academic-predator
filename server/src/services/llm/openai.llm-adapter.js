const OpenAI = require("openai");

const { buildQuizPrompt, normalizeQuiz } = require("./prompt-builder.llm");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendQuizPrompt(params) {
  const prompt = buildQuizPrompt(params);

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "We generate quiz questions in strict JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 400,
  });

  const raw = completion.choices[0].message.content;
  return normalizeQuiz(raw);
}

module.exports = {
  sendQuizPrompt,
};
