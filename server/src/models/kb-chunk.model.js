const mongoose = require("mongoose");
const { REALM_TYPE } = require("../utils/game.util");

const kbChunkSchema = new mongoose.Schema(
    {
        level: {
            type: Number,
            required: true, // Relevant to which level this particular information chunk is
        },

        realm: {
            type: String,
            enum: Object.values(REALM_TYPE),
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
        embedding: {
            // Vector embedding for query
            type: [Number],
        },
        embeddingModel: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("KbChunk", kbChunkSchema, "kb_chunks");
