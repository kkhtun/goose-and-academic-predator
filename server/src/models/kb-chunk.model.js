const mongoose = require("mongoose");

const kbChunkSchema = new mongoose.Schema(
    {
        // topic: {
        //     // topic category
        //     type: String,
        //     required: true,
        //     index: true,
        // },

        difficultyHint: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
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
            enum: ["TERM", "ABSTRACT"],
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
