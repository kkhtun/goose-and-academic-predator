const QUIZ_TYPE = {
    MCQ: "MCQ",
    TRUE_FALSE: "TRUE_FALSE",
    WORDS_FIND: "WORDS_FIND",
    CROSS_WORDS: "CROSS_WORDS",
};

const DIFFICULTY = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
};

const CONCEPT_TYPE = {
    DEFINITION: "DEFINITION",
    TERMINOLOGY: "TERMINOLOGY",
    CONCEPT: "CONCEPT",
    LIST: "LIST",
};

function checkCrosswordGrid(answerGrid, actualGrid) {
    for (let r = 0; r < actualGrid.length; r++) {
        for (let c = 0; c < actualGrid[r].length; c++) {
            if (actualGrid[r][c] === "-") continue;
            if (actualGrid[r][c] !== answerGrid[r][c]) return false;
        }
    }
    return true;
}

module.exports = { QUIZ_TYPE, DIFFICULTY, CONCEPT_TYPE, checkCrosswordGrid };
