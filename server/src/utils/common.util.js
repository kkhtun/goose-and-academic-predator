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
    if (!Array.isArray(obj)) return false;
    const nonArrays = obj.filter((entry) => !Array.isArray(entry));
    return nonArrays.length === 0;
}

module.exports = { isString, haveSameEntries, isArrayOfArrays };
