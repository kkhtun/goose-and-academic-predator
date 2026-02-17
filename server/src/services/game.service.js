const { v4: uuid } = require("uuid");
const {
    callGenerateMcqBatchFromContext,
    embedText,
} = require("./llm/openai.llm-adapter");
const KbChunkModel = require("../models/kb-chunk.model");
const GameModel = require("../models/game.model");
const QuizModel = require("../models/quiz.model");
const { CustomError } = require("../utils/CustomError");
const {
    PLAYER_STATUS,
    throwDie,
    adjustPosition,
    BOARD_POSITIONS,
} = require("../utils/game.util");

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
    // Maybe more players here?

    const playerOneId = uuid();
    const player = {
        playerNum: 1,
        playerUniqueId: playerOneId,
        status: PLAYER_STATUS.READY,
    };

    const newGame = new GameModel();
    newGame.moves = [];
    newGame.players = [player];

    const game = await newGame.save();
    return { game, player };
}

async function roll({ gameId, playerUniqueId, playerNum }) {
    const game = await GameModel.findById(gameId).exec();
    if (!game) throw new CustomError("Game not found");

    // Validity checks
    const player = game.players.find(
        (p) => p.playerUniqueId === playerUniqueId && p.playerNum === playerNum
    );
    if (!player) throw new CustomError("Player not found in game");

    // Check if player is ready (is his turn)
    if (player.status !== PLAYER_STATUS.READY)
        throw new CustomError("Not your turn");

    // Logic here for "can the player move?"
    // Normally, if its not the player's turn cannot move
    // The player or other player is in some state?

    const { die1, die2, total } = throwDie();

    // Figure out current player pos
    const playerMoves = game.moves.filter(
        (move) => move.playerNum === playerNum
    );
    const lastMove = playerMoves[playerMoves.length - 1];
    const current = lastMove ? lastMove.next : 1;

    // Initial move by die throw
    const initialMove = {
        playerNum,
        current,
        next: adjustPosition(current + total), // Adjust for > 90
    };
    initialMove.nextType = BOARD_POSITIONS[initialMove.next];

    // Based on the type of the box, decide what to do next

    // Currently player is READY always since only one player
    // Add logic to change statuses if more than one player
    // Maybe some logic if player encounter stuff

    const moves = [];
    game.moves.push(initialMove);
    await game.save();
    return {
        roll: { die1, die2, total },
        moves,
        turn: {
            playerNum,
            playerUniqueId,
        },
    };
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
