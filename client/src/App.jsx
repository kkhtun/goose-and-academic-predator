import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartGame from './components/StartGame'
import GamePanel from './components/GamePanel'
import Topics from './components/Topics'
import Quiz from './components/Quiz'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <StartGame/>
        <GamePanel/>
        <Topics/>
        <Quiz/>
    </>
  )
}

export default App
