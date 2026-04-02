import { useRef, useEffect, useState } from "react";
import Square from "./Square";
import PlayerPiece from "./PlayerPiece";

export default function Board({
    playerPosition,
    level = 0,
    realm = "NORMAL",
    onPieceArrive,
}) {
    const startIdx = level * 30;
    const length = level === 2 ? 31 : 30;
    const squares = Array.from({ length }, (_, i) => startIdx + i);

    let bg = "#2c3e50";
    if (realm === "PUBLISHING_HOUSE") bg = "#8e44ad";
    else if (realm === "HEAVEN") bg = "#00a8ff";
    else if (realm === "HELL") bg = "#c23616";

    const boardStyle = {
        ...styles.board,
        background: bg,
        gridTemplateRows: `repeat(${level === 2 ? 4 : 3}, 1fr)`,
    };

    const boardRef = useRef(null);
    const [boardMetrics, setBoardMetrics] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!boardRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            // contentRect is the space inside the padding
            setBoardMetrics({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });
        observer.observe(boardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div style={styles.wrapper}>
            <div ref={boardRef} style={boardStyle}>
                {squares.map((num) => (
                    <Square key={num} number={num} />
                ))}{" "}
                <PlayerPiece
                    position={playerPosition}
                    level={level}
                    boardMetrics={boardMetrics}
                    onArrive={onPieceArrive}
                />
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        width: "100%",
    },
    board: {
        position: "relative",
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gap: "6px",
        padding: "24px",
        background: "#2c3e50",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
    },
};
