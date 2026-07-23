import { useState } from "react";

const PrimaryButton = ({ text, onClick, disabled = false }) => {
    const [hovered, setHovered] = useState(false);

    const baseColor = "#3B82F6";
    const hoverColor = "#2563EB";
    const disabledColor = "#93C5FD";

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
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
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

export default PrimaryButton;
