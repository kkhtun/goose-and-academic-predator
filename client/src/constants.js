export const POSITION_TYPE = {
    STANDARD: "STANDARD", // standard box (do nothing)
    GOOSE: "GOOSE", // continue with previous number
    CHALLENGE: "CHALLENGE", // pop-up quiz
    INFO: "INFO", // pop-up information
    // JUMP_TURN: "JUMP_TURN", // Skip turn
    DICE_TWICE: "DICE_TWICE", // Pull the dice again
    BACK_TO_START: "BACK_TO_START",
    LUCKY: "LUCKY", // Double score
    // RETURN_PREV: "RETURN_PREV", // Return to previous position
    // PURCHASE: "PURCHASE", // Purchase the corresponding product
    PENALTY: "PENALTY", // Return to previous position + pay penalty
};

export const POPUP_TYPE = {
    QUIZ: "QUIZ",
    INFO: "INFO",
    SPECIAL: "SPECIAL",
};

// Used in popup (when player lands)
export const POSITION_DESCRIPTIONS = {
    // STANDARD: "Nothing happens when the player lands in this square.",
    GOOSE: "A goose friend allows you to make another move based on your previous roll.",
    CHALLENGE: "Face a quiz challenge. Answer correctly to earn points.",
    INFO: "Discover a quick tip about the goose and academic predators.",
    // JUMP_TURN: "Oh no! your next turn is skipped.",
    DICE_TWICE: "Lucky! You get another chance to roll the dice.",
    BACK_TO_START: "Tough break! you must return to the start.",
    LUCKY: "Jackpot! You stepped on a lucky box. Your current score has been increased by 2 points!",
    // RETURN_PREV: "RETURN_PREV", // Return to previous position
    // PURCHASE: "PURCHASE", // Purchase the corresponding product
    PENALTY:
        "You have been attacked by deadly predators! Move back to your last position and pay a penalty of 2 points.",
};

// Used in instructions and hover over square
export const POSITION_INSTRUCTIONS = {
    // STANDARD: "Nothing happens when the player lands in this square.",
    GOOSE: "A goose friend allows you to make another move based on your previous roll.",
    CHALLENGE: "A quiz challenge position. Answer correctly to earn a score.",
    INFO: "A small tip on predatory publishing.",
    // JUMP_TURN: "Your turn will be skipped upon landing this square.",
    DICE_TWICE: "You get another chance to roll the dice on this square.",
    BACK_TO_START:
        "You will go back to start again if you step on this square!",
    LUCKY: "Your current score will increase by 2 points on this lucky square!",
    // RETURN_PREV: "RETURN_PREV", // Return to previous position
    // PURCHASE: "PURCHASE", // Purchase the corresponding product
    PENALTY:
        "You will be attacked by deadly predators on this square! You will need to return your last position and pay a penalty of 2 points.",
};

export const BOARD_POSITIONS = {
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

export const QUIZ_TYPE = {
    MCQ: "MCQ",
    TRUE_FALSE: "TRUE_FALSE",
    CROSS_WORDS: "CROSS_WORDS",
    FAKE_EMAIL: "FAKE_EMAIL",
};

export const LEVEL_MESSAGES = {
    0: "Let's discover the academic publishing system and the main Open Access models, develop the skills to navigate scholarly communication, and understand the pitfalls of the academic publishing landscape.",
    1: "Predatory journals and publishers are individuals or entities who follow their interests, harmful to scholarships, without achieving promised quality checks for issues such as plagiarism or ethical consent. They produce false information, alteration from good editorial and publication practices, show low transparency, and use illegal and aggressive solicitation practices. (Cukier, S. et al., 2020)",
    2: "The best way to avoid predatory publishing is to stay informed and learn to spot the warning signs.",
};

export const LEVEL_MARKER = {
    LEVEL_0_END: 29,
    LEVEL_1_END: 59,
};

export const REALM_TYPE = {
    HEAVEN: "HEAVEN",
    HELL: "HELL",
    BOTH: "BOTH",
};

// Keep the realm values stable for saved games and the API while presenting
// clearer, user-facing outcome names throughout the game.
export const REALM_LABEL = {
    [REALM_TYPE.HEAVEN]: "Savelist",
    [REALM_TYPE.HELL]: "Watchlist",
};

export const SCORE_FOR_HEAVEN = 12;

// export const HELL_COLOR = "rgb(196, 106, 100)";
// export const HEAVEN_COLOR = "rgb(86, 164, 216)";

export const REALM_COLOR = {
    [REALM_TYPE.HEAVEN]: "rgb(86, 164, 216)",
    [REALM_TYPE.HELL]: "rgb(196, 106, 100)",
};

export const BOARD_SIZE = Object.keys(BOARD_POSITIONS).length;
