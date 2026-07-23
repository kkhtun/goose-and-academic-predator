import { useState } from "react";
import {
    BOARD_POSITIONS,
    POSITION_INSTRUCTIONS,
    POSITION_TYPE,
    REALM_COLOR,
    REALM_TYPE,
} from "../constants";
import { getLevel, SQUARE_SIZE } from "../utils/position.utils";
import { BoxIcon } from "./icons/BoxIcon";

export default function Square({ number, heavenOrHell }) {
    const [hovered, setHovered] = useState(false);

    // Unified Light Academic Tabletop Palette
    const level = getLevel(number);
    let dynamicStyles = {
        background: "#E2E8F0",
        color: "#23405A",
    };

    if (level === 1) {
        dynamicStyles.background = "#BFDBFE";
        dynamicStyles.color = "#23405A";
    } else if (level === 2) {
        dynamicStyles.background = "#60A5FA";
        dynamicStyles.color = "#FFFFFF";
    }

    const isChallenge = BOARD_POSITIONS[number] === POSITION_TYPE.CHALLENGE;
    if (isChallenge) {
        dynamicStyles.border = "2px solid #F97316";
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
            <span style={number === 90 ? { color: "#F59E0B", fontWeight: "900" } : {}}>
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
        background: "#E2E8F0",
        border: "1px solid #D6E4F0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        cursor: "pointer",
    },
    squareHovered: {
        transform: "translateY(-2px) scale(1.04)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        zIndex: 20,
    },
    tooltip: {
        position: "absolute",
        top: "110%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#FFFFFF",
        color: "#23405A",
        border: "1px solid #D6E4F0",
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: 12,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        pointerEvents: "none",
        zIndex: 10,
    },
};
