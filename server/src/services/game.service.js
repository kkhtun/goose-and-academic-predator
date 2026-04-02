const { v4: uuid } = require("uuid");
const R = require("ramda");

const {
    // callGenerateMcqBatchFromContext,
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
    POSITION_TYPE,
} = require("../utils/game.util");
const {
    DIFFICULTY,
    QUIZ_TYPE,
    checkCrosswordGrid,
} = require("../utils/quiz.util");
const { getRandomQuiz } = require("./quiz.service");
const {
    isString,
    haveSameEntries,
    isArrayOfArrays,
} = require("../utils/common.util");

// Helper functions (calling other underlying models and api clients)

async function retrieveContextFromTopic({
    topic,
    query,
    difficulty: difficultyHint,
    limit = 10,
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

// For frontend
async function startGame({ initialPlayerName: playerName }) {
    // Maybe more players here?

    const playerOneId = uuid();
    const player = {
        playerName,
        playerUniqueId: playerOneId,
        status: PLAYER_STATUS.READY,
    };

    const newGame = new GameModel();
    newGame.moves = [];
    newGame.players = [player];

    const game = await newGame.save();
    return game;
}

async function roll({ gameId, playerUniqueId }) {
    const game = await GameModel.findById(gameId).exec();
    if (!game) throw new CustomError("Game not found");

    // Validity checks
    const player = game.players.find(
        (p) => p.playerUniqueId === playerUniqueId
    );
    if (!player) throw new CustomError("Player not found in game");

    // Check if player is ready (is his turn)
    if (player.status !== PLAYER_STATUS.READY)
        throw new CustomError("Not your turn");

    // Logic here for "can the player move?"
    // Normally, if its not the player's turn cannot move
    // The player or other player is in some state?

    // Figure out current player pos
    const playerMoves = game.moves.filter(
        (move) => move.playerUniqueId === playerUniqueId
    );
    const lastMove = playerMoves[playerMoves.length - 1];
    const current = lastMove ? lastMove.next : 0;

    const dieCount = current >= 85 ? 1 : 2;
    const throwResult = throwDie(dieCount); // ADJUST here if you want particular die throw for testing
    const { total } = throwResult;

    // Initial move by die throw
    let initMove = {
        playerUniqueId,
        current,
        next: adjustPosition(current + total), // Adjust for > 90
        isActive: true,
    };
    initMove.nextType = BOARD_POSITIONS[initMove.next];

    // Based on the type of the box, decide what to do next
    const moves = [initMove];

    while (true) {
        let move = moves[moves.length - 1];
        if (move.nextType === POSITION_TYPE.CHALLENGE) {
            const randomQuiz = await QuizModel.aggregate([
                // { $match: { type: QUIZ_TYPE.CROSS_WORDS } }, // ADJUST here if you want only 1 quiz type for testing
                { $sample: { size: 1 } },
            ]);
            move.content = {
                quiz: randomQuiz.length > 0 ? randomQuiz[0] : templateQuiz,
            };
            break;
        } else if (move.nextType === POSITION_TYPE.INFO) {
            const randomChunk = await KbChunkModel.aggregate([
                { $sample: { size: 1 } },
            ]);
            move.content = {
                info: randomChunk.length > 0 ? randomChunk[0].text : "",
            };
            break;
        } else if (move.nextType === POSITION_TYPE.GOOSE) {
            const newPos = adjustPosition(move.next + total);
            moves.push({
                playerUniqueId,
                current: move.next,
                next: newPos,
                nextType: BOARD_POSITIONS[newPos],
                isActive: true,
            });
        } else if (move.nextType === POSITION_TYPE.JUMP_TURN) {
            break; // Since currently only one player
        } else if (move.nextType === POSITION_TYPE.DICE_TWICE) {
            break; // Since currently only one player
        } else if (move.nextType === POSITION_TYPE.BACK_TO_START) {
            moves.push({
                playerUniqueId,
                current: move.next,
                next: 0,
                nextType: BOARD_POSITIONS[0],
                isActive: true,
            });
            break;
        } else if (move.nextType === POSITION_TYPE.LUCKY) {
            game.players = game.players.map((p) => {
                if (p.playerUniqueId === playerUniqueId) {
                    return { ...p, score: p.score > 0 ? p.score * 2 : 1 }; // Double or if 0, then make 1
                } else {
                    return p;
                }
            });
            break;
        } else if (move.nextType === POSITION_TYPE.PENALTY) {
            // Pay penalty
            game.players = game.players.map((p) => {
                if (p.playerUniqueId === playerUniqueId) {
                    return { ...p, score: Math.max(0, p.score - 2) }; // Mind the 0, currently only 2 marks reduced
                } else {
                    return p;
                }
            });
            // Return to prev position (currently assuming that this is the position the player took off from)
            moves.push({
                playerUniqueId,
                current: move.next,
                next: moves[0].current,
                nextType: BOARD_POSITIONS[moves[0].current],
                isActive: false,
            });
            // Currently, we assume we won't do anything at the previous position even if it is special
            // So we break
            break;
        } else {
            break;
        }
    }

    game.moves.push(...moves);
    await game.save();
    return {
        roll: throwResult,
        moves,
        game: R.omit(["moves"], game.toObject()),
    };
}

async function answerQuiz({ gameId, playerUniqueId, quizId, answer }) {
    // Check answer by the user and increment score

    const game = await GameModel.findById(gameId).exec();
    if (!game) throw new CustomError("Game not found");

    // Validity checks
    const player = game.players.find(
        (p) => p.playerUniqueId === playerUniqueId
    );
    if (!player) throw new CustomError("Player not found in game");

    // Must be the last move (cannot re-answer old questions!!)
    const lastMove = game.moves[game.moves.length - 1];
    if (lastMove.nextType !== POSITION_TYPE.CHALLENGE) {
        throw new CustomError("Cannot answer question at this time");
    }

    const quiz = lastMove.content.quiz;
    if (quiz._id.toString() !== quizId)
        throw new CustomError("Cannot answer question at this time");

    let isCorrect = false;
    const quizContent = quiz.content;
    if (quiz.type === QUIZ_TYPE.CROSS_WORDS) {
        const actualGrid = quizContent.table;
        isCorrect =
            isArrayOfArrays(answer) && checkCrosswordGrid(answer, actualGrid);
    } else if (quiz.type === QUIZ_TYPE.TRUE_FALSE) {
        isCorrect = quizContent.answer === answer;
    } else {
        isCorrect = quizContent.correctAnswer === answer;
    }

    if (isCorrect) {
        // Increase score
        game.players = game.players.map((p) => {
            if (p.playerUniqueId === playerUniqueId) {
                return { ...p, score: p.score + 1 };
            } else {
                return p;
            }
        });
        await game.save();
        return { isCorrect, game: R.omit(["moves"], game.toObject()) };
    }
    return { isCorrect };
}

// Housekeeping
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

// Quizzes
// async function generateMcqBatch({
//     topic,
//     difficulty,
//     kbCount = 10,
//     outputCount = 5,
// }) {
//     // can refine the 'query'
//     const retrievedChunks = await retrieveContextFromTopic({
//         topic,
//         query: `${topic} facts`,
//         difficulty,
//         limit: 100,
//     });

//     // Take first count entries
//     const chunks = retrievedChunks.slice(0, kbCount);

//     const generatedQuizzes = await callGenerateMcqBatchFromContext({
//         topic,
//         difficulty,
//         retrievedChunks: chunks,
//         count: outputCount,
//     });

//     const insertedQuizzes = await QuizModel.insertMany(generatedQuizzes);
//     return insertedQuizzes;
// }

module.exports = {
    retrieveContextFromTopic,
    // API funcs
    startGame,
    roll,
    answerQuiz,
    // House keeping
    getQuiz,
    // generateMcqBatch,
    getTopics,
};
