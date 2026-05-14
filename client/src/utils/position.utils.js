import { toast } from "react-toastify";
import { LEVEL_MARKER, REALM_TYPE, SCORE_FOR_HEAVEN } from "../constants";
import { DogIcon } from "../components/piece/DogIcon";
import { DogGradIcon } from "../components/piece/DogGradIcon";
import { CatIcon } from "../components/piece/CatIcon";
import { CatGradIcon } from "../components/piece/CatGradIcon";
import { BirdIcon } from "../components/piece/BirdIcon";
import { BirdGradIcon } from "../components/piece/BirdGradIcon";
import { FishIcon } from "../components/piece/FishIcon";
import { FishGradIcon } from "../components/piece/FishGradIcon";
import { CamelIcon } from "../components/piece/CamelIcon";
import { CamelGradIcon } from "../components/piece/CamelGradIcon";

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

export const getPlayerPieceInfo = (avatar, level) => {
    let Icon;
    let tint;
    switch (avatar) {
        case "cat":
            Icon = level === 2 ? CatGradIcon : CatIcon;
            tint = "#e84393";
            break;
        case "bird":
            Icon = level === 2 ? BirdGradIcon : BirdIcon;
            tint = "#00b894";
            break;
        case "fish":
            Icon = level === 2 ? FishGradIcon : FishIcon;
            tint = "#0984e3";
            break;
        case "camel":
            Icon = level === 2 ? CamelGradIcon : CamelIcon;
            tint = "#e17055";
            break;
        case "dog":
        default:
            Icon = level === 2 ? DogGradIcon : DogIcon;
            tint = "#6c5ce7";
            break;
    }
    return { Icon, tint };
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

export const getRealm = (playerPos, playerScore) => {
    const level = getLevel(playerPos);
    let realm;
    if (level >= 2) {
        realm =
            playerScore >= SCORE_FOR_HEAVEN
                ? REALM_TYPE.HEAVEN
                : REALM_TYPE.HELL;
    } else {
        realm = REALM_TYPE.BOTH; // Realm only applies in Level 2
    }
    return { realm, level };
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
