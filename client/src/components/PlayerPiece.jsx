import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaDog, FaCat, FaCrow, FaFish } from "react-icons/fa";
import { GiCamel } from "react-icons/gi";

export default function PlayerPiece({
    position,
    level = 0,
    boardMetrics,
    onArrive,
    avatar,
    playerName,
}) {
    const pieceSize = 48;
    const boardPadding = 24;
    const gap = 6;
    const cols = 10;
    const rows = level === 2 ? 4 : 3;

    const isReady = boardMetrics && boardMetrics.width > 0;
    // If ResizeObserver hasn't fired yet, fallback to a standard layout
    const availableWidth = isReady ? boardMetrics.width : 854; // 10*80 + 9*6
    const availableHeight = isReady ? boardMetrics.height : 338; // 4*80 + 3*6

    const squareWidth = (availableWidth - (cols - 1) * gap) / cols;
    const squareHeight = (availableHeight - (rows - 1) * gap) / rows;

    const offsetX = boardPadding + (squareWidth - pieceSize) / 2;
    const offsetY = boardPadding + (squareHeight - pieceSize) / 2;

    const stepX = squareWidth + gap;
    const stepY = squareHeight + gap;

    const controls = useAnimation();
    const prevPosRef = useRef(position);

    const posToXY = (pos) => {
        const levelStart = level * 30;
        const relativePos = Math.max(0, pos - levelStart);
        const col = relativePos % 10;
        const row = Math.floor(relativePos / 10);
        return {
            x: col * stepX + offsetX,
            y: row * stepY + offsetY,
        };
    };

    useEffect(() => {
        // console.log("Ref", prevPosRef.current);
        // console.log("Pos", position);
        const from = prevPosRef.current;
        const to = position;
        if (from === to) {
            // ensure initial placement
            const { x, y } = posToXY(to);
            controls.set({ x, y });
            return;
        }

        const step = from < to ? 1 : -1;
        const steps = [];
        for (let p = from + step; step > 0 ? p <= to : p >= to; p += step) {
            steps.push(p);
        }

        // Build keyframe arrays starting from the current cell
        const start = posToXY(from);
        const xs = [start.x, ...steps.map((p) => posToXY(p).x)];
        const ys = [start.y, ...steps.map((p) => posToXY(p).y)];

        // Timing: adjust per-step duration (seconds)
        const perStep = 0.18;
        const total = Math.max(0.001, steps.length * perStep);
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
                prevPosRef.current = to;
                if (typeof onArrive === "function") onArrive(to);
            });

        prevPosRef.current = to;
    }, [position, controls]);

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
            </motion.div>
            <div
                style={{
                    position: "absolute",
                    top: "100%", // directly below icon
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "white",
                    textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                }}
            >
                {playerName}
            </div>
        </motion.div>
    );
}
