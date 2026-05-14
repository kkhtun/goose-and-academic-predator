import { useState } from "react";
import DiceRoller from "./DiceRoller";
import { findPlayer } from "../utils/common.utils";
import SecondaryButton from "./buttons/SecondaryButton";
import CallToActionButton from "./buttons/CallToActionButton";
import ConfirmPopup from "./popups/ConfirmPopup";
import { getLevel, getRealm } from "../utils/position.utils";
import { REALM_COLOR, REALM_TYPE, SCORE_FOR_HEAVEN } from "../constants";

export default function GameControls({
    lastRoll,
    onRoll,
    onQuit,
    setOpenInstruct,
    gameState,
    setGameState,
}) {
    const [copied, setCopied] = useState(false);
    const [showConfirmQuit, setShowConfirmQuit] = useState(false);

    const { playerUniqueId, gameInfo } = gameState;
    const { players, gameId } = gameInfo;
    const player = findPlayer(gameInfo, playerUniqueId);

    const nextTurnPlayer = (gameInfo) => {
        const { turnPlayerId } = gameInfo;
        return findPlayer(gameInfo, turnPlayerId);
    };

    const isYourTurn = (gameInfo) => {
        return (
            nextTurnPlayer(gameInfo).playerUniqueId === player.playerUniqueId
        );
    };

    const isAllowedRoll = (gameInfo) => {
        return !gameInfo.isLocked;
    };

    const gameHasBegun = (gameInfo) => {
        return gameInfo.players.some((p) => p.playerPos > 0);
    };

    const handleCopy = async () => {
        const domain = window.location.origin;
        // const message = `Hi, you are invited to the game of "Goose and Academic Predator"! Here is the link to join the game ${domain}, your game ID is ${gameId}`;
        const message = `${gameId}`;

        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return (
        <>
            <div style={styles.panel} className="game-panel">
                <h2 style={styles.title}>Game Status</h2>

                <div style={styles.section}>
                    <strong>Player</strong>
                    <span>{player.playerName || "UNK"}</span>
                </div>

                <div style={styles.section}>
                    <strong>Turn</strong>{" "}
                    <span
                        style={{
                            color: isYourTurn(gameInfo) ? "#27ae60" : "#c0392b",
                        }}
                    >
                        {nextTurnPlayer(gameInfo).playerName}
                    </span>
                </div>

                <div style={styles.section}>
                    <strong>Score</strong> <span>{player.score}</span>
                </div>

                <div style={styles.section}>
                    <strong>Last Roll</strong> <span>{lastRoll ?? "-"}</span>
                </div>

                <DiceRoller
                    onResult={onRoll}
                    gameState={gameState}
                    setGameState={setGameState}
                    isAllowedRoll={
                        isYourTurn(gameInfo) && isAllowedRoll(gameInfo)
                    }
                />

                <div style={{ marginTop: 20 }}>
                    <strong>Scoreboard</strong>

                    <div style={styles.scoreList}>
                        {players.map((p) => {
                            const isCurrentTurn =
                                p.playerUniqueId ===
                                nextTurnPlayer(gameInfo).playerUniqueId;

                            let { level, realm } = getRealm(
                                p.playerPos,
                                p.score,
                            );
                            // realm = REALM_TYPE.HELL;

                            const realmHeading =
                                p.score < SCORE_FOR_HEAVEN
                                    ? REALM_TYPE.HELL
                                    : REALM_TYPE.HEAVEN;

                            return (
                                <div
                                    key={p.playerUniqueId}
                                    style={{
                                        ...styles.scoreItem,
                                        border: `2px solid ${REALM_COLOR[realm]}`,
                                    }}
                                >
                                    <div style={styles.scoreRow}>
                                        <span>{p.playerName}</span>
                                        <span>{p.score}</span>
                                    </div>

                                    <div style={styles.levelText}>
                                        Level {level}{" "}
                                        <span
                                            style={{
                                                color: REALM_COLOR[realm],
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {realm === REALM_TYPE.BOTH
                                                ? ""
                                                : realm}
                                        </span>
                                    </div>

                                    <div style={styles.levelText}>
                                        Heading for{" "}
                                        <span
                                            style={{
                                                color: REALM_COLOR[
                                                    realmHeading
                                                ],
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {realmHeading}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <SecondaryButton
                    onClick={handleCopy}
                    text={copied ? "✅ Copied" : "📋 Game ID"}
                    disabled={gameHasBegun(gameInfo) || copied}
                    style={{ marginTop: 20 }}
                />
                <SecondaryButton
                    onClick={() => setOpenInstruct(true)}
                    text={"Help"}
                />
                <CallToActionButton
                    onClick={() => setShowConfirmQuit(true)}
                    text={"Quit"}
                    action="quit"
                />
            </div>

            {/* Hidden popup for quit confirmation */}
            <ConfirmPopup
                open={showConfirmQuit}
                message="Are you sure you want to quit the game?"
                onConfirm={() => {
                    setShowConfirmQuit(false);
                    onQuit();
                }}
                onCancel={() => setShowConfirmQuit(false)}
            />
        </>
    );
}

const styles = {
    panel: {
        // position: "fixed",
        // right: 20,
        // top: 20,
        // width: 120,
        padding: 20,
        background: "#1f2933",
        color: "white",
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    title: {
        margin: 0,
        textAlign: "center",
    },
    section: {
        fontSize: 15,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    button: {
        marginTop: 10,
        padding: "10px 14px",
        borderRadius: 8,
        border: "none",
        fontSize: 16,
        background: "#3498db",
        color: "white",
    },
    quitButton: {
        marginTop: 6,
        padding: "8px 12px",
        borderRadius: 8,
        border: "none",
        fontSize: 14,
        background: "#e74c3c",
        color: "white",
    },

    scoreList: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    scoreItem: {
        padding: "8px 10px",
        borderRadius: 8,
        background: "#1e2a38",
        // border: "1px solid #3b82f6",
        fontSize: 14,
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
        color: "#93c5fd",
    },

    activePlayer: {
        // border: "2px solid #60a5fa",
        background: "#243447",
    },
};
