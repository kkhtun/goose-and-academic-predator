const mongoose = require("mongoose");

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

module.exports = mongoose.model("Info", infoSchema, "info");
