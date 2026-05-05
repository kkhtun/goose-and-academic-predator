import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import {
    GAP_BETWEEN_SQUARES,
    getLevel,
    getRow,
    POS_PER_ROW,
    SQUARE_SIZE,
} from "../utils/position.utils";
import { DogIcon } from "./piece/DogIcon";
import { DogGradIcon } from "./piece/DogGradIcon";
import { CatIcon } from "./piece/CatIcon";
import { CatGradIcon } from "./piece/CatGradIcon";
import { BirdIcon } from "./piece/BirdIcon";
import { BirdGradIcon } from "./piece/BirdGradIcon";
import { FishIcon } from "./piece/FishIcon";
import { FishGradIcon } from "./piece/FishGradIcon";
import { CamelIcon } from "./piece/CamelIcon";
import { CamelGradIcon } from "./piece/CamelGradIcon";

export default function PlayerPiece({
    position,
    playerPath,
    onArrive,
    avatar,
    playerName,
}) {
    const squareSize = SQUARE_SIZE + GAP_BETWEEN_SQUARES; // 80px square + 6px gap (matches Board grid)
    const pieceSize = 60;
    const centerOffset = (squareSize - pieceSize) / 2;

    const controls = useAnimation();
    const prevPosRef = useRef(position);

    const posToXY = (pos) => {
        // const col = pos % 10;
        const row = getRow(pos);

        // Even rows will be left to right
        // Odd rows will go from right to left
        const col =
            row % 2 === 1
                ? POS_PER_ROW - (pos % POS_PER_ROW) - 1
                : pos % POS_PER_ROW;

        return {
            x: col * squareSize + centerOffset,
            y: row * squareSize + centerOffset,
        };
    };

    useEffect(() => {
        // Animate if path exists
        if (playerPath && playerPath.length > 0) {
            const startPos = prevPosRef.current ?? position;

            const fullPath = [startPos, ...playerPath];

            const xs = fullPath.map((p) => posToXY(p).x);
            const ys = fullPath.map((p) => posToXY(p).y);

            const perStep = 0.18;
            const total = Math.max(0.001, playerPath.length * perStep);

            const times = xs.map((_, i) =>
                xs.length === 1 ? 1 : i / (xs.length - 1),
            );

            controls
                .start({
                    x: xs,
                    y: ys,
                    transition: { duration: total, times, ease: "linear" },
                })
                .then(() => {
                    const finalPos = fullPath[fullPath.length - 1];
                    prevPosRef.current = finalPos;

                    if (typeof onArrive === "function") {
                        onArrive(finalPos);
                    }
                });

            return;
        }

        // No path - just place (refresh case)
        const { x, y } = posToXY(position);
        controls.set({ x, y });
        prevPosRef.current = position;
    }, [playerPath, position, controls]);

    // initial placement
    const initial = posToXY(position);

    const level = getLevel(position);

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

    return (
        <motion.div
            initial={{ x: initial.x, y: initial.y }}
            animate={controls}
            style={{
                position: "absolute",
                width: pieceSize,
                height: pieceSize,
                zIndex: 20,
                pointerEvents: "none",
            }}
        >
            <motion.div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.88))",
                }}
                animate={{ y: [0, -6, 0], rotate: [0, 6, 0, -6, 0] }}
                transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Icon
                    style={{ width: "100%", height: "100%", color: tint }}
                    aria-label={avatar}
                />
                <div
                    style={{
                        marginTop: 4,
                        fontSize: 11,
                        color: "#ffffff",
                        textShadow: "0 2px 4px rgba(0,0,0,0.95)",
                        fontWeight: 600,
                        textAlign: "center",
                        maxWidth: pieceSize + 10,
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {playerName}
                </div>
            </motion.div>
        </motion.div>
    );
}
