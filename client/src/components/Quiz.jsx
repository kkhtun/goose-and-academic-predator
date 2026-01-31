import React, { useEffect, useState } from "react";
import { apiGet } from "../api";

// 0 -> A, 1 -> B, 2 -> C, 3 -> D
function indexToLetter(i) {
  return String.fromCharCode(65 + i);
}

export default function Quiz({ open, onClose, onError }) {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const [selected, setSelected] = useState(null); // "A" | "B" | "C" | "D"
  const [showResult, setShowResult] = useState(false);

  // Fetch 1 quiz when the modal opens
  useEffect(() => {
    if (!open) return;

    async function load() {
      try {
        setLoading(true);
        setQuiz(null);
        setSelected(null);
        setShowResult(false);

        const data = await apiGet("/game/random-quiz");
        setQuiz(data);
      } catch (e) {
        onError?.(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [open, onError]);

  if (!open) return null;

  // user clicks an option
  function choose(letter) {
    if (!quiz) return;
    if (showResult) return; // stop second click

    setSelected(letter);
    setShowResult(true);
  }

  const correct = quiz?.correctAnswer; // "A", "B", "C", "D"
  const isCorrect = showResult && selected === correct;

  return (
    <div style={styles.backdrop}>
      <div style={styles.box}>
        <div style={styles.topRow}>
          <h3 style={{ margin: 0 }}>Quiz</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            X
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && quiz && (
          <>
            <p style={styles.question}>{quiz.questionText}</p>

            <div style={{ display: "grid", gap: 8 }}>
              {quiz.options.map((opt, idx) => {
                const letter = indexToLetter(idx);
                const picked = selected === letter;

                return (
                  <button
                    key={letter}
                    onClick={() => choose(letter)}
                    disabled={showResult}
                    style={{
                      ...styles.optionBtn,
                      ...(picked ? styles.picked : null),
                    }}
                  >
                    <b style={{ width: 22, display: "inline-block" }}>
                      {letter}.
                    </b>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div style={styles.result}>
                <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
                  {isCorrect ? "Correct ✅" : "Wrong ❌"}
                </p>
                <p style={{ margin: "0 0 10px 0" }}>{quiz.explanation}</p>

                <button onClick={onClose} style={styles.continueBtn}>
                  Continue
                </button>
              </div>
            )}
          </>
        )}

        {!loading && !quiz && <p>No question received.</p>}
      </div>
    </div>
  );
}
