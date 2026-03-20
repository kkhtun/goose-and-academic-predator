import { useState } from "react";

const CROSSWORD_FILL_RATIO = 0.9; // 20% letters prefilled

function createStartingPosLookupObj(wordResults) {
    const obj = {};
    for (const result of wordResults) {
        const { startx, starty } = result;
        const key = `${startx},${starty}`; // string key for pos lookup
        obj[key] = result;
    }
    return obj;
}

function CrosswordBuilder({ content, handleSubmit, hasAnswered }) {
    const crosswordData = content;
    console.log(content);
    const startPosLookup = createStartingPosLookupObj(crosswordData.result);

    // Pre-fill letters randomly based on crosswordData.table
    const [grid, setGrid] = useState(() => {
        return crosswordData.table.map((row) =>
            row.map((cell) => {
                if (cell === "-") return ""; // blocked cells
                // randomly prefill ~20% of the letters
                return Math.random() < CROSSWORD_FILL_RATIO ? cell : "";
            }),
        );
    });

    const handleChange = (row, col, value) => {
        if (value.length > 1) return;
        const newGrid = grid.map((r) => [...r]);
        newGrid[row][col] = value.toUpperCase();
        setGrid(newGrid);
    };

    const isSolved = () => {
        for (let r = 0; r < crosswordData.rows; r++) {
            for (let c = 0; c < crosswordData.cols; c++) {
                if (crosswordData.table[r][c] !== "-" && grid[r][c] === "")
                    return false;
            }
        }
        return true;
    };

    const styles = {
        app: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
            background: "#f0f4f8",
            padding: "20px",
        },
        title: { color: "#333" },
        crossword: {
            display: "grid",
            gridTemplateColumns: `repeat(${crosswordData.cols}, 30px)`,
            gridTemplateRows: `repeat(${crosswordData.rows}, 30px)`,
            gap: "1px",
        },
        cell: {
            width: "30px",
            height: "30px",
            textAlign: "center",
            fontSize: "15px",
            fontWeight: "bold",
            textTransform: "uppercase",
            border: "1px solid #ccc",
            background: "white",
            outline: "none",
        },
        blocked: { background: "#333" },
        cluesContainer: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            marginBottom: "20px",
            width: "90%",
        },
        clueSection: { width: "48%", fontSize: 14 },
        clueTitle: { fontWeight: "bold", marginBottom: "10px" },
        clue: { marginBottom: "8px" },
        status: { marginTop: "20px", fontSize: "18px" },
        solved: { color: "green", fontWeight: "bold" },
    };

    return (
        <div style={styles.app}>
            {/* <h1 style={styles.title}>Crossword Puzzle</h1> */}
            <div style={styles.crossword}>
                {crosswordData.table.map((row, rIdx) =>
                    row.map((cell, cIdx) => (
                        <div
                            key={`${rIdx}-${cIdx}`}
                            style={{
                                position: "relative",
                                width: "30px",
                                height: "30px",
                            }}
                        >
                            <input
                                style={{
                                    ...styles.cell,
                                    ...(cell === "-" ? styles.blocked : {}),
                                    width: "100%",
                                    height: "100%",
                                }}
                                disabled={cell === "-"}
                                value={grid[rIdx][cIdx]}
                                onChange={(e) =>
                                    handleChange(rIdx, cIdx, e.target.value)
                                }
                                maxLength={1}
                            />
                            {/* for some reason, rIdx is actually column value so we put it after comma */}
                            {startPosLookup[`${cIdx + 1},${rIdx + 1}`] && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "2px",
                                        left: "2px",
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        color: "#555",
                                        pointerEvents: "none", // click goes through to input
                                    }}
                                >
                                    {
                                        startPosLookup[
                                            `${cIdx + 1},${rIdx + 1}`
                                        ].position
                                    }
                                </span>
                            )}
                        </div>
                    )),
                )}
            </div>

            <div style={styles.cluesContainer}>
                <div style={styles.clueSection}>
                    <div style={styles.clueTitle}>Across</div>
                    {crosswordData.result
                        .filter((c) => c.orientation === "across")
                        .map((c) => (
                            <div key={c.position} style={styles.clue}>
                                <strong>{c.position}.</strong> {c.clue}
                            </div>
                        ))}
                </div>
                <div style={styles.clueSection}>
                    <div style={styles.clueTitle}>Down</div>
                    {crosswordData.result
                        .filter((c) => c.orientation === "down")
                        .map((c) => (
                            <div key={c.position} style={styles.clue}>
                                <strong>{c.position}.</strong> {c.clue}
                            </div>
                        ))}
                </div>
            </div>

            {isSolved() ? (
                <div>
                    <button
                        onClick={() => handleSubmit(grid)}
                        disabled={hasAnswered}
                        style={{
                            padding: "10px 20px",
                            borderRadius: 6,
                            border: "1px solid #ddd",
                            cursor: "pointer",
                            fontSize: 18,
                            fontWeight: 600,
                            flex: 1,
                            maxWidth: 120,
                        }}
                    >
                        Submit
                    </button>
                </div>
            ) : (
                "Fill all letters to solve"
            )}

            {/* <div style={styles.status}>
                {isSolved() ? (
                    // <span style={styles.solved}>🎉 Crossword Solved!</span>
                   
                ) : (
                    "Fill all letters to solve"
                )}
            </div> */}
        </div>
    );
}

export default CrosswordBuilder;
