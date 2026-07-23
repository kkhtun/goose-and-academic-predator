import React from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

export default function FakeEmailChallenge({ content, handleSubmit, hasAnswered }) {
    const {
        subject = "Urgent: Article Invitation for Rapid Publication",
        sender = "editor@academic-scam-journal.org",
        recipient = "Dear Esteemed Scholar",
        body = "We read your recent paper with great interest. We invite you to submit your manuscript to our journal. Fast publication guaranteed within 24 hours upon payment of low processing fee.",
    } = content || {};

    return (
        <div style={{ width: "100%", textAlign: "left" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    borderBottom: "2px solid #e2e8f0",
                    paddingBottom: 10,
                }}
            >
                <span style={{ fontSize: 24 }}>✉️</span>
                <div>
                    <h3 style={{ margin: 0, color: "#1a202c", fontSize: 18 }}>
                        Interactive Challenge: Email Inspection
                    </h3>
                    <p style={{ margin: 0, color: "#718096", fontSize: 13 }}>
                        Examine the received email below and evaluate its legitimacy.
                    </p>
                </div>
            </div>

            {/* Email Box UI */}
            <div
                style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: 10,
                    padding: 18,
                    marginBottom: 20,
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                }}
            >
                <div style={{ marginBottom: 8, fontSize: 14 }}>
                    <strong style={{ color: "#475569" }}>From:</strong>{" "}
                    <span style={{ color: "#0284c7", fontFamily: "monospace", fontWeight: 600 }}>
                        {sender}
                    </span>
                </div>
                <div style={{ marginBottom: 12, fontSize: 14 }}>
                    <strong style={{ color: "#475569" }}>Subject:</strong>{" "}
                    <span style={{ color: "#0f172a", fontWeight: 600 }}>{subject}</span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "10px 0" }} />
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "#334155" }}>
                    <p style={{ marginTop: 0 }}>{recipient},</p>
                    <p style={{ whiteSpace: "pre-line" }}>{body}</p>
                </div>
            </div>

            <div style={{ marginBottom: 14, fontWeight: 600, color: "#1e293b", textAlign: "center" }}>
                Is this email Predatory (Fake) or Legitimate?
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                }}
            >
                <PrimaryButton
                    text="🚩 Predatory (Fake Email)"
                    onClick={() => handleSubmit(true)}
                    disabled={hasAnswered}
                />
                <SecondaryButton
                    text="🛡️ Legitimate Email"
                    onClick={() => handleSubmit(false)}
                    disabled={hasAnswered}
                />
            </div>
        </div>
    );
}
