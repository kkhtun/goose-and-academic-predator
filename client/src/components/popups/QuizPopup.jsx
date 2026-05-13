import React, { useEffect, useState } from "react";
import { QUIZ_TYPE } from "../../constants";
import CrosswordBuilder from "./CrosswordBuilder";
import { socket } from "../../socket";
import CancelButton from "../buttons/CancelButton";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import KnowledgeChunkCard from "../cards/KnowledgeChunkCard";

function TrueFalseQuiz({ content, handleSubmit, hasAnswered }) {
    const { statement } = content;

    return (
        <>
            <div style={{ fontWeight: 700, marginBottom: 20, fontSize: 18 }}>
                {statement}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center", // center buttons horizontally
                    gap: 12, // space between True and False
                }}
            >
                <PrimaryButton
                    text={"True"}
                    onClick={() => handleSubmit(true)}
                    disabled={hasAnswered}
                />
                <SecondaryButton
                    text={"False"}
                    onClick={() => handleSubmit(false)}
                    disabled={hasAnswered}
                />
            </div>
        </>
    );
}

function MCQQuiz({ content, handleSubmit, hasAnswered }) {
    const { questionText, options } = content;

    return (
        <>
            <div
                style={{
                    fontWeight: 700,
                    marginBottom: 20,
                    fontSize: 18,
                }}
            >
                {questionText}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
                {options.map((opt, i) => (
                    <PrimaryButton
                        key={i}
                        text={
                            <div style={{ display: "flex" }}>
                                <span style={{ fontWeight: 700 }}>
                                    {String.fromCharCode(65 + i)}.&nbsp;
                                </span>
                                {opt}
                            </div>
                        }
                        onClick={() =>
                            handleSubmit(String.fromCharCode(65 + i))
                        }
                        disabled={hasAnswered}
                    />
                ))}
            </div>
        </>
    );
}

export default function QuizPopup({
    open,
    onClose,
    payload = {},
    gameState,
    setGameState,
}) {
    if (!open) return null;

    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const { gameInfo, playerUniqueId } = gameState;
    const { gameId } = gameInfo;

    const { type, content, _id: quizId, chunks } = payload;

    const handleClose = () => {
        setHasAnswered(false);
        setIsCorrect(false);
        setShowDetails(false);
        onClose();
    };

    useEffect(() => {
        const handleAnswerComplete = (data) => {
            console.log("Answer complete event received");
            const { isCorrect, gameInfo: updatedGameInfo } = data;
            setHasAnswered(true);
            setIsCorrect(isCorrect);
            console.log("GameInfo ", updatedGameInfo);
            setGameState({ playerUniqueId, gameInfo: updatedGameInfo });
        };

        socket.on("answer-complete", handleAnswerComplete);

        return () => {
            socket.off("answer-complete", handleAnswerComplete);
        };
    }, []);

    const onSubmit = (opt) => {
        socket.emit("check-answer", {
            playerUniqueId,
            quizId,
            answer: opt,
        });
    };

    return (
        // This code looks spaghetti at the moment but crosswords will handle its own dialog
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
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: type === QUIZ_TYPE.CROSS_WORDS ? "80%" : "60%",
                    background: "#ffffff",
                    borderRadius: 8,
                    padding: 30,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                }}
            >
                <div style={{ display: "grid", gap: 12 }}>
                    {type === QUIZ_TYPE.MCQ && (
                        <MCQQuiz
                            content={content}
                            handleSubmit={onSubmit}
                            hasAnswered={hasAnswered}
                        />
                    )}
                    {type === QUIZ_TYPE.TRUE_FALSE && (
                        <TrueFalseQuiz
                            content={content}
                            handleSubmit={onSubmit}
                            hasAnswered={hasAnswered}
                        />
                    )}
                    {type === QUIZ_TYPE.CROSS_WORDS && (
                        <CrosswordBuilder
                            content={content}
                            handleSubmit={onSubmit}
                            hasAnswered={hasAnswered}
                            isCorrect={isCorrect}
                        />
                    )}

                    {type !== QUIZ_TYPE.CROSS_WORDS && hasAnswered && (
                        <div
                            style={{
                                marginTop: 12,
                                padding: 12,
                                borderRadius: 8,
                                background: isCorrect ? "#f0f9ff" : "#fef2f2",
                                border: `1px solid ${isCorrect ? "#0ea5e9" : "#f87171"}`,
                            }}
                        >
                            <div
                                style={{
                                    color: isCorrect ? "#0369a1" : "#dc2626",
                                    fontWeight: 600,
                                    marginBottom: 6,
                                }}
                            >
                                {isCorrect
                                    ? "✓ Your answer is correct!"
                                    : "✗ Your answer is incorrect."}
                            </div>
                            {content.explanation && (
                                <div
                                    style={{
                                        color: isCorrect
                                            ? "#0369a1"
                                            : "#dc2626",
                                        fontSize: 14,
                                    }}
                                >
                                    {content.explanation}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 14,
                    }}
                >
                    <CancelButton
                        text={"Close"}
                        onClick={handleClose}
                        disabled={!hasAnswered}
                    />
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
                        <span>More information</span>
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
                            {/* <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Integer nec odio. Praesent
                                libero. Sed cursus ante dapibus diam. Sed nisi.
                                Nulla quis sem at nibh elementum imperdiet.
                            </p>

                            <p>
                                Duis sagittis ipsum. Praesent mauris. Fusce nec
                                tellus sed augue semper porta. Mauris massa.
                                Vestibulum lacinia arcu eget nulla. Class aptent
                                taciti sociosqu ad litora torquent per conubia
                                nostra.
                            </p> */}
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
