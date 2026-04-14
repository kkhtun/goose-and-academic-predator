import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaDog, FaCat, FaCrow, FaFish } from "react-icons/fa";
import { GiCamel } from "react-icons/gi";
import {
    GAP_BETWEEN_SQUARES,
    getRow,
    POS_PER_ROW,
    SQUARE_SIZE,
} from "../utils/position.utils";

export default function PlayerPiece({
    position,
    playerPath,
    onArrive,
    avatar,
    playerName,
}) {
    const squareSize = SQUARE_SIZE + GAP_BETWEEN_SQUARES; // 80px square + 6px gap (matches Board grid)
    const pieceSize = 48;
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

    let Icon;
    let tint;
    switch (avatar) {
        case "cat":
            Icon = FaCat;
            tint = "#e84393";
            break;
        case "bird":
            Icon = FaCrow;
            tint = "#00b894";
            break;
        case "fish":
            Icon = FaFish;
            tint = "#0984e3";
            break;
        case "camel":
            Icon = GiCamel;
            tint = "#e17055";
            break;
        case "dog":
        default:
            Icon = FaDog;
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

// Last useEffect (just saving in case sth breaks)

// useEffect(() => {
//     const from = prevPosRef.current;
//     const to = position;
//     if (from === to) {
//         // ensure initial placement
//         const { x, y } = posToXY(to);
//         controls.set({ x, y });
//         return;
//     }

//     const step = from < to ? 1 : -1;
//     const steps = [];
//     for (let p = from + step; step > 0 ? p <= to : p >= to; p += step) {
//         steps.push(p);
//     }

//     // Build keyframe arrays starting from the current cell
//     const start = posToXY(from);
//     const xs = [start.x, ...steps.map((p) => posToXY(p).x)];
//     const ys = [start.y, ...steps.map((p) => posToXY(p).y)];

//     // Timing: adjust per-step duration (seconds)
//     const perStep = 0.18;
//     const total = Math.max(0.001, steps.length * perStep);
//     const times = xs.map((_, i) =>
//         xs.length === 1 ? 1 : i / (xs.length - 1),
//     );

//     controls
//         .start({
//             x: xs,
//             y: ys,
//             transition: { duration: total, times, ease: "linear" },
//         })
//         .then(() => {
//             prevPosRef.current = to;
//             if (typeof onArrive === "function") onArrive(to);
//         });

//     prevPosRef.current = to;
// }, [position, controls]);
