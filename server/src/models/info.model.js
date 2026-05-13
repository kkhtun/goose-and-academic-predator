const mongoose = require("mongoose");
const { REALM_TYPE } = require("../utils/game.util");

const infoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        },
        realm: {
            type: String,
            enum: Object.values(REALM_TYPE),
            required: true,
        },
        status: {
            type: String,
            enum: ["NEW", "USED"],
            default: "NEW",
        },

        chunks: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "KbChunk" }],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Info", infoSchema, "info");
