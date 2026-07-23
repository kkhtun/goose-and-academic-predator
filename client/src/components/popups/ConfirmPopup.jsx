import CallToActionButton from "../buttons/CallToActionButton";
import CancelButton from "../buttons/CancelButton";

export default function ConfirmPopup({
    open,
    onConfirm,
    onCancel,
    message,
    style,
}) {
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
                zIndex: 2000,
                background: "rgba(0,0,0,0.4)",
                padding: 20,
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "420px",
                    maxWidth: "90%",
                    background: "#FFFFFF",
                    border: "2px solid #93C5FD",
                    borderRadius: 16,
                    padding: 30,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    color: "#23405A",
                }}
            >
                <div
                    style={{ fontWeight: 700, marginBottom: 20, fontSize: 18, color: "#23405A" }}
                >
                    {message}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 14,
                    }}
                >
                    <CallToActionButton
                        text={"Quit"}
                        action="quit"
                        onClick={onConfirm}
                    />
                    <CancelButton text={"Cancel"} onClick={onCancel} />
                </div>
            </div>
        </div>
    );
}
