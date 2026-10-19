import { motion, AnimatePresence } from "framer-motion";
import { REALM_LABEL, REALM_TYPE } from "../constants";

export default function TransitionOverlay({ type }) {
    if (!type) return null;

    let bg = "#2c3e50";
    let text = "";
    let subtext = "";
    let icon = "";

    if (type === "ELEVATOR") {
        bg = "#2980b9";
        text = "Publishing House Elevator";
        subtext = "Going up to Level 1...";
        icon = "🏢";
    } else if (type === REALM_TYPE.HEAVEN) {
        bg = "#00a8ff";
        text = REALM_LABEL[REALM_TYPE.HEAVEN];
        subtext = "Congratulations! You earned your spot on the Savelist!";
        icon = "👼";
    } else if (type === REALM_TYPE.HELL) {
        bg = "#c23616";
        text = REALM_LABEL[REALM_TYPE.HELL];
        subtext = "Keep learning to move from the Watchlist to the Savelist!";
        icon = "🔥";
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    ...styles.overlay,
                    backgroundColor: bg,
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                    }}
                    style={styles.content}
                >
                    <div style={styles.icon}>{icon}</div>
                    <h1 style={styles.title}>{text}</h1>
                    <p style={styles.subtext}>{subtext}</p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
    },
    content: {
        textAlign: "center",
    },
    icon: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 48,
        margin: 0,
        marginBottom: 10,
        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    },
    subtext: {
        fontSize: 24,
        margin: 0,
        opacity: 0.9,
    },
};
