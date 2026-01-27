const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
    {
        topic: { type: String, required: true, index: true },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
            index: true,
        },
        type: { type: String, enum: ["multiple_choice"], required: true },
        questionText: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
        explanation: { type: String, required: true },

        contextChunks: [
            { type: mongoose.Schema.Types.ObjectId, ref: "KbChunk" },
        ],

        status: {
            type: String,
            enum: ["new", "used", "discarded"],
            default: "new",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Quiz", quizSchema);
