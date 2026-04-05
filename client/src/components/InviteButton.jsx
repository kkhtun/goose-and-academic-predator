import { useState } from "react";

const InviteButton = ({ gameId }) => {
    const [copied, setCopied] = useState(false);

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
        <button
            onClick={handleCopy}
            style={{
                marginTop: 20,
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                background: copied ? "#27ae60" : "#ece934", // green when copied
                color: copied ? "white" : "gray",
                cursor: "pointer",
                transition: "background 0.2s ease",
            }}
        >
            {copied ? "✅ Copied" : "📋 Game ID"}
        </button>
    );
};

export default InviteButton;
