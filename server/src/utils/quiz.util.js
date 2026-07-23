const QUIZ_TYPE = {
    MCQ: "MCQ",
    TRUE_FALSE: "TRUE_FALSE",
    CROSS_WORDS: "CROSS_WORDS",
    FAKE_EMAIL: "FAKE_EMAIL",
};

// Change here to reflect how much of each type will be presented to the user
const QUIZ_PROBS = {
    MCQ: 0.25,
    TRUE_FALSE: 0.3,
    CROSS_WORDS: 0.15,
    FAKE_EMAIL: 0.3,
};

const DIFFICULTY = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
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

function sampleQuizType(allowedTypes) {
    const types = allowedTypes ?? Object.values(QUIZ_TYPE);

    const totalProb = types.reduce(
        (sum, type) => sum + (QUIZ_PROBS[type] ?? 0),
        0
    );

    if (totalProb === 0) {
        // fallback if no probabilities exist
        return types[Math.floor(Math.random() * types.length)];
    }

    const random = Math.random() * totalProb;

    let cumulative = 0;
    for (const type of types) {
        cumulative += QUIZ_PROBS[type] ?? 0;
        if (random < cumulative) {
            return type;
        }
    }

    // floating point safety fallback
    return types[types.length - 1];
}

module.exports = { QUIZ_TYPE, DIFFICULTY, checkCrosswordGrid, sampleQuizType };
