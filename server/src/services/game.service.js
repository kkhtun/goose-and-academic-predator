const { v4: uuid } = require("uuid");

const {
    callGenerateMcqBatchFromContext,
    embedText,
} = require("./llm/openai.llm-adapter");
const KbChunkModel = require("../models/kb-chunk.model");
const GameModel = require("../models/game.model");
const QuizModel = require("../models/quiz.model");
const { CustomError } = require("../utils/CustomError");

// Helper functions (calling other underlying models and api clients)

async function retrieveContext({
    topic,
    query,
    difficulty: difficultyHint,
    limit,
}) {
    // Embed the query
    const queryVector = await embedText(query);

    // Vector search in MongoDB
    const results = await KbChunkModel.aggregate([
        {
            $vectorSearch: {
                index: "embedding_vector_indx", // name of your Atlas vector index
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

async function startGame({}) {
    const newGame = new GameModel();
    const game = await newGame.save();
    return game;
}

async function roll({ id, playerNum }) {
    const game = await GameModel.findById(id).exec();
    if (!game) throw new CustomError("Game not found");

    // Logic here for "can the player move?"

    // Normally, if its not the player's turn cannot move
    // The player or other player is in some state?

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;

    const playerMoves = game.moves.filter((move) => move.player === playerNum);
    const lastMove = playerMoves[playerMoves.length - 1];
    const currentPosition = lastMove ? lastMove.position : 0;
    const newPosition = currentPosition + total;

    const newMove = { player: playerNum, position: newPosition };
    game.moves.push(newMove);

    // Maybe some logic if player encounter stuff

    await game.save();
    return { die1, die2, total, newPosition };
}

async function getQuiz({ topic, difficulty }) {
    const query = topic || difficulty ? { topic, difficulty } : {};
    const quiz = await QuizModel.findOne(query).exec();
    if (!quiz) throw new CustomError("No quiz found");
    return quiz;
}

async function getTopics() {
    const topicGroups = await KbChunkModel.aggregate([
        { $group: { _id: null, topic: { $addToSet: "$topic" } } },
    ]);
    const topics = topicGroups[0].topic || [];
    return { data: topics, count: topics.length };
}

async function generateMcqBatch({ topic, difficulty, count = 3 }) {
    // can refine the 'query'
    const retrievedChunks = await retrieveContext({
        topic,
        query: `${topic} facts`,
        difficulty,
        limit: 20,
    });

    // Take first count entries
    const chunks = retrievedChunks.slice(0, count);

    const generatedQuizzes = await callGenerateMcqBatchFromContext({
        topic,
        difficulty,
        retrievedChunks: chunks,
        count: chunks.length,
    });

    const insertedQuizzes = await QuizModel.insertMany(generatedQuizzes);
    return insertedQuizzes;
}

module.exports = {
    retrieveContext,
    // API funcs
    startGame,
    roll,
    getQuiz,
    generateMcqBatch,
    getTopics,
};
