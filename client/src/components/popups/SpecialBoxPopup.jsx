import { useState } from "react";
import CancelButton from "../buttons/CancelButton";

export default function SpecialBoxPopup({ open, onClose, payload = {} }) {
    if (!open) return null;

    const { title, text } = payload || {};

    const handleClose = () => {
        onClose();
    };

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
                zIndex: 2000,
                background: "rgba(0,0,0,0.4)",
                padding: 20,
            }}
            onClick={handleClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "60%",
                    background: "#ffffff",
                    borderRadius: 8,
                    padding: 30,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                }}
            >
                <div>
                    <div
                        style={{
                            fontWeight: 700,
                            marginBottom: 20,
                            fontSize: 18,
                        }}
                    >
                        {title || "Info"}
                    </div>
                    <div style={{ fontSize: 16 }}>{text}</div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 14,
                    }}
                >
                    <CancelButton text={"Close"} onClick={handleClose} />
                </div>
            </div>
        </div>
    );
}
