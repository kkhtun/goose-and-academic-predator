import { useRef, useEffect, useState } from "react";
import Square from "./Square";
import PlayerPiece from "./PlayerPiece";
// import useLocalStorage from "../hooks/useLocalStorage";
import { BOARD_SIZE } from "../constants";
// import { useLocalStorage } from "@uidotdev/usehooks";

export default function Board({
    // playerPosition,
    // level = 0,
    // realm = "NORMAL",
    onPieceArrive,
    gameState,
    setGameState,
}) {
    // const [gameState, setGameState] = useLocalStorage("GAME_STATE", {});
    const { gameInfo } = gameState;
    const { players } = gameInfo;

    const squares = Array.from({ length: BOARD_SIZE }, (_, i) => i);

    return (
        <div style={styles.wrapper}>
            <div style={styles.board}>
                {squares.map((num) => (
                    <Square key={num} number={num} />
                ))}{" "}
                {players.map(
                    ({ playerUniqueId, playerPos, avatar, playerName }) => (
                        <PlayerPiece
                            key={playerUniqueId}
                            avatar={avatar}
                            position={playerPos}
                            playerName={playerName}
                            onArrive={onPieceArrive}
                        />
                    ),
                )}
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        position: "relative",
        width: "max-content",
    },
    board: {
        display: "grid",
        gridTemplateColumns: "repeat(10, 80px)",
        gap: "6px",
        padding: "12px",
        background: "#2c3e50",
        borderRadius: "12px",
    },
};
