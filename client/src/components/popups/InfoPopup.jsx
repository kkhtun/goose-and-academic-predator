export default function InfoPopup({ open, onClose, payload = {} }) {
  if (!open) return null;

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
          width: 420,
          maxWidth: "100%",
          background: "#ffffff",
          borderRadius: 12,
          padding: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 18 }}>
            {payload.title || "Info"}
          </div>
          <div style={{ fontSize: 16 }}>{payload.text}</div>
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
