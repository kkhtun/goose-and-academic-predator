import { useState } from 'react'
function Homepage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Goose and Academic Predator</h1>
        <button>Start Game</button>
      </div>
    </>
  )
}

export default Homepage
