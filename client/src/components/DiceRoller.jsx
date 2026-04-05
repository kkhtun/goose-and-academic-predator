import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { apiPost } from "../api";
import { socket } from "../socket";
// import useLocalStorage from "../hooks/useLocalStorage";

export default function DiceRoller({
    singleDie = false,
    onResult,
    isYourTurn,
    gameState,
    setGameState,
}) {
    // const [gameState, setGameState] = useLocalStorage("GAME_STATE", {});
    const { playerUniqueId, gameInfo } = gameState;
    const { gameId } = gameInfo;

    const [rolling, setRolling] = useState(false);
    const [dice, setDice] = useState([1, 1]);
    const [showDice, setShowDice] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleRollStart = ({ playerUniqueId: rollingPlayerId }) => {
            console.log(
                "Roll start event received for player:",
                rollingPlayerId,
            );
            setRolling(true);
            setShowDice(true);
            setDice([
                Math.ceil(Math.random() * 6),
                Math.ceil(Math.random() * 6),
            ]);
        };

        const handleRollResult = (data) => {
            console.log("Roll result event received");
            const { roll } = data;
            const { die1, die2 } = roll;
            setDice([die1, die2]);

            setTimeout(() => setRolling(false), 500);
            setTimeout(() => {
                setShowDice(false);
                onResult(data);
            }, 1500);
        };

        socket.on("roll-start", handleRollStart);
        socket.on("roll-result", handleRollResult);

        return () => {
            socket.off("roll-start", handleRollStart);
            socket.off("roll-result", handleRollResult);
        };
    }, [onResult]); // dependency only on onResult function

    const rollDice = () => {
        if (rolling || !playerUniqueId) return;
        socket.emit("roll-start", { playerUniqueId });
    };

    const dynamicStyle = {
        background: !isYourTurn
            ? "#bdc3c7" // disabled grey
            : "#3498db",
    };

    return (
        <>
            <button
                onClick={rollDice}
                style={{ ...styles.button, ...dynamicStyle }}
                disabled={!isYourTurn}
            >
                🎲 Roll Dice
            </button>

            <AnimatePresence>
                {showDice && (
                    <motion.div
                        initial={{ y: -200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={styles.overlay}
                    >
                        <motion.div
                            animate={
                                rolling
                                    ? {
                                          x: singleDie
                                              ? [0, 0]
                                              : [-200, 200, -150, 150, 0],
                                          rotate: [0, 360, 720],
                                      }
                                    : {
                                          x: 0,
                                          rotate: 0,
                                      }
                            }
                            transition={
                                rolling
                                    ? {
                                          duration: 1,
                                          repeat: Infinity,
                                          ease: "linear",
                                      }
                                    : {
                                          duration: 0.3,
                                      }
                            }
                            style={styles.die}
                        >
                            {dice[0]}
                        </motion.div>

                        {!singleDie && (
                            <motion.div
                                animate={
                                    rolling
                                        ? {
                                              x: [200, -200, 150, -150, 0],
                                              rotate: [0, -360, -720],
                                          }
                                        : {
                                              x: 0,
                                              rotate: 0,
                                          }
                                }
                                transition={
                                    rolling
                                        ? {
                                              duration: 1,
                                              repeat: Infinity,
                                              ease: "linear",
                                          }
                                        : {
                                              duration: 0.3,
                                          }
                                }
                                style={styles.die}
                            >
                                {dice[1]}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

const styles = {
    button: {
        marginTop: 10,
        padding: "10px 14px",
        borderRadius: 8,
        border: "none",
        fontSize: 16,
        background: "#3498db",
        color: "white",
        cursor: "pointer",
    },
    overlay: {
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        pointerEvents: "none",
    },
    die: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: "#ffffff",
        color: "#111", // ensure contrast
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36,
        fontWeight: "bold",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        userSelect: "none",
    },
};
