const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
    {
        moves: [
            {
                player: {
                    type: Number,
                    enum: [1, 2],
                    required: true,
                },
                position: {
                    type: Number,
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
