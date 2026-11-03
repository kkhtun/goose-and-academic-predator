// This file will extract abstracts from the xlsx documents in kb-source
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { REALM_TYPE } = require("../utils/game.util");

// Note: Biblioteca_personale_Zotero is also for level 1

// --------- Extract XLSX Files ---------- //

const excelFiles = [
    {
        fileName: "1 All Game Levels.xlsx",
        level: 0,
    },
    // {
    //     fileName: "Level 1 Records.xlsx",
    //     level: 1,
    // },
];

const termFiles = [
    {
        fileName: "1 Game keywords.txt",
        level: 0,
    },
];

function createJsonFromExcel(fileName) {
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
            doi: row.DOI,
            author: row.Author,
            title: row.Title,
            abstract: row["Abstract Note"],
        }))
        .filter((row) => {
            return row.title && row.abstract && row.abstract.length > 100;
        });

    console.log(`[XLSX] Found ${data.length} rows from ${fileName}`);
    console.log(
        `[XLSX] Discarded ${
            data.length - result.length
        } rows due to missing or unusable condition`
    );
    console.log(`[XLSX] Using ${result.length} rows from ${fileName}`);

    const categories = [
        {
            level: 0,
            realm: "BOTH",
        },
        {
            level: 1,
            realm: "BOTH",
        },
        {
            level: 2,
            realm: "SAVELIST",
        },
        {
            level: 2,
            realm: "WATCHLIST",
        },
    ];

    const seedJson = result.flatMap((row) => {
        return categories.map((category) => ({
            sourceTitle: row.title,
            text: row.abstract,
            level: category.level,
            type: "ABSTRACT",
            realm: category.realm,
            metadata: { author: row.author, doi: row.doi },
        }));
    });

    const outputPath = path.join(
        __dirname,
        "final",
        `${fileName.toLowerCase().replace(/\s+/g, "_").replace(".xlsx", "")}.json`
    );

    fs.writeFileSync(outputPath, JSON.stringify(seedJson, null, 2), "utf8");

    console.log(
        `[JSON] saved ${seedJson.length} seed records to ${outputPath}`
    );

    return seedJson;
}

function createTermsFromTxt(fileName, level = 0) {
    const sourcePath = path.join(__dirname, "kb-seed-raw", fileName);
    const outputPath = path.join(__dirname, "final", "terms.json");

    const raw = fs.readFileSync(sourcePath, "utf8");
    const terms = [
        ...new Set(
            raw
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => line.replace(/^["“”]+|["“”]+$/g, "").trim())
                .filter(Boolean)
                .map((term) => term.toUpperCase())
        ),
    ];

    console.log(`[TXT] ${terms.length} discrete unique terms after processing`);

    const data = [0, 1, 2].map((level) => ({
        sourceTitle: "Terms",
        text: terms.join(" | "),
        level,
        type: "TERM",
        realm: "BOTH",
    }));

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 4), "utf8");
    console.log(`[JSON] saved seed data to ${outputPath}`);
}

excelFiles.forEach(({ fileName, level }) =>
    createJsonFromExcel(fileName, level)
);

termFiles.forEach(({ fileName, level }) => createTermsFromTxt(fileName, level));
