import Square from "./Square";
import PlayerPiece from "./PlayerPiece";
import {
    BOARD_SIZE,
    SCORE_FOR_SAVELIST,
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
    // If client player pos is after LEVEL 1 and still not enough score, change to WATCHLIST
    const savelistOrWatchlist =
        clientPlayerPos > LEVEL_MARKER.LEVEL_1_END &&
        clientPlayer.score < SCORE_FOR_SAVELIST
            ? REALM_TYPE.WATCHLIST
            : REALM_TYPE.SAVELIST;

    const squares = getOrderedSquares(BOARD_SIZE);

    return (
        <div style={styles.wrapper}>
            <div style={styles.board}>
                {squares.map((num, i) => (
                    <Square key={i} number={num} savelistOrWatchlist={savelistOrWatchlist} />
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
        padding: "12px",
        background: "#2c3e50",
        borderRadius: "12px",
    },
};
