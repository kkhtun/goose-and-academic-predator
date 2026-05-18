import { useState, useRef } from "react";
import PrimaryButton from "../buttons/PrimaryButton";

const CROSSWORD_FILL_RATIO = 0.65; // 20% letters prefilled

function createStartingPosLookupObj(wordResults) {
    const obj = {};
    for (const result of wordResults) {
        const { startx, starty } = result;
        const key = `${startx},${starty}`; // string key for pos lookup
        obj[key] = result;
    }
    return obj;
}

function CrosswordBuilder({ content, handleSubmit, hasAnswered, isCorrect }) {
    const inputRefs = useRef({});

    const moveFocus = (row, col, direction) => {
        const moves = {
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1],
        };

        const [rowMove, colMove] = moves[direction];

        const nextRow = row + rowMove;
        const nextCol = col + colMove;

        const isOutOfBounds =
            nextRow < 0 ||
            nextRow >= crosswordData.rows ||
            nextCol < 0 ||
            nextCol >= crosswordData.cols;

        if (isOutOfBounds) return;

        // Do not move into blocked / blank crossword cells
        if (crosswordData.table[nextRow][nextCol] === "-") return;

        inputRefs.current[`${nextRow}-${nextCol}`]?.focus();
    };

    const handleKeyDown = (e, row, col) => {
        if (
            e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight"
        ) {
            e.preventDefault();
            moveFocus(row, col, e.key);
        }
    };

    const crosswordData = content;
    const startPosLookup = createStartingPosLookupObj(crosswordData.result);

    const fillCrossword = (data, fillRatio) => {
        return data.map((row) =>
            row.map((cell) => {
                if (cell === "-") return ""; // blocked cells
                return Math.random() < fillRatio ? cell : "";
            }),
        );
    };

    // Pre-fill letters randomly based on crosswordData.table
    const [grid, setGrid] = useState(() => {
        return fillCrossword(crosswordData.table, CROSSWORD_FILL_RATIO);
    });
    const [submittedGrid, setSubmittedGrid] = useState([[]]);

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

    const onSubmit = () => {
        handleSubmit(grid);
        setSubmittedGrid(grid);
        setGrid(fillCrossword(crosswordData.table, 1));
    };

    const styles = {
        app: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Arial, sans-serif",
            background: "#f4f9fd",
            padding: 20,
            borderRadius: 14,
            color: "#2c3e50",
        },

        puzzle: {
            display: "flex",
            marginBottom: 16,
            padding: 18,
            borderRadius: 14,
            background: "#ffffff",
            border: "1px solid #d7e8f7",
            boxShadow: "0 6px 18px rgba(52, 152, 219, 0.12)",
        },

        crossword: {
            display: "grid",
            gridTemplateColumns: `repeat(${crosswordData.cols}, 30px)`,
            gridTemplateRows: `repeat(${crosswordData.rows}, 30px)`,
            gap: "1px",
            padding: 6,
            borderRadius: 8,
            background: "#d7e8f7",
            border: "1px solid #b9d8ef",
        },

        cell: {
            width: "30px",
            height: "30px",
            textAlign: "center",
            fontSize: "15px",
            fontWeight: "bold",
            textTransform: "uppercase",
            border: "1px solid #b9d8ef",
            background: "#ffffff",
            color: "#2c3e50",
            outline: "none",
            borderRadius: 3,
            boxSizing: "border-box",
        },

        cellAnswered: {
            color: "#3498db",
        },

        blocked: {
            background: "#2c3e50",
            borderColor: "#2c3e50",
        },

        cluesContainer: {
            display: "flex",
            flexDirection: "column",
            marginLeft: 20,
            padding: 14,
            borderRadius: 14,
            background: "#f9fcff",
            border: "1px solid #d7e8f7",
            boxShadow: "0 4px 12px rgba(52, 152, 219, 0.08)",
            color: "#2c3e50",
        },

        clueSection: {
            fontSize: 14,
            padding: "10px 12px",
            borderRadius: 10,
            background: "#ffffff",
            border: "1px solid #e3f1fb",
            marginBottom: 12,
        },

        clueTitle: {
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#2c80b4",
            fontSize: 14,
            paddingBottom: 6,
            borderBottom: "1px solid #d7e8f7",
        },

        clue: {
            marginBottom: "6px",
            padding: "6px 8px",
            borderRadius: 6,
            lineHeight: 1.35,
            color: "#34495e",
            background: "#f4f9fd",
            borderLeft: "3px solid #3498db",
        },

        status: {
            marginTop: "20px",
            fontSize: "18px",
            color: "#2c3e50",
        },

        solved: {
            color: "#4CAF50",
            fontWeight: "bold",
        },
    };

    return (
        <div style={styles.app}>
            <div style={styles.puzzle}>
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
                                    ref={(el) => {
                                        inputRefs.current[`${rIdx}-${cIdx}`] =
                                            el;
                                    }}
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, rIdx, cIdx)
                                    }
                                    style={{
                                        ...styles.cell,
                                        ...(cell === "-" ? styles.blocked : {}),
                                        width: "100%",
                                        height: "100%",
                                        ...(hasAnswered
                                            ? styles.cellAnswered
                                            : {}),
                                        // Showing red
                                        ...(hasAnswered &&
                                        cell !== "-" &&
                                        grid[rIdx][cIdx] !==
                                            submittedGrid[rIdx][cIdx]
                                            ? { color: "red" }
                                            : {}),
                                    }}
                                    disabled={cell === "-" || hasAnswered}
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

                    <hr
                        style={{
                            width: "100%",
                            border: "none",
                            borderTop: "1px solid #d7e8f7",
                            margin: "16px 0",
                        }}
                    />

                    <div style={{ marginTop: 10 }}>
                        <PrimaryButton
                            onClick={() => onSubmit()}
                            disabled={hasAnswered || !isSolved()}
                            text={"Submit"}
                        />
                        {!hasAnswered ? (
                            <div
                                style={{
                                    fontSize: 14,
                                    color: "#8a6500",
                                    background: "#fff8dc",
                                    border: "1px solid #f5d98b",
                                    lineHeight: 1.4,
                                    marginTop: 12,
                                    padding: 12,
                                    borderRadius: 10,
                                }}
                            >
                                Please fill the missing letters to solve the
                                puzzle.
                            </div>
                        ) : (
                            <></>
                        )}
                        {/* {isSolved() ? (
                            <PrimaryButton
                                onClick={() => handleSubmit(grid)}
                                disabled={hasAnswered}
                                text={"Submit"}
                            />
                        ) : (
                            <div
                                style={{
                                    fontSize: 14,
                                    color: "#8a6500",
                                    background: "#fff8dc",
                                    border: "1px solid #f5d98b",
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    lineHeight: 1.4,
                                }}
                            >
                                Please fill the missing letters to solve the
                                puzzle.
                            </div>
                        )} */}
                    </div>

                    {hasAnswered && (
                        <div
                            style={{
                                marginTop: 12,
                                padding: 12,
                                borderRadius: 10,
                                background: isCorrect ? "#eef8ee" : "#fdecea",
                                border: `1px solid ${isCorrect ? "#a5d6a7" : "#f1a9a0"}`,
                            }}
                        >
                            <div
                                style={{
                                    color: isCorrect ? "#43a047" : "#c0392b",
                                    fontWeight: 600,
                                }}
                            >
                                {isCorrect
                                    ? "✓ Your answer is correct!"
                                    : "✗ Your answer is incorrect."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CrosswordBuilder;
