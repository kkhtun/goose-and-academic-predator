import { useState } from "react";
import CancelButton from "../buttons/CancelButton";
import KnowledgeChunkCard from "../cards/KnowledgeChunkCard";

export default function InfoPopup({ open, onClose, payload = {} }) {
    if (!open) return null;
    const [showDetails, setShowDetails] = useState(false);

    const { title, info } = payload || {};
    const { content, chunks } = info || {};

    const handleClose = () => {
        setShowDetails(false);
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
                    <div style={{ fontSize: 16 }}>{content}</div>
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
                {/* Hidden dropdown section */}
                <div style={{ marginTop: 18 }}>
                    <button
                        type="button"
                        onClick={() => setShowDetails((prev) => !prev)}
                        aria-expanded={showDetails}
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #d1d5db",
                            background: "#f9fafb",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        <span>Source Knowledge Item</span>
                        <span>{showDetails ? "▲" : "▼"}</span>
                    </button>

                    {showDetails && (
                        <div
                            style={{
                                maxHeight: 200,
                                overflowY: "auto",
                                marginTop: 8,
                                padding: 12,
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                                background: "#ffffff",
                                color: "#374151",
                                fontSize: 14,
                                lineHeight: 1.5,
                            }}
                        >
                            {chunks.map((chunk) => (
                                <KnowledgeChunkCard
                                    key={chunk._id}
                                    chunk={chunk}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
