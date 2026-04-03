const mongoose = require("mongoose");
const { PLAYER_STATUS, POSITION_TYPE } = require("../utils/game.util");

const gameSchema = new mongoose.Schema(
    {
        moves: [
            {
                playerUniqueId: {
                    type: String,
                    required: true,
                },
                current: {
                    type: Number,
                    required: true,
                },
                next: {
                    type: Number,
                    required: true,
                },
                nextType: {
                    type: String,
                    enum: Object.values(POSITION_TYPE),
                },
                content: {
                    type: Object,
                },
                isActive: {
                    // If isActive is true, then the action at nextType is processed
                    // if false, then we do nothing at the nextType
                    // Mainly for when returning to previous positions
                    type: Boolean,
                    default: true,
                },
            },
        ],
        players: [
            {
                playerName: {
                    type: String,
                    required: true,
                },
                playerUniqueId: {
                    type: String,
                    required: true,
                },
                avatar: {
                    type: String,
                },
                status: {
                    type: String,
                    enum: Object.values(PLAYER_STATUS),
                    required: true,
                },
                score: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Game", gameSchema, "games");
