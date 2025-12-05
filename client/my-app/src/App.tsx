import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Sector from "./components/Sector";
import Level from "./components/Level";
import Congrats from "./components/Congrats";
import Instructions from "./components/Instructions";

const API = ""; // backend base URL if needed

// ---- Types ----
type Screen = "home" | "instructions" | "sector" | "level" | "congrats" | "graduated";

interface Animal {
  id: string;
  emoji: string;
  name: string;
  skill: string;
}

interface Stats {
  reputation: number;
  knowledge: number;
  coins: number;
  skipNextTurn?: boolean;
}

interface BoardSquare {
  id: number;
  type: string;
  label: string;
  visited?: boolean;
}

interface DiceResult {
  d1: number;
  d2: number;
  total: number;
}

interface Quiz {
  id: string | number;
  question: string;
  options: string[];
}

interface FinalBadge {
  emoji?: string;
  name?: string;
}

interface FinalResult {
  badge?: FinalBadge;
  totalScore?: number;
  stats?: Stats;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [disciplines, setDisciplines] = useState<string[]>([]);

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [discipline, setDiscipline] = useState<string>("");

  const [gameId, setGameId] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(0);

  const [board, setBoard] = useState<BoardSquare[]>([]);
  const [mentor, setMentor] = useState<string>("");
  const [stats, setStats] = useState<Stats>({
    reputation: 50,
    knowledge: 0,
    coins: 100,
    skipNextTurn: false,
  });

  const [position, setPosition] = useState<number>(0);
  const [turn, setTurn] = useState<number>(0);

  const [dice, setDice] = useState<DiceResult | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  /* -------------------------------------------------------
     1) LOAD META (ANIMALS + DISCIPLINES)
  -------------------------------------------------------- */
  useEffect(() => {
    fetch(API + "/meta/game")
      .then((r) => r.json())
      .then(
        (data: { animals?: Animal[]; disciplines?: string[] }) => {
          setAnimals(data.animals || []);
          setDisciplines(data.disciplines || []);
        }
      )
      .catch((err) => {
        console.error("Error loading meta:", err);
      });
  }, []);

  /* -------------------------------------------------------
     2) START GAME (POST /games)
  -------------------------------------------------------- */
  const startGame = async () => {
    if (!animal || !discipline) return; // guard for TS + logic

    const res = await fetch(API + "/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        avatarId: animal.id,
        discipline,
        level: 0,
      }),
    });

    const game: {
      id: string;
      level: number;
      mentorMessage: string;
      stats: Stats;
    } = await res.json();

    setGameId(game.id);
    setLevel(game.level);
    setMentor(game.mentorMessage);
    setStats(game.stats);

    await loadBoard(game.id);
    setScreen("level");
  };

  /* -------------------------------------------------------
     3) LOAD BOARD (GET /games/:id/board)
  -------------------------------------------------------- */
  const loadBoard = async (id: string) => {
    const data: {
      squares: BoardSquare[];
      playerPosition: number;
      turnCount: number;
      stats: Stats;
      mentorMessage: string;
    } = await fetch(API + `/games/${id}/board`).then((r) => r.json());

    setBoard(data.squares || []);
    setPosition(data.playerPosition ?? 0);
    setTurn(data.turnCount ?? 0);
    if (data.stats) {
      setStats((prev) => ({ ...prev, ...data.stats }));
    }
    if (data.mentorMessage) {
      setMentor(data.mentorMessage);
    }
  };

  /* -------------------------------------------------------
     4) ROLL DICE (POST /games/:id/roll)
  -------------------------------------------------------- */
  const rollDice = async () => {
    if (!gameId) return;

    const res = await fetch(API + `/games/${gameId}/roll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    const out: {
      d1: number;
      d2: number;
      total: number;
      position: number;
      turnCount: number;
      stats: Stats;
      board?: { squares: BoardSquare[] };
      mentorMessage?: string;
      quizId?: string | number;
      levelCompleted?: boolean;
    } = await res.json();

    setDice({ d1: out.d1, d2: out.d2, total: out.total });
    setPosition(out.position ?? 0);
    setTurn(out.turnCount ?? 0);
    if (out.stats) {
      setStats((prev) => ({ ...prev, ...out.stats }));
    }
    if (out.board?.squares) {
      setBoard(out.board.squares);
    }
    if (out.mentorMessage) {
      setMentor(out.mentorMessage);
    }

    // If server triggers quiz
    if (out.quizId) {
      const q: Quiz = await fetch(
        API + `/games/${gameId}/quiz/${out.quizId}`
      ).then((r) => r.json());
      setQuiz(q);
    }

    if (out.levelCompleted) {
      await fetch(API + `/games/${gameId}/complete-level`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      setScreen("congrats");
    }
  };

  /* -------------------------------------------------------
     5) QUIZ ANSWER
  -------------------------------------------------------- */
  const submitQuizAnswer = async (answerIndex: number) => {
    if (!gameId || !quiz) return;

    const res = await fetch(
      API + `/games/${gameId}/quiz/${quiz.id}/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerIndex }),
      }
    );

    const out: { stats: Stats; explanation: string } = await res.json();
    if (out.stats) {
      setStats((prev) => ({ ...prev, ...out.stats }));
    }
    if (out.explanation) {
      setMentor(out.explanation);
    }
    setQuiz(null);
  };

  /* -------------------------------------------------------
     6) NEXT LEVEL
  -------------------------------------------------------- */
  const goNextLevel = async () => {
    if (!gameId) return;

    const res = await fetch(API + `/games/${gameId}/start-next-level`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    const out: { level: number } = await res.json();
    setLevel(out.level);
    await loadBoard(gameId);
    setScreen("level");
  };

  /* -------------------------------------------------------
     7) FINISH GAME
  -------------------------------------------------------- */
  const finishGame = async () => {
    if (!gameId) return;

    const res = await fetch(API + `/games/${gameId}/finish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    const out: FinalResult = await res.json();
    setFinalResult(out);
    setScreen("graduated");
  };

  /* -------------------------------------------------------
     8) EXIT
  -------------------------------------------------------- */
  const exitGame = () => {
    setScreen("home");
    setGameId(null);
    setAnimal(null);
    setDiscipline("");
    setLevel(0);
    setStats({
      reputation: 50,
      knowledge: 0,
      coins: 100,
      skipNextTurn: false,
    });
    setBoard([]);
    setPosition(0);
    setTurn(0);
    setDice(null);
    setQuiz(null);
    setFinalResult(null);
    setMentor("");
  };

  /* -------------------------------------------------------
     SCREEN ROUTING
  -------------------------------------------------------- */
  return (
    <>
      {screen === "home" && (
        <Home
          onStart={() => setScreen("sector")}
          onInstructions={() => setScreen("instructions")}
        />
      )}

      {screen === "instructions" && (
        <Instructions onBack={() => setScreen("home")} />
      )}

      {screen === "sector" && (
        <Sector
          animals={animals}
          disciplines={disciplines}
          selectedAnimal={animal}
          setSelectedAnimal={setAnimal}
          selectedDiscipline={discipline}
          setSelectedDiscipline={setDiscipline}
          onStart={startGame}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "level" && (
        <Level
          level={level}
          board={board}
          stats={stats}
          mentor={mentor}
          position={position}
          turn={turn}
          dice={dice}
          quiz={quiz}
          onRoll={rollDice}
          onQuizAnswer={submitQuizAnswer}
          onExit={exitGame}
        />
      )}

      {screen === "congrats" && (
        <Congrats level={level} onNext={goNextLevel} onFinish={finishGame} />
      )}

      {screen === "graduated" && (
        <div style={{ padding: 30, textAlign: "center" }}>
          <h1>🎓 You Finished the Game!</h1>
          <h2>
            {finalResult?.badge?.emoji} {finalResult?.badge?.name}
          </h2>
          <p>Total Score: {finalResult?.totalScore}</p>
          <button onClick={exitGame}>Play Again</button>
        </div>
      )}
    </>
  );
}
