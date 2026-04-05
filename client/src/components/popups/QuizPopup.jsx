import React, { useEffect, useState } from "react";
import { apiPost } from "../../api";
import { QUIZ_TYPE } from "../../constants";
import CrosswordBuilder from "./CrosswordBuilder";
import { socket } from "../../socket";

function TrueFalseQuiz({ content, handleSubmit, hasAnswered }) {
    const { statement } = content;
    const options = ["True", "False"];

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
                {options.map((opt) => {
                    // Set color scheme for True vs False
                    const isTrue = opt === "True";
                    const bgColor = isTrue ? "#d1fae5" : "#fee2e2"; // greenish for True, reddish for False
                    const textColor = isTrue ? "#065f46" : "#b91c1c";

                    return (
                        <button
                            key={opt}
                            onClick={() => handleSubmit(isTrue)}
                            disabled={hasAnswered}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 6,
                                border: "1px solid #ddd",
                                background: bgColor,
                                color: textColor,
                                cursor: "pointer",
                                fontSize: 18,
                                fontWeight: 600,
                                flex: 1,
                                maxWidth: 120,
                            }}
                        >
                            {opt}
                        </button>
                    );
                })}
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
                    <button
                        key={i}
                        onClick={() =>
                            handleSubmit(String.fromCharCode(65 + i))
                        }
                        disabled={hasAnswered}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 6,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: 16,
                            textAlign: "left",
                        }}
                    >
                        <span style={{ fontWeight: 700 }}>
                            {String.fromCharCode(65 + i)}.&nbsp;
                        </span>
                        {opt}
                    </button>
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

    const { gameInfo, playerUniqueId } = gameState;
    const { gameId } = gameInfo;

    const { type, content, _id: quizId } = payload;

    const handleClose = () => {
        setHasAnswered(false);
        setIsCorrect(false);
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
                    maxWidth: "60%",
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
                        />
                    )}

                    {hasAnswered && (
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
                    <button
                        onClick={handleClose}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                            background: "#f5f5f5",
                            cursor: "pointer",
                        }}
                        disabled={!hasAnswered}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
