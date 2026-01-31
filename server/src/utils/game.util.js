const PLAYER_STATUS = {
    READY: "READY",
    WAIT: "WAIT",
};

const POSITION_TYPE = {
    STANDARD: "STANDARD", // standard box (do nothing)
    GOOSE: "GOOSE", // continue with previous number
    CHALLENGE: "CHALLENGE", // pop-up quiz
    JUMP_TURN: "JUMP_TURN", // Skip turn
    DICE_TWICE: "DICE_TWICE", // Pull the dice again
    BACK_TO_START: "BACK_TO_START",
    LUCKY: "LUCKY", // Double score
    RETURN_PREV: "RETURN_PREV", // Return to previous position
    PURCHASE: "PURCHASE", // Purchase the corresponding product
    PENALTY: "PENALTY", // Return to previous position + pay penalty
};

function getPositionDetail(position) {
    return { type: POSITION_TYPE.STANDARD };
}

module.exports = { PLAYER_STATUS, POSITION_TYPE, getPositionDetail };
