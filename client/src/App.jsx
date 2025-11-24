// src/App.jsx
import { useEffect, useState } from 'react'
import Header from './components/Header'
import HomePage from './components/pages/HomePage'
import InstructionsPage from './components/pages/InstructionsPage'
import SectorPage from './components/pages/SectorPage'
import LevelPage from './components/pages/LevelPage'
import CongratsPage from './components/pages/CongratsPage'
import GraduatedPage from './components/pages/GraduatedPage'
import ElevatorPage from './components/pages/ElevatorPage'
import SoundControls from './components/ui/SoundControls'

// NEW: API
import { setToken } from './api/client'
import {
  anonLogin, startGame as apiStartGame, getGame, roll as apiRoll,
  answerQuiz as apiAnswerQuiz, chooseEvent as apiChooseEvent,
  buildBox as apiBuildBox, submitScore as apiSubmitScore, topScores
} from './api/endpoints'

export default function App(){
  const [screen, setScreen] = useState('home')
  const [animal, setAnimal] = useState(null)
  const [discipline, setDiscipline] = useState('')

  const [level, setLevel] = useState(0)
  const [gameId, setGameId] = useState(null)

  // server state
  const [playerPosition, setPlayerPosition] = useState(0)
  const [reputation, setReputation] = useState(50)
  const [knowledge, setKnowledge] = useState(0)
  const [coins, setCoins] = useState(100)
  const [turnCount, setTurnCount] = useState(0)
  const [skipNextTurn, setSkipNextTurn] = useState(false)
  const [diceResult, setDiceResult] = useState(null)
  const [boardSquares, setBoardSquares] = useState([])
  const [mentorMessage, setMentorMessage] = useState("Welcome to the Publishing House! I'm Prof. BiblioChameleon, your guide. 🦎")

  const [currentEvent, setCurrentEvent] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [isRolling, setIsRolling] = useState(false)

  const [leaderboard, setLeaderboard] = useState([])

  // 1) Anonymous login on first mount
  useEffect(() => {
    (async () => {
      try {
        const { token } = await anonLogin()
        setToken(token)
      } catch (e) {
        console.error("Auth failed", e)
      }
    })()
  }, [])

  // Theme per level (kept)
  useEffect(() => {
    if (screen === 'level') {
      const theme = level === 0 ? 'breezy' : level === 1 ? 'scary' : 'haunted'
      document.body.setAttribute('data-theme', theme)
    } else {
      document.body.setAttribute('data-theme', 'breezy')
    }
  }, [screen, level])

  // Helpers to sync server state → local state
  function applyState(s) {
    if (!s) return
    setPlayerPosition(s.position)
    setTurnCount(s.turn)
    setReputation(s.reputation)
    setKnowledge(s.knowledge)
    setCoins(s.coins)
    setSkipNextTurn(!!s.flags?.skipNext)
    if (s.board?.squares) setBoardSquares(s.board.squares)
  }

  // Start a level (calls backend)
  const startLevel = async (n) => {
    try {
      setLevel(n)
      const avatar = animal?.key || 'goose'
      const profession = discipline || 'general'
      const res = await apiStartGame({ level: n, avatar, profession })
      setGameId(res.gameId)
      applyState(res.state)
      setMentorMessage(
        n===0 ? "Level 0: warm up and learn the basics." :
        n===1 ? "Level 1: watch the money — check editorial boards & indexing." :
                "Level 2: integrity first — protect public trust."
      )
      setCurrentEvent(null); setCurrentQuiz(null)
      setScreen('level')
    } catch (e) {
      console.error("startLevel failed", e)
    }
  }

  // Full restart (UI side only)
  const restartAll = () => {
    setAnimal(null); setDiscipline('')
    setLevel(0); setGameId(null)
    setPlayerPosition(0); setTurnCount(0)
    setSkipNextTurn(false); setIsRolling(false); setDiceResult(null)
    setBoardSquares([])
    setMentorMessage("Welcome to the Publishing House! I'm Prof. BiblioChameleon, your guide. 🦎")
    setCurrentEvent(null); setCurrentQuiz(null)
    setScreen('home')
  }

  // ====== Gameplay (server-backed) ======
  const rollDice = async () => {
    if (isRolling || !gameId) return
    setIsRolling(true)
    try {
      const resp = await apiRoll(gameId) // server moves and returns state + pending
      setDiceResult(resp.dice) // {d1,d2,total}
      applyState(resp.state)

      // pending interaction from server?
      if (resp.pending?.type === 'quiz') {
        setCurrentQuiz(resp.pending.payload)
      } else if (resp.pending?.type === 'event') {
        setCurrentEvent(resp.pending.payload)
      } else {
        setCurrentQuiz(null); setCurrentEvent(null)
      }

      // macro-area messages are now ideally pushed by backend; keep a fallback:
      const pos = resp?.state?.position ?? 0
      if (pos === 2)  setMentorMessage("Macro-Area 1: Think-Check-Submit…")
      if (pos === 27) setMentorMessage("Macro-Area 2: Watch the money…")
      if (pos === 58) setMentorMessage("Macro-Area 3: Integrity first…")

      // finish check (if backend moved to 89 and triggers end client-side)
      if (pos === 89) {
        setScreen('congrats')
      }
    } catch (e) {
      console.error("roll failed", e)
    } finally {
      setIsRolling(false)
    }
  }

  const handleQuizAnswer = async (answerIndex) => {
    if (!gameId || !currentQuiz) return
    try {
      const selected = [answerIndex]
      const resp = await apiAnswerQuiz(gameId, currentQuiz.id, selected)
      applyState(resp.state)
      // mentor message via explanation
      if (typeof currentQuiz.explanation === 'string') {
        setMentorMessage((resp.correct ? "Correct! " : "Not quite. ") + currentQuiz.explanation)
      }
      setCurrentQuiz(null)
    } catch (e) {
      console.error("quiz answer failed", e)
    }
  }

  const handleEventChoice = async (choice) => {
    if (!gameId || !currentEvent) return
    try {
      const resp = await apiChooseEvent(gameId, currentEvent.id, choice.key || choice) // supports {key} or string
      applyState(resp.state)
      setMentorMessage("Choice applied.")
      setCurrentEvent(null)
    } catch (e) {
      console.error("event choice failed", e)
    }
  }

  const resetLevel = async () => {
    if (!gameId) return
    try {
      const res = await getGame(gameId) // or provide a /games/{id}/reset if you prefer server reset
      applyState(res.state)
      setCurrentEvent(null); setCurrentQuiz(null)
      setMentorMessage(
        level===0 ? "Level 0: warm up and learn the basics." :
        level===1 ? "Level 1: watch the money — check editorial boards & indexing." :
                    "Level 2: integrity first — protect public trust."
      )
    } catch (e) {
      console.error("reset failed", e)
    }
  }

  // scoring (client-side calc kept; you can also return final score from backend)
  const totalScore = reputation * 10 + knowledge * 5 + coins
  const badge = totalScore >= 2000 ? { badge:'🏆', level:'Gold',   color:'#FFD700' } :
                totalScore >= 1500 ? { badge:'🥈', level:'Silver', color:'#C0C0C0' } :
                                      { badge:'🥉', level:'Bronze', color:'#CD7F32' }

  // submit score before graduated screen, or inside CongratsPage → onGraduate
  async function onGraduate() {
    try {
      if (gameId) {
        await apiSubmitScore({
          gameId,
          character: animal?.key || 'goose',
          profession: discipline || 'general',
          score: totalScore,
          breakdown: { reputation, knowledge, coins },
          badge: badge.level
        })
        const lb = await topScores(20)
        setLeaderboard(lb.items || [])
      }
    } catch (e) {
      console.error("submit score failed", e)
    } finally {
      setScreen('graduated')
    }
  }

  // ===== RENDER (unchanged UI) =====
  return (
    <div className="game-container">
      <Header
        showTitle={screen !== 'home'}
        showExit={screen !== 'home'}
        onExit={restartAll}
        onHome={() => setScreen('home')}
      />

      {/* ... keep your existing pages ... */}

      {screen === 'sector' && (
        <SectorPage
          selectedAnimal={animal}
          setSelectedAnimal={setAnimal}
          selectedDiscipline={discipline}
          setSelectedDiscipline={setDiscipline}
          onStartLevel0={() => startLevel(0)}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'level' && (
        <LevelPage
          level={level}
          animal={animal}
          discipline={discipline}
          game={{
            playerPosition, turnCount, reputation, knowledge, coins, diceResult,
            boardSquares, mentorMessage, skipNextTurn, isRolling,
            currentEvent, currentQuiz
          }}
          actions={{
            rollDice,
            resetLevel,
            closeEvent: () => setCurrentEvent(null),
            closeQuiz: () => setCurrentQuiz(null),
            handleQuizAnswer,
            handleEventChoice
          }}
        />
      )}

      {screen === 'congrats' && (
        <CongratsPage
          level={level}
          onNext={() => setScreen('elevator')}
          onGraduate={onGraduate}
        />
      )}

      {screen === 'graduated' && (
        <GraduatedPage
          score={totalScore}
          badge={badge}
          reputation={reputation}
          knowledge={knowledge}
          coins={coins}
          leaderboard={leaderboard}   // pass in if your page shows it
          onRestart={restartAll}
        />
      )}
    </div>
  )
}
