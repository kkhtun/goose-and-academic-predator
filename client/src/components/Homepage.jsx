import { useState } from 'react'
import { GiGoose } from "react-icons/gi";
function Homepage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
         <GiGoose />
        <h1>Goose and Academic Predator</h1>
        <p>An educational board game meant for giving awareness about predatory publishing in a gamification way</p>
        <button>Start Game</button>
      </div>
    </>
  )
}

export default Homepage
