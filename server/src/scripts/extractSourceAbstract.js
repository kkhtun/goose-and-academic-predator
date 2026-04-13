// This file will extract abstracts from the xlsx documents in kb-source
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const fileName = "L1P2.xlsx";
// const fileName = "L1P1.xlsx";
// const fileName = "L0P2.xlsx";
// const fileName = "L0P1.xlsx";
const difficulty = "medium"; // easy - L0, medium/hard - L1/L2

// Load file
const KB_SOURCE_DIR = path.join(__dirname, "kb-source-abstract", fileName);
const workbook = XLSX.readFile(KB_SOURCE_DIR);

// Get first sheet name
const sheetName = workbook.SheetNames[0];

// Convert sheet to JSON
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

const result = data
    .map((row) => ({
        title: row.__EMPTY_4,
        abstract: row.__EMPTY_5,
    }))
    .filter((row) => {
        return row.title && row.abstract && row.abstract.length > 100; // At least 100 (arbitrary) characters to make sense
    });

console.log(
    `[XLSX] Discarded ${data.length - result.length} rows due to missing or unusable condition`
);
console.log(`[XLSX] Using ${result.length} rows from ${fileName}`);

const seedJson = result.map((row) => {
    return {
        sourceTitle: row.title,
        text: row.abstract,
        difficultyHint: difficulty,
        type: "ABSTRACT",
    };
});

const outputPath = `kb-seed-abstract/${fileName.replace(".xlsx", ".json")}`;
fs.writeFileSync(
    path.join(__dirname, outputPath),
    JSON.stringify(seedJson, null, 2)
);
console.log(`[JSON] saved seed data to ${outputPath}`);
