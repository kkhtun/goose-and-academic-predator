const {
  callGenerateMcqBatchFromContext,
  embedText,
} = require("./llm/openai.llm-adapter");
const KbChunkModel = require("../models/kb-chunk.model");

// Helper functions (calling other underlying models and api clients)

async function retrieveContext({
  topic,
  query,
  difficulty: difficultyHint,
  limit = 3,
}) {
  // Embed the query
  const queryVector = await embedText(query);

  // Vector search in MongoDB
  const results = await KbChunkModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index", // name of your Atlas vector index
        path: "embedding",
        queryVector,
        numCandidates: 100,
        limit,
        filter: {
          topic,
          ...(difficultyHint ? { difficultyHint } : {}),
        },
      },
    },
    {
      $project: {
        text: 1,
        topic: 1,
        difficultyHint: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
}

// API functions (mapping 1 to 1 with api endpoints)

function roll() {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  return {
    die1,
    die2,
    total: die1 + die2,
  };
}

async function getQuiz({ topic, difficulty }) {
  return { topic, difficulty };
}

async function getTopics() {
  const topicGroups = await KbChunkModel.aggregate([
    { $group: { _id: null, topic: { $addToSet: "$topic" } } },
  ]);
  const topics = topicGroups[0].topic || [];
  return topics;
}

async function generateMcqBatch({ topic, difficulty, count = 3 }) {
  const chunks = await retrieveContext({
    topic,
    query: `${topic} facts`,
    difficulty,
    limit: 3,
  });

  const generatedQuizzes = await callGenerateMcqBatchFromContext({
    topic,
    difficulty,
    retrievedChunks: chunks,
    count: chunks.length,
  });
  return generatedQuizzes;
}

module.exports = { roll, getQuiz, generateMcqBatch, getTopics };
