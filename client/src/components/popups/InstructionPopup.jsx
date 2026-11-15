import {
    SCORE_FOR_HEAVEN,
    POSITION_INSTRUCTIONS,
    REALM_COLOR,
    REALM_TYPE,
    WORDING,
} from "../../constants";
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
                    // background: "#ffffff",
                    background: "rgba(44, 62, 80, 1)",
                    color: "white",
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

                    <div>
                        Welcome to the Goose and Academic Predator game! Test
                        your ability to identify predatory journals and uphold
                        research integrity. You will play on 3 levels:{" "}
                        <span
                            style={{
                                color: "#ffffff",
                                textShadow: "0 2px 3px rgba(0, 0, 0, 0.5)",
                                fontWeight: 500,
                            }}
                        >
                            white
                        </span>{" "}
                        (easy),{" "}
                        <span
                            style={{
                                color: "rgb(161, 93, 190)",
                                textShadow: "0 2px 3px rgba(0, 0, 0, 0.5)",
                                fontWeight: 500,
                            }}
                        >
                            purple
                        </span>{" "}
                        (medium), and{" "}
                        <span
                            style={{
                                color: "rgb(86, 164, 216)",
                                textShadow: "0 2px 3px rgba(0, 0, 0, 0.5)",
                                fontWeight: 500,
                            }}
                        >
                            blue
                        </span>{" "}
                        (hard). At the end of the journey, your score will
                        reveal your destiny. Will you reach{" "}
                        <span
                            style={{
                                color: REALM_COLOR[REALM_TYPE.HEAVEN],
                                textShadow: "0 2px 3px rgba(0, 0, 0, 0.5)",
                                fontWeight: 500,
                            }}
                        >
                            Publishing {WORDING.HEAVEN}
                        </span>{" "}
                        with a flawless record, or find yourself in{" "}
                        <span
                            style={{
                                color: REALM_COLOR[REALM_TYPE.HELL],
                                textShadow: "0 2px 3px rgba(0, 0, 0, 0.5)",
                                fontWeight: 500,
                            }}
                        >
                            Publishing {WORDING.HELL}
                        </span>{" "}
                        needing more practice to avoid the industry's most
                        dangerous traps?
                    </div>

                    {/* 👇 Added instructions here */}
                    <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
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
                            With each level, you earn more points for answering
                            correctly.
                        </li>
                        <li>
                            Earn more than {SCORE_FOR_HEAVEN} points to reach
                            the publishing heaven.
                        </li>
                        <li>
                            Before starting, share your <b>Game ID</b> so
                            friends can join and play with you.
                        </li>
                        <li>
                            ⚠️ Once the game begins, no new players can join.
                        </li>
                        <li>
                            Land on the square <b>90</b> to finish the game! 🎉
                        </li>
                    </ul>

                    <div
                        style={{
                            fontWeight: 700,
                            marginBottom: 20,
                            fontSize: 18,
                        }}
                    >
                        Icons Meaning
                    </div>

                    {/* 👇 Added instructions here */}
                    <ul style={{ paddingLeft: 20, lineHeight: 1.6 }}>
                        <li>
                            <BoxIcon
                                number={0}
                                type={""}
                                onSquare={false}
                                style={{
                                    background: "white",
                                    borderRadius: 4,
                                    padding: 2,
                                }}
                            />
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
                                    style={{
                                        background: "white",
                                        borderRadius: 4,
                                        padding: 2,
                                    }}
                                />
                                <span style={{ marginLeft: 8 }}>
                                    {POSITION_INSTRUCTIONS[type]}
                                </span>
                            </li>
                        ))}
                        <li>
                            <BoxIcon
                                number={90}
                                type={""}
                                onSquare={false}
                                style={{
                                    background: "white",
                                    borderRadius: 4,
                                    padding: 2,
                                }}
                            />
                            <span style={{ marginLeft: 8 }}>
                                Land on this square to finish the game! 🎉
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
