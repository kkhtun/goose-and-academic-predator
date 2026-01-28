const mongoose = require("mongoose");
const { PLAYER_STATUS } = require("../utils/game.util");

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
