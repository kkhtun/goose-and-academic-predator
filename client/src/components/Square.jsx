import { useState } from "react";
import {
    BOARD_POSITIONS,
    POSITION_INSTRUCTIONS,
    REALM_TYPE,
} from "../constants";
import { getLevel, SQUARE_SIZE } from "../utils/position.utils";
import { BoxIcon } from "./icons/BoxIcon";

export default function Square({ number, heavenOrHell }) {
    const [hovered, setHovered] = useState(false);

    // Some UI logic to change board colors
    const level = getLevel(number);
    let dynamicStyles = { background: "#ecf0f1" };
    if (level === 1) {
        dynamicStyles.background = "rgb(161, 93, 190)";
        // dynamicStyles.background = "rgba(142, 68, 173, 1)";
        dynamicStyles.color = "#ecf0f1";
    } else if (level === 2 || number === null) {
        // Further determine heaven or hell
        if (heavenOrHell === REALM_TYPE.HELL) {
            dynamicStyles.background = "rgb(196, 106, 100)";
        } else {
            dynamicStyles.background = "rgb(86, 164, 216)";
        }
        dynamicStyles.color = "#ecf0f1";
    }

    const getDescription = (number) => {
        if (number === 0) return "This is the start square.";
        if (number === 90) return "Land on this square to win the game! 🎉";
        const type = BOARD_POSITIONS[number];
        return POSITION_INSTRUCTIONS[type] || "";
    };

    return (
        <div
            style={{
                ...styles.square,
                ...dynamicStyles,
                ...(hovered ? styles.squareHovered : {}),
                visibility: number !== null ? "visible" : "hidden",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span style={number === 90 ? { color: "#FFD700" } : {}}>
                {number}
            </span>
            <BoxIcon
                number={number}
                type={BOARD_POSITIONS[number]}
                onSquare={true}
            />
            {hovered && (
                <div style={styles.tooltip}>{getDescription(number)}</div>
            )}
        </div>
    );
}
const styles = {
    square: {
        width: `${SQUARE_SIZE}px`,
        height: `${SQUARE_SIZE}px`,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 18,
        position: "relative",
        background: "#ecf0f1",
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        cursor: "pointer",
    },
    squareHovered: {
        transform: "translateY(-2px) scale(1.04)",
        boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
        zIndex: 20,
    },
    tooltip: {
        position: "absolute",
        top: "110%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#2c3e50",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: 12,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        pointerEvents: "none",
        zIndex: 10,
    },
};
