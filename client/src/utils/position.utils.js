import { toast } from "react-toastify";
import { LEVEL_MARKER } from "../constants";

export const POS_PER_ROW = 10;
export const SQUARE_SIZE = window.innerHeight < 900 ? 80 : 84; // Some arbitrary UI adjustments for testing
export const GAP_BETWEEN_SQUARES = 6;

export const getRow = (pos) => Math.floor(pos / POS_PER_ROW);

export const getOrderedSquares = (boardSize) => {
    const result = [];

    const squares = Array.from({ length: boardSize }, (_, i) => i);
    for (let row = 0; row < Math.ceil(squares.length / POS_PER_ROW); row++) {
        const rowSquares = squares.slice(
            row * POS_PER_ROW,
            (row + 1) * POS_PER_ROW,
        );

        while (rowSquares.length < POS_PER_ROW) {
            rowSquares.push(null);
        }

        if (row % 2 === 1) {
            result.push(...rowSquares.reverse());
        } else {
            result.push(...rowSquares);
        }
    }

    return result;
};

export const getLevel = (pos) => {
    if (pos <= LEVEL_MARKER.LEVEL_0_END) {
        return 0;
    } else if (pos <= LEVEL_MARKER.LEVEL_1_END) {
        return 1;
    } else {
        return 2;
    }
};

// Temporary (to remove later)
export const notifyRed = (message) => {
    toast(message, {
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",

        style: {
            background: "linear-gradient(135deg, #2a0000, #5a0b0b)",
            color: "#ffdddd",
            borderLeft: "4px solid #ff3b3b",
            boxShadow: "0 0 18px rgba(255, 0, 0, 0.25)",
            borderRadius: "10px",
            fontSize: "14px",
        },
    });
};
