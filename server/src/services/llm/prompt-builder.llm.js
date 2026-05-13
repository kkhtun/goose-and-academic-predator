const { isString, shuffleArray } = require("../../utils/common.util");

function normalizeMcqResponse(obj) {
    const entry = {};

    if (isString(obj.questionText)) {
        entry.questionText = obj.questionText;
    }

    if (isString(obj.correctAnswer) && obj.correctAnswer.length === 1) {
        entry.correctAnswer = obj.correctAnswer;
    }

    if (obj.options && Object.values(obj.options).length === 4) {
        const labels = ["A", "B", "C", "D"];
        const optionsArr = labels.map((label) => obj.options[label]);
        if (optionsArr.every(isString)) {
            entry.options = optionsArr;
        }
    }

    if (isString(obj.explanation)) {
        entry.explanation = obj.explanation;
    }

    // Shuffle options here
    if (entry.options && entry.correctAnswer) {
        const labels = ["A", "B", "C", "D"];
        const correctIndex = labels.indexOf(entry.correctAnswer);
        const correctOptionText = entry.options[correctIndex];

        const shuffled = shuffleArray(
            entry.options.map((text, index) => ({
                text,
                wasCorrect: index === correctIndex,
            }))
        );

        entry.options = shuffled.map((option) => option.text);
        const newCorrectIndex = shuffled.findIndex(
            (option) => option.wasCorrect
        );
        entry.correctAnswer = labels[newCorrectIndex];
    }

    return {
        entry,
        isValid: Object.keys(entry).length === 4,
    };
}

function normalizeTrueFalseResponse(obj) {
    const entry = {};

    if (isString(obj.statement)) {
        entry.statement = obj.statement;
    }

    if (typeof obj.answer === "boolean") {
        entry.answer = obj.answer;
    }

    if (isString(obj.explanation)) {
        entry.explanation = obj.explanation;
    }

    return {
        entry,
        isValid: Object.keys(entry).length === 3,
    };
}

function normalizeCrosswordResponse(arr) {
    // Maybe check if 6-8 words?
    const filteredWords = arr.filter((item) => {
        if (typeof item !== "object" || item === null) return false;
        const { answer, clue } = item;

        if (typeof answer !== "string") return false;
        if (!/^[A-Z]{4,}$/.test(answer)) return false;
        if (typeof clue !== "string") return false;
        if (clue.trim().length === 0) return false;
        return true;
    });

    return {
        isValid: filteredWords.length >= 6,
        entry: shuffleArray(filteredWords),
    };
}

module.exports = {
    // Single normalize
    normalizeCrosswordResponse,
    normalizeMcqResponse,
    normalizeTrueFalseResponse,
};
