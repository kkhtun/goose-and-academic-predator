const fs = require("fs");
const path = require("path");

// const filename = "L0Terms.txt";
// const filename = "L1Terms.txt";
const filename = "L2Terms.txt";
const difficultyHint = "hard";

const KB_SOURCE_DIR = path.join(__dirname, "kb-source-terms");
const text = fs.readFileSync(path.join(KB_SOURCE_DIR, filename), "utf-8");

const matches = text
    .split(/["“”]/)
    .filter((_, i) => i % 2 === 1)
    .map((s) => s.trim());

console.log(`[TXT] Found ${matches.length} original matches`);

const words = matches.flatMap((str) =>
    str
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // remove punctuation
        .split(/\s+/)
);
const uniqueWords = [...new Set(words)];

const filtered = uniqueWords
    .filter((entry) => {
        return entry.length > 2 && entry !== "IF";
    })
    .map((entry) => entry.toUpperCase());

console.log(`[TXT] ${filtered.length} diescrete terms after processing`);

const seedJson = [
    {
        sourceTitle: "Terms",
        text: filtered.join(" | "),
        difficultyHint,
        type: "TERM",
    },
];

const outputPath = `kb-seed-terms/${filename.replace(".txt", ".json")}`;
fs.writeFileSync(
    path.join(__dirname, outputPath),
    JSON.stringify(seedJson, null, 2)
);
console.log(`[JSON] saved seed data to ${outputPath}`);
