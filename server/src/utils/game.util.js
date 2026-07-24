const { isDev } = require("./common.util");
const { CustomError } = require("./CustomError");

const PLAYER_STATUS = {
    READY: "READY",
    JUMPED: "JUMPED",
};

const POSITION_DESCRIPTIONS = {
    // Default boxes
    STANDARD: "Nothing happens when the player lands in this square",
    GOOSE: "Player makes another move based on the previous roll",
    CHALLENGE: "Pop-up MCQ quiz where players can answer correctly to score",
    INFO: "A bit of knowledge about predatory academic practices to educate the player",
    JUMP_TURN: "Jump the player's turn",
    DICE_TWICE: "Pull the dice twice",
    BACK_TO_START: "Back to start",
    LUCKY: "Double the player's score",
    // RETURN_PREV: "RETURN_PREV", // Return to previous position
    // PURCHASE: "PURCHASE", // Purchase the corresponding product
    PENALTY: "Return to previous position and pay the penalty",
};

const POSITION_TYPE = {
    STANDARD: "STANDARD", // standard box (do nothing)
    GOOSE: "GOOSE", // continue with previous number
    CHALLENGE: "CHALLENGE", // pop-up quiz
    INFO: "INFO", // pop-up information
    JUMP_TURN: "JUMP_TURN", // Skip turn
    DICE_TWICE: "DICE_TWICE", // Pull the dice again
    BACK_TO_START: "BACK_TO_START",
    LUCKY: "LUCKY", // Double score
    // RETURN_PREV: "RETURN_PREV", // Return to previous position
    // PURCHASE: "PURCHASE", // Purchase the corresponding product
    PENALTY: "PENALTY", // Return to previous position + pay penalty
};

const BOARD_POSITIONS = {
    1: POSITION_TYPE.CHALLENGE,
    2: POSITION_TYPE.CHALLENGE,
    3: POSITION_TYPE.CHALLENGE,
    4: POSITION_TYPE.GOOSE,
    5: POSITION_TYPE.CHALLENGE,
    6: POSITION_TYPE.CHALLENGE,
    7: POSITION_TYPE.CHALLENGE,
    8: POSITION_TYPE.CHALLENGE,
    9: POSITION_TYPE.DICE_TWICE,
    10: POSITION_TYPE.CHALLENGE,
    11: POSITION_TYPE.CHALLENGE,
    12: POSITION_TYPE.INFO, // Arbitrary
    13: POSITION_TYPE.CHALLENGE,
    14: POSITION_TYPE.DICE_TWICE,
    15: POSITION_TYPE.CHALLENGE,
    16: POSITION_TYPE.CHALLENGE,
    17: POSITION_TYPE.LUCKY,
    18: POSITION_TYPE.CHALLENGE,
    // 19: POSITION_TYPE.JUMP_TURN,
    19: POSITION_TYPE.CHALLENGE,
    20: POSITION_TYPE.CHALLENGE,
    21: POSITION_TYPE.CHALLENGE,
    22: POSITION_TYPE.CHALLENGE,
    23: POSITION_TYPE.DICE_TWICE,
    24: POSITION_TYPE.CHALLENGE,
    // 24: POSITION_TYPE.JUMP_TURN,
    25: POSITION_TYPE.GOOSE,
    26: POSITION_TYPE.CHALLENGE,
    27: POSITION_TYPE.INFO, // Arbitrary
    28: POSITION_TYPE.CHALLENGE,
    29: POSITION_TYPE.CHALLENGE,
    // 30: POSITION_TYPE.JUMP_TURN,
    30: POSITION_TYPE.CHALLENGE,
    31: POSITION_TYPE.CHALLENGE,
    32: POSITION_TYPE.INFO, // Arbitrary
    33: POSITION_TYPE.CHALLENGE,
    34: POSITION_TYPE.DICE_TWICE,
    35: POSITION_TYPE.CHALLENGE,
    36: POSITION_TYPE.CHALLENGE,
    37: POSITION_TYPE.GOOSE,
    38: POSITION_TYPE.CHALLENGE,
    39: POSITION_TYPE.DICE_TWICE,
    40: POSITION_TYPE.PENALTY,
    41: POSITION_TYPE.CHALLENGE,
    42: POSITION_TYPE.CHALLENGE,
    43: POSITION_TYPE.CHALLENGE,
    44: POSITION_TYPE.CHALLENGE,
    45: POSITION_TYPE.BACK_TO_START,
    46: POSITION_TYPE.CHALLENGE,
    47: POSITION_TYPE.DICE_TWICE,
    48: POSITION_TYPE.CHALLENGE,
    49: POSITION_TYPE.CHALLENGE,
    50: POSITION_TYPE.LUCKY,
    51: POSITION_TYPE.CHALLENGE,
    52: POSITION_TYPE.GOOSE,
    // 53: POSITION_TYPE.JUMP_TURN,
    53: POSITION_TYPE.CHALLENGE,
    54: POSITION_TYPE.CHALLENGE,
    55: POSITION_TYPE.CHALLENGE,
    56: POSITION_TYPE.CHALLENGE,
    57: POSITION_TYPE.INFO, // Arbitrary
    58: POSITION_TYPE.CHALLENGE,
    59: POSITION_TYPE.CHALLENGE,
    60: POSITION_TYPE.PENALTY,
    61: POSITION_TYPE.CHALLENGE,
    62: POSITION_TYPE.GOOSE,
    63: POSITION_TYPE.CHALLENGE,
    64: POSITION_TYPE.CHALLENGE,
    65: POSITION_TYPE.DICE_TWICE,
    66: POSITION_TYPE.CHALLENGE,
    67: POSITION_TYPE.INFO, // Arbitrary
    68: POSITION_TYPE.CHALLENGE,
    69: POSITION_TYPE.CHALLENGE,
    70: POSITION_TYPE.CHALLENGE,
    // 71: POSITION_TYPE.JUMP_TURN,
    71: POSITION_TYPE.CHALLENGE,
    72: POSITION_TYPE.CHALLENGE,
    73: POSITION_TYPE.CHALLENGE,
    74: POSITION_TYPE.CHALLENGE,
    75: POSITION_TYPE.INFO, // Arbitrary
    76: POSITION_TYPE.CHALLENGE,
    // 77: POSITION_TYPE.JUMP_TURN,
    77: POSITION_TYPE.CHALLENGE,
    78: POSITION_TYPE.CHALLENGE,
    79: POSITION_TYPE.CHALLENGE,
    80: POSITION_TYPE.PENALTY,
    81: POSITION_TYPE.CHALLENGE,
    82: POSITION_TYPE.CHALLENGE,
    83: POSITION_TYPE.CHALLENGE,
    84: POSITION_TYPE.GOOSE,
    85: POSITION_TYPE.CHALLENGE,
    86: POSITION_TYPE.LUCKY,
    87: POSITION_TYPE.CHALLENGE,
    88: POSITION_TYPE.CHALLENGE,
    89: POSITION_TYPE.CHALLENGE,
    90: POSITION_TYPE.STANDARD,
};

// These constants need to be in sync with frontend
const SCORE_FOR_HEAVEN = 12;

const REALM_TYPE = {
    HEAVEN: "HEAVEN",
    HELL: "HELL",
    BOTH: "BOTH",
};

const LEVEL_MARKER = {
    LEVEL_0_END: 29,
    LEVEL_1_END: 59,
};

// Check < 1 and also reverses if position > 90
function adjustPosition(pos) {
    if (pos < 1) throw new CustomError("Error position < 1");
    if (pos > 90) return 90 - (pos - 90);
    return pos;
}

function findPlayer(game, playerUniqueId) {
    return game.players.find((p) => p.playerUniqueId === playerUniqueId);
}

function throwDie(pos = 1) {
    // if (isDev()) return { die1: 1, die2: 2, total: 3 };

    const rollToWin = 90 - pos;

    // Single die logic for the final row
    if (pos >= 85) {
        let die1 = Math.floor(Math.random() * 6) + 1;
        
        // Artificial bias (if 2 steps left, try to land it maybe)
        if (rollToWin === 2 && Math.random() < 0.4) {
            die1 = 2;
        } else if (rollToWin === 3 && Math.random() < 0.4) {
            die1 = 3;
        }

        return { die1, die2: 0, total: die1 };
    }

    if (rollToWin === 2) {
        if (Math.random() < 0.4) {
            // If the player is too close, there is a 40% chance to win
            return { die1: 1, die2: 1, total: 2 };
        }
    }

    if (rollToWin === 3) {
        if (Math.random() < 0.4) {
            // If the player is too close, there is a 40% chance to win
            return { die1: 1, die2: 2, total: 3 };
        }
    }

    // Instead of giving only 1 dice
    // We can artificially nudge the probability of dice towards the end of the game to allow for easier winning conditions
    // This prevents remodelling entire pipeline (including UI)
    let die1 = Math.floor(Math.random() * 6) + 1;
    let die2 = Math.floor(Math.random() * 6) + 1;
    let total = die1 + die2;

    if (pos > 83 && total > 6) {
        // 100% chance to re-roll high values
        if (Math.random() < 1) {
            die1 = Math.floor(Math.random() * 3) + 1; // bias lower
            die2 = Math.floor(Math.random() * 3) + 1;
            total = die1 + die2;
        }
    }
    return { die1, die2, total };
}

function getPlayerPos({ playerUniqueId, moves }) {
    for (let i = moves.length - 1; i >= 0; i--) {
        if (moves[i].playerUniqueId === playerUniqueId) {
            return moves[i].next;
        }
    }
    return 1; // Default to start if no moves found
}

function getLevel(pos) {
    if (pos <= LEVEL_MARKER.LEVEL_0_END) {
        return 0;
    } else if (pos <= LEVEL_MARKER.LEVEL_1_END) {
        return 1;
    } else {
        return 2;
    }
}

function getRealm(playerPos, playerScore) {
    const level = getLevel(playerPos);
    let realm;
    if (level >= 2) {
        realm =
            playerScore >= SCORE_FOR_HEAVEN
                ? REALM_TYPE.HEAVEN
                : REALM_TYPE.HELL;
    } else {
        realm = REALM_TYPE.BOTH; // Realm only applies in Level 2
    }
    return { realm, level };
}

function formatGameInfoForClientStore(game) {
    const { _id: gameId, players, moves, turnPlayerId, isLocked } = game;
    return {
        gameId,
        players: players.map((player) => {
            return {
                playerUniqueId: player.playerUniqueId,
                playerName: player.playerName,
                avatar: player.avatar,
                playerPos: getPlayerPos({
                    playerUniqueId: player.playerUniqueId,
                    moves,
                }),
                status: player.status,
                score: player.score,
                isActive: player.isActive,
            };
        }),
        turnPlayerId,
        isLocked,
    };
}

module.exports = {
    PLAYER_STATUS,
    POSITION_TYPE,
    BOARD_POSITIONS,
    POSITION_DESCRIPTIONS,
    REALM_TYPE,
    SCORE_FOR_HEAVEN,
    adjustPosition,
    throwDie,
    formatGameInfoForClientStore,
    getPlayerPos,
    findPlayer,
    getRealm,
    getLevel,
};
