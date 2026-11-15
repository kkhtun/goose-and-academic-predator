import { motion } from "framer-motion";

import { findPlayer } from "../../utils/common.utils";
import {
    getLevel,
    getPlayerPieceInfo,
    getRealm,
} from "../../utils/position.utils";
import CancelButton from "../buttons/CancelButton";
import { REALM_COLOR, REALM_TYPE, WORDING } from "../../constants";

export default function GameOverPopup({ open, onClose, gameState }) {
    if (!open) return null;

    const { playerUniqueId, gameInfo } = gameState;
    const { players, gameId } = gameInfo;
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const winningPlayer = players.find((p) => p.playerPos === 90);
    if (!winningPlayer) return null;

    const currentPlayer = findPlayer(gameInfo, playerUniqueId);
    const { level, realm } = getRealm(
        currentPlayer.playerPos,
        currentPlayer.score,
    );
    const isWinner = currentPlayer.playerPos === 90;
    const { Icon, tint } = getPlayerPieceInfo(
        currentPlayer.avatar,
        getLevel(currentPlayer.playerPos),
    );

    const handleClose = () => {
        onClose();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                background: "rgba(0,0,0,0.4)",
                padding: 20,
            }}
            onClick={() => {}}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "20%",
                    background: "#ffffff",
                    borderRadius: 8,
                    padding: 30,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            fontWeight: 700,
                            marginBottom: 20,
                            fontSize: 18,
                            textAlign: "center",
                        }}
                    >
                        Game Over
                    </div>

                    <div style={{ width: 60, height: 60, marginBottom: 20 }}>
                        <motion.div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.40))",
                            }}
                            animate={{
                                y: [0, -6, 0],
                                rotate: [0, 6, 0, -6, 0],
                            }}
                            transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            {" "}
                            <Icon
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    color: tint,
                                }}
                                aria-label={currentPlayer.avatar}
                            />
                        </motion.div>
                    </div>

                    {isWinner ? (
                        <div style={{ textAlign: "center" }}>
                            <span style={{ display: "block" }}>
                                Congratulations on your Graduation 🎓!
                            </span>

                            <span style={{ display: "block" }}>
                                You have reached the{" "}
                                <span style={{ color: REALM_COLOR[realm] }}>
                                    {realm === REALM_TYPE.HEAVEN
                                        ? WORDING.HEAVEN
                                        : WORDING.HELL}
                                </span>{" "}
                                level.
                            </span>

                            <span style={{ display: "block" }}>
                                {realm === REALM_TYPE.HEAVEN
                                    ? "Your awareness is remarkable."
                                    : "Improve your awareness by playing more."}
                            </span>

                            <span style={{ display: "block" }}>
                                Keep learning, and you'll be able to spot
                                predatory publishing with greater confidence.
                            </span>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center" }}>
                            You have been defeated by{" "}
                            <strong>{winningPlayer.playerName}</strong>. Better
                            luck next time and keep learning! You're on your way
                            to spotting academic predators more confidently.
                        </div>
                    )}

                    <div style={{ marginTop: 40, width: "100%" }}>
                        <strong
                            style={{ display: "block", textAlign: "center" }}
                        >
                            Scoreboard
                        </strong>

                        <div style={styles.scoreList}>
                            {sortedPlayers.map((p) => {
                                const isYou =
                                    p.playerUniqueId === playerUniqueId;

                                return (
                                    <div
                                        key={p.playerUniqueId}
                                        style={{
                                            ...styles.scoreItem,
                                            ...(isYou
                                                ? styles.activePlayer
                                                : {}),
                                        }}
                                    >
                                        <div style={styles.scoreRow}>
                                            <span>{p.playerName}</span>
                                            <span>{p.score}</span>
                                        </div>

                                        <div style={styles.levelText}>
                                            Level {getLevel(p.playerPos)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: 20,
                            textAlign: "center",
                            fontSize: 14,
                        }}
                    >
                        <a
                            href={`${import.meta.env.BASE_URL}the_green_wave.pdf`}
                            download="the_green_wave_watchlist.pdf"
                            style={{
                                color: "#2563eb",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            Click here to download an example watchlist.
                        </a>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 20,
                    }}
                >
                    <CancelButton text={"Back to Menu"} onClick={handleClose} />
                </div>
            </div>
        </div>
    );
}

const styles = {
    scoreList: {
        marginTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    scoreItem: {
        padding: "8px 10px",
        borderRadius: 8,
        background: "#f8fafc",
        border: "1px solid #3b82f6",
        fontSize: 16,
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },

    scoreRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    levelText: {
        fontSize: 12,
        opacity: 0.75,
        color: "#3b82f6",
    },

    activePlayer: {
        border: "2px solid #60a5fa",
        // background: "#243447",
    },
};
