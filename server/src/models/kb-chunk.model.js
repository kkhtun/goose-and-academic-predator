const mongoose = require("mongoose");
const { REALM_TYPE } = require("../utils/game.util");

const kbChunkSchema = new mongoose.Schema(
    {
        // topic: {
        //     // topic category
        //     type: String,
        //     required: true,
        //     index: true,
        // },

        // difficultyHint: {
        //     type: String,
        //     enum: ["easy", "medium", "hard"],
        //     required: true,
        // },

        level: {
            type: Number,
            required: true, // Relevant to which level this particular information chunk is
        },

        text: {
            // the actual knowledge (paragraph of 100-400 words)
            type: String,
            required: true,
        },

        sourceTitle: {
            type: String,
            // For tracing and debugging
        },

        type: {
            type: String,
            enum: ["TERM", "ABSTRACT", "QUESTION"],
            required: true,
        },
        // embedding: {
        //     // Vector embedding for query
        //     type: [Number],
        //     required: true,
        // },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("KbChunk", kbChunkSchema, "kb_chunks");
