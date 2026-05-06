// This file will extract abstracts from the xlsx documents in kb-source
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Note: Biblioteca_personale_Zotero is also for level 1

// --------- Extract XLSX Files ---------- //

// // const fileName = "Level_0_Records.xlsx";
// // const fileName = "Level_1_Records.xlsx";
// // const fileName = "Biblioteca_personale_Zotero.csv";
// const fileName = "L0P1.xlsx";
// // const level = 1;

// // Load file
// const KB_SOURCE_DIR = path.join(
//     __dirname,
//     "kb-source-abstract",
//     "cleaned",
//     fileName
// );
// const workbook = XLSX.readFile(KB_SOURCE_DIR);

// // Get first sheet name
// const sheetName = workbook.SheetNames[0];

// // Convert sheet to JSON
// const sheet = workbook.Sheets[sheetName];
// const data = XLSX.utils.sheet_to_json(sheet);

// const result = data
//     .map((row) => ({
//         title: row.Title,
//         abstract: row["Abstract Note"],
//     }))
//     .filter((row) => {
//         return row.title && row.abstract && row.abstract.length > 100; // At least 100 (arbitrary) characters to make sense
//     });

// console.log(
//     `[XLSX] Discarded ${data.length - result.length} rows due to missing or unusable condition`
// );
// console.log(`[XLSX] Using ${result.length} rows from ${fileName}`);

// const seedJson = result.map((row) => {
//     return {
//         sourceTitle: row.title,
//         text: row.abstract,
//         level,
//         type: "ABSTRACT",
//     };
// });

// const outputPath = `kb-seed-abstract/${fileName.replace(".xlsx", ".json").replace(".csv", ".json")}`;
// fs.writeFileSync(
//     path.join(__dirname, outputPath),
//     JSON.stringify(seedJson, null, 2)
// );
// console.log(`[JSON] saved seed data to ${outputPath}`);

// ---------- Extract .txt files and query questions for GPT ---------- //

const fileName = "Level_2_Heaven.txt";
const level = 2;

// Load file
const KB_SOURCE_DIR = path.join(
    __dirname,
    "kb-source-abstract",
    "cleaned",
    fileName
);

// Read file
const fileContent = fs.readFileSync(KB_SOURCE_DIR, "utf-8");

// Split into lines
const lines = fileContent
    .split(/\r?\n/)
    .map(
        (line) => line.trim().replace(/^\d+\.\s*/, "") // remove "1. ", "23. ", etc.
    )
    .filter(Boolean);

const seedJson = lines.map((line) => {
    return {
        sourceTitle: "Question",
        text: line,
        level,
        type: "QUESTION",
    };
});

const outputPath = `kb-seed-abstract/${fileName.replace(".xlsx", ".json").replace(".csv", ".json").replace(".txt", ".json")}`;
fs.writeFileSync(
    path.join(__dirname, outputPath),
    JSON.stringify(seedJson, null, 2)
);
console.log(`[JSON] saved seed data to ${outputPath}`);
