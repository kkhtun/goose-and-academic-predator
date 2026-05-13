// This file will extract abstracts from the xlsx documents in kb-source
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { REALM_TYPE } = require("../utils/game.util");

// Note: Biblioteca_personale_Zotero is also for level 1

// --------- Extract XLSX Files ---------- //

const files = [
    {
        fileName: "LEVEL 0 Records.xlsx",
        level: 0,
    },
    {
        fileName: "Level 1 Records.xlsx",
        level: 1,
    },
];

function createJsonFromExcel(fileName, level) {
    // Load file
    const KB_SOURCE_DIR = path.join(__dirname, "kb-seed-raw", fileName);
    const workbook = XLSX.readFile(KB_SOURCE_DIR);

    // Get first sheet name
    const sheetName = workbook.SheetNames[0];

    // Convert sheet to JSON
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Must have title, abstract and some character length
    const result = data
        .map((row) => ({
            title: row.Title,
            abstract: row.Abstract,
        }))
        .filter((row) => {
            return row.title && row.abstract && row.abstract.length > 100; // At least 100 (arbitrary) characters to make sense
        });

    console.log(`[XLSX] Found ${data.length} rows from ${fileName}`);
    console.log(
        `[XLSX] Discarded ${data.length - result.length} rows due to missing or unusable condition`
    );
    console.log(`[XLSX] Using ${result.length} rows from ${fileName}`);

    const seedJson = result.map((row) => {
        return {
            sourceTitle: row.title,
            text: row.abstract,
            level,
            type: "ABSTRACT",
            realm: REALM_TYPE.BOTH,
        };
    });

    const outputPath = `kb-seed/${fileName.toLowerCase().replace(/\s+/g, "_").replace(".xlsx", "")}.json`;
    fs.writeFileSync(
        path.join(__dirname, outputPath),
        JSON.stringify(seedJson, null, 2)
    );
    console.log(`[JSON] saved seed data to ${outputPath}`);
}

files.forEach(({ fileName, level }) => createJsonFromExcel(fileName, level));
