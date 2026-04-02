import { useLocalStorage } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { apiPost } from "../api";

export default function DiceRoller({ singleDie = false, onResult }) {
    const [gameId, setGameId] = useLocalStorage("GAME_ID", null);
    const [playerUniqueId, setPlayerUniqueId] = useLocalStorage(
        "PLAYER_UNIQUE_ID",
        null,
    );
    const [rolling, setRolling] = useState(false);
    const [dice, setDice] = useState([1, 1]);
    const [showDice, setShowDice] = useState(false);

    const rollDice = () => {
        if (rolling) return;

        setRolling(true);
        setShowDice(true);

        // show random tumbling first
        if (singleDie) {
            setDice([Math.ceil(Math.random() * 6)]);
        } else {
            setDice([
                Math.ceil(Math.random() * 6),
                Math.ceil(Math.random() * 6),
            ]);
        }

        apiPost(`/game/${gameId}/roll`, { playerUniqueId }).then((data) => {
            const { roll } = data;
            const { die1, die2 } = roll;

            // stop tumbling, show final value
            if (singleDie) {
                setDice([die1]);
            } else {
                setDice([die1, die2]);
            }

            setRolling(false); // stops animation

            // These timeouts set a slight delay for nicer dice settling effect
            // small delay just for nicer "settle" effect (optional)
            // keep dice visible for 1 second
            setTimeout(() => {
                setShowDice(false);
                onResult(data);
            }, 1000);
        });
    };

    return (
        <>
            <button onClick={rollDice} style={styles.button}>
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
