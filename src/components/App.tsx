import Score from './Score'
import Board from './Board'
import { useState } from 'react'


const cardIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
cardIds.sort(() => 0.5 - Math.random())
console.log(cardIds);

function App() {

  const [moves, setMoves] = useState<number>(0)
  const [bestScore, setBestScore] = useState<number>(
    parseInt(localStorage.getItem('bestScore') || '0') || Number.MAX_SAFE_INTEGER
  )
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const finishGameCallback = () => {
    const newBestScore = moves < bestScore ? moves : bestScore
    setBestScore(newBestScore)
    localStorage.setItem('bestScore', '' + newBestScore)
  }

  return (
    <div className="app-container">
      <Score 
        moves={moves} 
        bestScore={bestScore}
        timeLeft={timeLeft}
      />
      <Board 
        setMoves={setMoves} 
        finishGameCallback={finishGameCallback} 
        cardIds={cardIds}
        setTimeLeft={setTimeLeft}
        timeLeft = {timeLeft}
      />
    </div>
  )
}

export default App