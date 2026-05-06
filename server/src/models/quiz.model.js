const mongoose = require("mongoose");
const { QUIZ_TYPE, DIFFICULTY } = require("../utils/quiz.util");
const { REALM_TYPE } = require("../utils/game.util");

const quizSchema = new mongoose.Schema(
    {
        // topic: { type: String, required: true, index: true },
        // difficulty: {
        //     type: String,
        //     enum: Object.values(DIFFICULTY),
        //     required: true,
        //     index: true,
        // },
        type: { type: String, enum: Object.values(QUIZ_TYPE), required: true },

        // Content (flexible for now, handed over to service codes to make sure schema is correct)
        // mcqContent: {
        //     questionText: { type: String, required: true },
        //     options: { type: [String], required: true },
        //     correctAnswer: { type: String, required: true },
        //     explanation: { type: String, required: true },
        // },
        content: Object,
        // Misc
        // contextChunks: [
        //     { type: mongoose.Schema.Types.ObjectId, ref: "KbChunk" },
        // ],
        level: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["NEW", "USED"],
            default: "NEW",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Quiz", quizSchema, "quizzes");
