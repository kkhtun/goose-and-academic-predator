import { POSITION_INSTRUCTIONS } from "../../constants";
import CancelButton from "../buttons/CancelButton";
import { BoxIcon } from "../icons/BoxIcon";

export default function InstructionPopup({ open, onClose }) {
    if (!open) return null;

    const handleClose = () => {
        onClose(true);
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
                zIndex: 2001,
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
                        Instructions
                    </div>

                    {/* 👇 Added instructions here */}
                    <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
                        <li>
                            Learn how to avoid predatory journals and discover
                            best practices for ethical research.
                        </li>
                        <li>
                            Click on <b>🎲 Roll</b> button to move your piece.
                        </li>
                        <li>Each position has an associated quiz or event.</li>
                        <li>
                            Hover over the square to discover more about its
                            type.
                        </li>
                        <li>Earn points by answering the quizzes correctly.</li>
                        <li>
                            Before starting, share your <b>Game ID</b> so
                            friends can join and play with you.
                        </li>
                        <li>
                            ⚠️ Once the game begins, no new players can join.
                        </li>
                        <li>
                            Land on the <b>square 90</b> to win the game! 🎉
                        </li>
                    </ul>

                    <div
                        style={{
                            fontWeight: 700,
                            marginBottom: 20,
                            fontSize: 18,
                        }}
                    >
                        Position Guide
                    </div>

                    {/* 👇 Added instructions here */}
                    <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
                        <li>
                            <BoxIcon number={0} type={""} onSquare={false} />
                            <span style={{ marginLeft: 8 }}>
                                This is the start square.
                            </span>
                        </li>
                        {Object.keys(POSITION_INSTRUCTIONS).map((type) => (
                            <li>
                                <BoxIcon
                                    number={22} // arbitrary
                                    type={type}
                                    onSquare={false}
                                />
                                <span style={{ marginLeft: 8 }}>
                                    {POSITION_INSTRUCTIONS[type]}
                                </span>
                            </li>
                        ))}
                        <li>
                            <BoxIcon number={90} type={""} onSquare={false} />
                            <span style={{ marginLeft: 8 }}>
                                Land on this square to win the game! 🎉
                            </span>
                        </li>
                    </ul>
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
