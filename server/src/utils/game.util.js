const { CustomError } = require("./CustomError");

const PLAYER_STATUS = {
    READY: "READY",
    WAIT: "WAIT",
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
    0: POSITION_TYPE.STANDARD,
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
    19: POSITION_TYPE.JUMP_TURN,
    20: POSITION_TYPE.CHALLENGE,
    21: POSITION_TYPE.CHALLENGE,
    22: POSITION_TYPE.CHALLENGE,
    23: POSITION_TYPE.DICE_TWICE,
    24: POSITION_TYPE.JUMP_TURN,
    25: POSITION_TYPE.GOOSE,
    26: POSITION_TYPE.CHALLENGE,
    27: POSITION_TYPE.INFO, // Arbitrary
    28: POSITION_TYPE.CHALLENGE,
    29: POSITION_TYPE.CHALLENGE,
    30: POSITION_TYPE.JUMP_TURN,
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
    53: POSITION_TYPE.JUMP_TURN,
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
    71: POSITION_TYPE.JUMP_TURN,
    72: POSITION_TYPE.CHALLENGE,
    73: POSITION_TYPE.CHALLENGE,
    74: POSITION_TYPE.CHALLENGE,
    75: POSITION_TYPE.INFO, // Arbitrary
    76: POSITION_TYPE.CHALLENGE,
    77: POSITION_TYPE.JUMP_TURN,
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

// Check < 1 and also reverses if position > 90
function adjustPosition(pos) {
    if (pos < 1) throw new CustomError("Error position < 1");
    if (pos > 90) return 90 - (pos - 90);
    return pos;
}

function throwDie(count = 2) {
    const die1 = Math.floor(Math.random() * 6) + 1;
    if (count === 1) {
        return { die1, total: die1 };
    }
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;
    return { die1, die2, total };
}

module.exports = {
    PLAYER_STATUS,
    POSITION_TYPE,
    BOARD_POSITIONS,
    POSITION_DESCRIPTIONS,
    adjustPosition,
    throwDie,
};
