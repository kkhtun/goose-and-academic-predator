import { useState } from "react";

const CallToActionButton = ({
    text,
    onClick,
    disabled = false,
    action = "main", // "main" | "quit"
}) => {
    const [hovered, setHovered] = useState(false);

    const styles = {
        main: {
            base: "#3B82F6",
            hover: "#2563EB",
            disabled: "#93C5FD",
            color: "#fff",
        },
        quit: {
            base: "#EF4444",
            hover: "#DC2626",
            disabled: "#FCA5A5",
            color: "#fff",
        },
    };

    const variant = styles[action] || styles.main;

    const background = disabled
        ? variant.disabled
        : hovered
          ? variant.hover
          : variant.base;

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                color: variant.color,
                background,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.7 : 1,
                transition: "background 0.15s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={() => !disabled && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {text}
        </button>
    );
};

export default CallToActionButton;
