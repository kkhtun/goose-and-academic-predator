import { useState } from "react";

export default function ShortAnswerPopup({
  open,
  onClose,
  payload = {},
  onSubmit,
}) {
  const [input, setInput] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit(input);
  };

  const handleClose = () => {
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
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
          width: 420,
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: 12,
          padding: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div>
          <div style={{ fontWeight: 700 }}>{payload.title || "Info"}</div>
          <div style={{ marginTop: 8 }}>{payload.text}</div>
          <input
            type="text"
            placeholder="Enter your answer"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus={true}
            style={{
              width: "100%",
              padding: "8px 12px",
              marginTop: 12,
              border: "1px solid #ddd",
              borderRadius: 6,
              fontSize: 14,
              boxSizing: "border-box",
            }}
            value={input}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 14,
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <button
            onClick={handleClose}
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
