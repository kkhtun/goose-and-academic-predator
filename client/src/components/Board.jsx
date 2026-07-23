import Square from "./Square";
import PlayerPiece from "./PlayerPiece";
import {
    BOARD_SIZE,
    SCORE_FOR_HEAVEN,
    LEVEL_MARKER,
    REALM_TYPE,
} from "../constants";
import {
    GAP_BETWEEN_SQUARES,
    getOrderedSquares,
    SQUARE_SIZE,
} from "../utils/position.utils";
import { findPlayer } from "../utils/common.utils";

export default function Board({ onPieceArrive, gameState, setGameState }) {
    const { gameInfo, playerUniqueId } = gameState;
    const { players } = gameInfo;

    const clientPlayer = findPlayer(gameInfo, playerUniqueId);
    const clientPlayerPos = clientPlayer.playerPos;
    // If client player pos is after LEVEL 1 and still not enough score, change to HELL
    const heavenOrHell =
        clientPlayerPos > LEVEL_MARKER.LEVEL_1_END &&
        clientPlayer.score < SCORE_FOR_HEAVEN
            ? REALM_TYPE.HELL
            : REALM_TYPE.HEAVEN;

    const squares = getOrderedSquares(BOARD_SIZE);

    return (
        <div style={styles.wrapper}>
            <div style={styles.board}>
                {squares.map((num, i) => (
                    <Square key={i} number={num} heavenOrHell={heavenOrHell} />
                ))}{" "}
                {players.map(
                    ({
                        playerUniqueId,
                        playerPos,
                        avatar,
                        playerName,
                        playerPath,
                    }) => (
                        <PlayerPiece
                            key={playerUniqueId}
                            avatar={avatar}
                            playerPath={playerPath}
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
        gridTemplateColumns: `repeat(10, ${SQUARE_SIZE}px)`,
        gap: `${GAP_BETWEEN_SQUARES}px`,
        padding: "16px",
        background: "#FFFDF8",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        border: "1px solid #D6E4F0",
    },
};
