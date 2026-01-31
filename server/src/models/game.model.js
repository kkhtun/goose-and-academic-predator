const mongoose = require("mongoose");
const { PLAYER_STATUS, POSITION_TYPE } = require("../utils/game.util");

const gameSchema = new mongoose.Schema(
    {
        moves: [
            {
                playerNum: {
                    type: Number,
                    enum: [1, 2],
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
                    default: POSITION_TYPE.STANDARD,
                },
            },
        ],
        players: [
            {
                playerNum: {
                    type: Number,
                    enum: [1, 2],
                    required: true,
                },
                playerUniqueId: {
                    type: String,
                    required: true,
                },
                status: {
                    type: String,
                    enum: Object.values(PLAYER_STATUS),
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Game", gameSchema, "games");
