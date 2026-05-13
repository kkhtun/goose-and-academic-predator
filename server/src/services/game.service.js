const { v4: uuid } = require("uuid");
const R = require("ramda");

const {
    // callGenerateMcqBatchFromContext,
    embedText,
} = require("./llm/openai.llm-adapter");
const KbChunkModel = require("../models/kb-chunk.model");
const GameModel = require("../models/game.model");
const QuizService = require("../services/quiz.service");
const { CustomError } = require("../utils/CustomError");
const {
    PLAYER_STATUS,
    throwDie,
    adjustPosition,
    BOARD_POSITIONS,
    POSITION_TYPE,
    formatGameInfoForClientStore,
    findPlayer,
    getRealm,
    getLevel,
} = require("../utils/game.util");
const {
    DIFFICULTY,
    QUIZ_TYPE,
    checkCrosswordGrid,
} = require("../utils/quiz.util");
const {
    isString,
    haveSameEntries,
    isArrayOfArrays,
} = require("../utils/common.util");
const { triggerRefillQuizzes } = require("./job.service");

// API functions (mapping 1 to 1 with api endpoints)

// For frontend
async function startGame({ playerName, avatar }) {
    // Maybe more players here?

    const playerOneId = uuid();
    const player = {
        playerName,
        avatar,
        playerUniqueId: playerOneId,
        status: PLAYER_STATUS.READY,
    };

    const newGame = new GameModel();
    newGame.moves = [];
    newGame.players = [player];
    newGame.turnPlayerId = playerOneId;

    const game = await newGame.save();
    return {
        playerUniqueId: playerOneId,
        gameInfo: formatGameInfoForClientStore(game),
    };
}

async function addPlayer({ gameId, playerName, avatar }) {
    // Maybe more players here?

    const playerUniqueId = uuid();
    const player = {
        playerName,
        playerUniqueId,
        avatar,
        status: PLAYER_STATUS.READY,
    };

    const game = await GameModel.findById(gameId);
    if (!game) throw new CustomError("Game not found");

    // Check cannot join already started games
    if (game.moves.length !== 0)
        throw new CustomError("Cannot join already started games.");

    game.players.push(player);
    if (!game.turnPlayerId) game.turnPlayerId = playerUniqueId;
    const updatedGame = await game.save();

    return {
        playerUniqueId,
        gameInfo: formatGameInfoForClientStore(updatedGame),
    };
}

async function getGame({ gameId }) {
    const game = await GameModel.findById(gameId);
    return game;
}

async function validateGamePlayer({ gameId, playerUniqueId }) {
    const game = await GameModel.findById(gameId);
    if (!game) throw new CustomError("Game not found");

    // Validity checks
    const player = game.players.find(
        (p) => p.playerUniqueId === playerUniqueId
    );
    if (!player) throw new CustomError("Player not found in game");

    return { game, player };
}

async function roll({ game, player }) {
    const gameId = game._id;
    const { playerUniqueId, score } = player;

    // Check if player is ready (is his turn)
    if (player.status !== PLAYER_STATUS.READY)
        throw new CustomError("Not your turn");

    if (playerUniqueId !== game.turnPlayerId)
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

    // const dieCount = current >= 85 ? 1 : 2;
    const throwResult = throwDie(current); // ADJUST here if you want particular die throw for testing
    const { total } = throwResult;

    // Initial move by die throw
    let initMove = {
        playerUniqueId,
        current,
        next: adjustPosition(current + total), // Adjust for > 90
        isActive: true,
        steps: total,
    };
    initMove.nextType = BOARD_POSITIONS[initMove.next];

    // Based on the type of the box, decide what to do next
    const moves = [initMove];

    while (true) {
        let move = moves[moves.length - 1];
        const { level, realm } = getRealm(move.next, score);

        if (move.nextType === POSITION_TYPE.CHALLENGE) {
            const quiz = await QuizService.getQuiz({ level, realm });
            move.content = { quiz };
            await QuizService.markQuizUsed({ quizId: quiz._id });
            await triggerRefillQuizzes({});
            break;
        } else if (move.nextType === POSITION_TYPE.INFO) {
            const info = await QuizService.getInfo({ level });
            move.content = { info: info };
            await QuizService.markInfoUsed({ infoId: info._id });
            await triggerRefillQuizzes({});
            break;
        } else if (move.nextType === POSITION_TYPE.GOOSE) {
            const newPos = adjustPosition(move.next + total);
            moves.push({
                playerUniqueId,
                current: move.next,
                next: newPos,
                nextType: BOARD_POSITIONS[newPos],
                isActive: true,
                steps: total,
            });
        } else if (move.nextType === POSITION_TYPE.JUMP_TURN) {
            game.players = game.players.map((p) => {
                if (p.playerUniqueId === playerUniqueId) {
                    return { ...p, status: PLAYER_STATUS.JUMPED }; // Set to JUMPED
                }
                return p;
            });
            break;
        } else if (move.nextType === POSITION_TYPE.DICE_TWICE) {
            break;
        } else if (move.nextType === POSITION_TYPE.BACK_TO_START) {
            moves.push({
                playerUniqueId,
                current: move.next,
                next: 0,
                nextType: BOARD_POSITIONS[0],
                isActive: true,
                steps: -move.next,
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
            // Return to prev position (currently assuming that this is the last position the player took off from)
            // If the player steps on GOOSE before stepping penalty, the player will move to its initial position (assumption)
            moves.push({
                playerUniqueId,
                current: move.next,
                next: moves[0].current,
                nextType: BOARD_POSITIONS[moves[0].current],
                isActive: false,
                steps: -(move.next - moves[0].current),
            });
            // Currently, we assume we won't do anything at the previous position even if it is special
            // So we break
            break;
        } else {
            break;
        }
    }

    // // Artificial delay for 1000ms
    // // await new Promise((resolve) => setTimeout(resolve, 1000));

    // game.turnPlayerId = nextId;
    game.moves.push(...moves);
    await game.save();
    return {
        roll: throwResult,
        rollingPlayerId: playerUniqueId,
        moves,
        game: R.omit(["moves"], game.toObject()),
        gameInfo: formatGameInfoForClientStore(game),
    };
}

function getNextTurn({ game, currentPlayer, currentPosType }) {
    // [WARNING] Potential infinite loop (e.g. if all players are inactive)
    const currentPlayerId = currentPlayer.playerUniqueId;

    // If DICE_TWICE is currentPosType (and active player), then the same playerUniqueId is returned
    if (currentPosType === POSITION_TYPE.DICE_TWICE && currentPlayer.isActive)
        return { releaseIds: [], nextId: currentPlayerId };

    let nextIndex;
    // Find current player index and save it in nextIndex
    for (let i = 0; i < game.players.length; i++) {
        if (game.players[i].playerUniqueId === currentPlayerId) nextIndex = i;
    }

    let releaseIds = [];
    // Try to increment nextIndex
    // Check for turn jumps along the way (if a player has been jumped a turn, they do not need to jump again)
    do {
        nextIndex = (nextIndex + 1) % game.players.length;
        const player = game.players[nextIndex];

        // Ignore the inactive player (this is different to jumping turns as a game mechanic)
        if (!player.isActive) continue;

        if (player.status === PLAYER_STATUS.JUMPED) {
            player.status = PLAYER_STATUS.READY;
            releaseIds.push(player.playerUniqueId);
        } else {
            return {
                releaseIds,
                nextId: game.players[nextIndex].playerUniqueId,
            };
        }
    } while (true);
}

async function updateTurn({ game, currentPlayerId }) {
    // Update turn here (determine whose turn it is next)
    const { moves } = game;
    const currentPlayer = findPlayer(game, currentPlayerId);

    const noActivePlayers = R.all(R.propEq(false, "isActive"))(game.players);
    if (noActivePlayers) return game; // No change in turn if no active players

    const { releaseIds, nextId } = getNextTurn({
        game,
        currentPlayer,
        currentPosType:
            moves.length > 0 ? moves[moves.length - 1].nextType : null,
    });

    // Release players from JUMPED to READY
    game.players = game.players.map((p) => {
        if (releaseIds.includes(p.playerUniqueId)) {
            return { ...p, status: PLAYER_STATUS.READY };
        }
        return p;
    });

    game.turnPlayerId = nextId;
    return await game.save();
}

async function forceTurn({ gameId, turnPlayerId }) {
    return await GameModel.findOneAndUpdate(
        { _id: gameId },
        { $set: { turnPlayerId } },
        { new: true }
    );
}

// We will lock the game at the start of each roll
// To prevent players spamming the roll button while the calculations in backend haven't finished
async function lockRolling(gameId, isLocked) {
    const game = await GameModel.findOneAndUpdate(
        { _id: gameId },
        { $set: { isLocked } },
        { new: true }
    );
    return game;
}

async function checkIsLocked(gameId) {
    const game = await GameModel.findById(gameId);
    return game.isLocked;
}

async function prevalidateAnswerQuiz({ gameId, playerUniqueId, quizId }) {
    const { game, player } = await validateGamePlayer({
        gameId,
        playerUniqueId,
    });

    // Must be the last move (cannot re-answer old questions!!)
    const lastMove = game.moves[game.moves.length - 1];
    if (lastMove.nextType !== POSITION_TYPE.CHALLENGE) {
        throw new CustomError("Cannot answer question at this time");
    }

    const quiz = lastMove.content.quiz;
    if (quiz._id.toString() !== quizId)
        throw new CustomError("Cannot answer question at this time");

    return { game, quiz, player, move: lastMove };
}

async function answerQuiz({ game, quiz, player, answer, move }) {
    const { playerUniqueId } = player;
    // Score to increment
    const level = getLevel(move.next);
    const incScore = level + 1; // Level 0 quizzes have score +1, Level 1 have score +2 and Level 2 has +3

    // Check answer by the user and increment score
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
                return { ...p, score: p.score + incScore };
            } else {
                return p;
            }
        });
        await game.save();
        return { isCorrect, game: R.omit(["moves"], game.toObject()) };
    }
    return { isCorrect };
}

async function activatePlayer(gameId, playerUniqueId, isActive = true) {
    return await GameModel.findOneAndUpdate(
        { _id: gameId },
        {
            $set: {
                "players.$[p].isActive": isActive,
            },
        },
        {
            arrayFilters: [{ "p.playerUniqueId": playerUniqueId }],
            new: true,
        }
    );
}

async function quitPlayer({ gameId, playerUniqueId }) {
    // Handle everything about user quitting (skip turns if needed)
    await validateGamePlayer({ gameId, playerUniqueId });

    const game = await activatePlayer(gameId, playerUniqueId, false);

    // If the game is locked in this player's turn and the player quits
    // (then we need to force update the turn and unlock)
    if (game.turnPlayerId === playerUniqueId) {
        await lockRolling(gameId, false);
        const { game: updatedGame } = await updateTurn({
            game,
            currentPlayerId: playerUniqueId,
        });

        return updatedGame;
    }

    return game;
}

module.exports = {
    startGame,

    validateGamePlayer,
    roll,
    updateTurn,
    forceTurn,
    lockRolling,
    checkIsLocked,

    prevalidateAnswerQuiz,
    answerQuiz,

    activatePlayer,
    quitPlayer,

    getGame,
    addPlayer,
};
