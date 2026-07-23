const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const KbChunkModel = require("../models/kb-chunk.model.js");

function sanitizeAndProcessTerms(rawLines) {
    const words = rawLines.flatMap((line) => {
        const cleanedLine = line.replace(/["“”]/g, "").trim();
        if (!cleanedLine) return [];
        // Split multi-word phrases or keep individual clean terms
        const lineWords = cleanedLine
            .replace(/[^\w\s\.-]/g, "")
            .split(/\s+/)
            .filter((w) => w.length > 2 && w.toUpperCase() !== "THE" && w.toUpperCase() !== "AND");
        return lineWords.map((w) => w.toUpperCase());
    });

    const uniqueWords = [...new Set(words)];
    return uniqueWords.join(" | ");
}

async function seedKeywords() {
    const rawFilePath = path.join(__dirname, "kb-seed-raw", "1 Game keywords.txt");
    if (!fs.existsSync(rawFilePath)) {
        console.error(`[SEED KEYWORDS] File not found: ${rawFilePath}`);
        return;
    }

    const content = fs.readFileSync(rawFilePath, "utf-8");
    const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

    console.log(`[SEED KEYWORDS] Loaded ${lines.length} total keyword lines.`);

    // Divide keywords into Level 0 (1-70), Level 1 (71-178), Level 2 (179-end)
    const level0Lines = lines.slice(0, 70);
    const level1Lines = lines.slice(70, 178);
    const level2Lines = lines.slice(178);

    const l0TermsText = sanitizeAndProcessTerms(level0Lines);
    const l1TermsText = sanitizeAndProcessTerms(level1Lines);
    const l2TermsText = sanitizeAndProcessTerms(level2Lines);

    // Save/update JSON files in kb-seed-terms
    const termsDir = path.join(__dirname, "kb-seed-terms");
    if (!fs.existsSync(termsDir)) {
        fs.mkdirSync(termsDir, { recursive: true });
    }

    const l0Chunk = [{ sourceTitle: "Terms", text: l0TermsText, level: 0, type: "TERM", realm: "BOTH" }];
    const l1Chunk = [{ sourceTitle: "Terms", text: l1TermsText, level: 1, type: "TERM", realm: "BOTH" }];
    const l2Chunk = [{ sourceTitle: "Terms", text: l2TermsText, level: 2, type: "TERM", realm: "BOTH" }];

    fs.writeFileSync(path.join(termsDir, "L0Terms.json"), JSON.stringify(l0Chunk, null, 4));
    fs.writeFileSync(path.join(termsDir, "L1Terms.json"), JSON.stringify(l1Chunk, null, 4));
    fs.writeFileSync(path.join(termsDir, "L2Terms.json"), JSON.stringify(l2Chunk, null, 4));

    console.log("[SEED KEYWORDS] Updated L0Terms.json, L1Terms.json, L2Terms.json");

    // Connect DB & insert/update in MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/goose-game";
    console.log(`[SEED KEYWORDS] Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);

    // Delete existing TERM chunks and insert updated ones
    await KbChunkModel.deleteMany({ type: "TERM" });
    const inserted = await KbChunkModel.insertMany([...l0Chunk, ...l1Chunk, ...l2Chunk]);
    console.log(`[SEED KEYWORDS] Successfully seeded ${inserted.length} term chunks into MongoDB kb_chunks collection!`);

    await mongoose.disconnect();
    console.log("[SEED KEYWORDS] Completed successfully.");
}

seedKeywords().catch((err) => {
    console.error("[SEED KEYWORDS] Error:", err);
    process.exit(1);
});
