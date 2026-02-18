import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DiceRoller({ onResult }) {
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState([1, 1]);

  const rollDice = () => {
    if (rolling) return;

    setRolling(true);

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;

    // show random tumbling first
    setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);

    // IMPORTANT : Instead of timeouts here, in reality, will call /roll endpoint in backend

    setTimeout(() => {
      setDice([d1, d2]);
      onResult(d1 + d2);
    }, 900);

    setTimeout(() => {
      setRolling(false);
    }, 1400);
  };

  return (
    <>
      <button onClick={rollDice} style={styles.button}>
        🎲 Roll Dice
      </button>

      <AnimatePresence>
        {rolling && (
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
          >
            <motion.div
              animate={{
                x: [-200, 200, -150, 150, 0],
                rotate: [0, 360, 720],
              }}
              transition={{ duration: 1 }}
              style={styles.die}
            >
              {dice[0]}
            </motion.div>

            <motion.div
              animate={{
                x: [200, -200, 150, -150, 0],
                rotate: [0, -360, -720],
              }}
              transition={{ duration: 1 }}
              style={styles.die}
            >
              {dice[1]}
            </motion.div>
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
