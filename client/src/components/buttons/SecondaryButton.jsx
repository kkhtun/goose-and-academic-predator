import { useState } from "react";

const SecondaryButton = ({ text, onClick, disabled = false, style = {} }) => {
    const [hovered, setHovered] = useState(false);

    const baseColor = "#FEBE10";
    const hoverColor = "#e6a90e";
    const disabledColor = "#f5d98b";

    const background = disabled
        ? disabledColor
        : hovered
          ? hoverColor
          : baseColor;

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            style={{
                ...style,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                color: "#222",
                background,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.7 : 1,
                transition: "background 0.15s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={() => !disabled && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {text}
        </button>
    );
};

export default SecondaryButton;
