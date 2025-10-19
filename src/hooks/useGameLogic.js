import { useState } from 'react'

const DEFAULT_TARGET = 50

function randDie() {
  return Math.floor(Math.random() * 6) + 1
}

export function useGameLogic() {
  // Initializing state for each logical operation
  const [scores, setScores] = useState([0, 0])
  const [round, setRound] = useState(0)
  const [active, setActive] = useState(0) // 0 or 1
  const [dice, setDice] = useState([null, null])
  const [target, setTarget] = useState(DEFAULT_TARGET)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [wins, setWins] = useState([0, 0])

  const passTurn = () => {
    setRound(0)
    setActive((p) => (p === 0 ? 1 : 0))
  }

  const checkEnd = (newTotal, player) => {
    if (newTotal === target) {
      setGameOver(true)
      setMessage(`Player ${player + 1} hits exactly ${target}! WINNER! 🎉`)
      setWins((w) => {
        const nw = [...w]
        nw[player] += 1
        return nw
      })
      return true
    }
    if (newTotal > target) {
      // Player loses by overshooting
      const other = player === 0 ? 1 : 0
      setGameOver(true)
      setMessage(`Player ${player + 1} overshot ${target}. Player ${other + 1} wins! 🏆`)
      setWins((w) => {
        const nw = [...w]
        nw[other] += 1
        return nw
      })
      return true
    }
    return false
  }

  const onRoll = () => {
    if (gameOver) return
    const d1 = randDie()
    const d2 = randDie()
    setDice([d1, d2])

    if (d1 === 6 && d2 === 6) {
      // Double six: lose round and pass turn
      setMessage(`Player ${active + 1} rolled double six! Round lost.`)
      setRound(0)
      setTimeout(() => {
        setMessage('')
        passTurn()
      }, 1200)
      return
    }

    setRound((r) => r + d1 + d2)
  }

  const onHold = () => {
    if (gameOver || round === 0) return
    
    const player = active
    const newTotal = scores[player] + round
    
    const ns = [...scores]
    ns[player] = newTotal
    setScores(ns)
    
    const ended = checkEnd(newTotal, player)
    if (!ended) {
      passTurn()
    }
    setRound(0)
  }

  const onNewGame = () => {
    setScores([0, 0])
    setRound(0)
    setActive(0)
    setDice([null, null])
    setGameOver(false)
    setMessage('')
  }

  const onChangeTarget = (e) => {
    const val = Number(e.target.value)
    if (Number.isNaN(val)) return
    const clamped = Math.max(1, Math.min(100, Math.floor(val)))
    setTarget(clamped)
  }

  return {
    scores,
    round,
    active,
    dice,
    target,
    gameOver,
    message,
    wins,
    onRoll,
    onHold,
    onNewGame,
    onChangeTarget,
  }
}
