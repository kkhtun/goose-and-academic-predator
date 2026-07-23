import React from "react";
import CancelButton from "../buttons/CancelButton";

export default function LevelIntroPopup({ open, onClose, level, message }) {
    if (!open) return null;

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
                zIndex: 2500,
                background: "rgba(0, 0, 0, 0.5)",
                padding: 20,
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "550px",
                    maxWidth: "92%",
                    background: "#FFFFFF",
                    border: "2px solid #93C5FD",
                    borderRadius: 16,
                    padding: 30,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    textAlign: "center",
                    color: "#23405A",
                }}
            >
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎓</div>
                <h2
                    style={{
                        color: "#23405A",
                        marginTop: 0,
                        marginBottom: 15,
                        fontSize: 22,
                        fontWeight: 700,
                    }}
                >
                    Level {level} Introduction
                </h2>
                <div
                    style={{
                        fontSize: 16,
                        lineHeight: 1.6,
                        color: "#64748B",
                        marginBottom: 25,
                        background: "#EFF6FF",
                        padding: 16,
                        borderRadius: 12,
                        borderLeft: "4px solid #3B82F6",
                    }}
                >
                    {message}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <CancelButton text="Continue" onClick={onClose} />
                </div>
            </div>
        </div>
    );
}
