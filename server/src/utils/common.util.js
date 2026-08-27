function isString(value) {
    return value && typeof value === "string";
}

function haveSameEntries(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    if (set1.size !== arr1.length || set2.size !== arr2.length) {
        return false; // duplicates detected
    }

    for (const item of set1) {
        if (!set2.has(item)) return false;
    }

    return true;
}

function isArrayOfArrays(obj) {
    if (!Array.isArray(obj)) return false; // not an array
    if (obj.length === 0) return false; // just a flat empty array
    const nonArrays = obj.filter((entry) => !Array.isArray(entry)); // contains non-array entries
    return nonArrays.length === 0;
}

function shuffleArray(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function isLocal() {
    return process.env.NODE_ENV === "local";
}

module.exports = {
    isString,
    haveSameEntries,
    isArrayOfArrays,
    shuffleArray,
    isLocal,
};
