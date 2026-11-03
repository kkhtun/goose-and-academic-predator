// This file will extract abstracts from the xlsx documents in kb-source
const XLSX = require("xlsx");
const fs = require("fs");
const AdmZip = require("adm-zip");
const { XMLParser } = require("fast-xml-parser");
const path = require("path");
const { REALM_TYPE } = require("../utils/game.util");

// Note: Biblioteca_personale_Zotero is also for level 1

// --------- Extract XLSX Files ---------- //

const files = [
    {
        fileName: "LEVEL 0 questions.txt",
        level: 0,
        realm: REALM_TYPE.BOTH,
    },
    {
        fileName: "LEVEL 1 questions.txt",
        level: 1,
        realm: REALM_TYPE.BOTH,
    },
    {
        fileName: "LEVEL 2 Savelist Questions.txt",
        level: 2,
        realm: REALM_TYPE.SAVELIST,
    },
    {
        fileName: "LEVEL 2 Watchlist Questions.txt",
        level: 2,
        realm: REALM_TYPE.WATCHLIST,
    },
];

function createJsonFromTxt(fileName, level, realm) {
    // Load file
    const KB_SOURCE_DIR = path.join(__dirname, "kb-seed-raw", fileName);
    const raw = fs.readFileSync(KB_SOURCE_DIR, "utf8");

    const lines = raw.split(/\r?\n/);

    const questions = [];
    let current = null;

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) continue;

        const questionMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);

        if (questionMatch) {
            if (current) {
                current.text = current.text.trim();
                questions.push(current);
            }

            current = {
                question: questionMatch[2].trim(),
                text: "",
            };
        } else if (current) {
            current.text += trimmed + "\n";
        }
    }

    if (current) {
        current.text = current.text.trim();
        questions.push(current);
    }

    // Must have some character length
    const result = questions
        .map((row) => ({
            question: row.question,
            text: row.text,
        }))
        .filter((row) => {
            return row.question && row.text && row.text.length > 100; // At least 100 (arbitrary) characters to make sense
        });

    console.log(`[XLSX] Found ${questions.length} questions from ${fileName}`);
    console.log(
        `[XLSX] Discarded ${questions.length - result.length} questions due to missing or unusable condition`
    );
    console.log(`[XLSX] Using ${result.length} questions from ${fileName}`);

    const seedJson = result.map((row) => {
        return {
            sourceTitle: row.question,
            text: row.text,
            level,
            type: "QUESTION",
            realm,
        };
    });

    const outputPath = `kb-seed/${fileName.toLowerCase().replace(/\s+/g, "_").replace(".txt", "")}.json`;
    fs.writeFileSync(
        path.join(__dirname, outputPath),
        JSON.stringify(seedJson, null, 2)
    );
    console.log(`[JSON] Saved seed data to ${outputPath}`);
}

files.forEach(({ fileName, level, realm }) =>
    createJsonFromTxt(fileName, level, realm)
);
