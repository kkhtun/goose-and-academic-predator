import React from "react";

export default function Popup({
  open,
  onClose,
  type = "info",
  payload = {},
  onAnswer,
}) {
  if (!open) return null;

  const renderContent = () => {
    if (type === "quiz") {
      const { question, options } = payload;
      return (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>{question}</div>
          <div style={{ display: "grid", gap: 8 }}>
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onAnswer && onAnswer(opt)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (type === "info") {
      return "This is some information presented to the player!!!";
    }

    // default info
    return (
      <div>
        <div style={{ fontWeight: 700 }}>{payload.title || "Info"}</div>
        <div style={{ marginTop: 8 }}>{payload.text}</div>
      </div>
    );
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
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: 12,
          padding: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {renderContent()}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 14,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
