import './App.css'
import Player from './components/Player'
import Dice from './components/Dice'
import GameControls from './components/GameControls'
import Actions from './components/Actions'
import Message from './components/Message'
import { useGameLogic } from './hooks/useGameLogic'

function App() {
  // Setting game necessary states from the useGameLogic file
  const {
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
  } = useGameLogic()

  return (
    <div className="game">
      <h1>Roll It</h1>

      
      <GameControls 
        target={target}
        onChangeTarget={onChangeTarget}
        onNewGame={onNewGame}
        isGameOver={gameOver}
      />

      <div className="board">
        {[0, 1].map((p) => (
          <Player
            key={p}
            playerNumber={p + 1}
            score={scores[p]}
            wins={wins[p]}
            round={round}
            isActive={active === p}
            isGameOver={gameOver}
          />
        ))}
      </div>

      <Dice dice={dice} />

      <Actions
        onRoll={onRoll}
        onHold={onHold}
        canRoll={!gameOver}
        canHold={!gameOver && round > 0}
      />

      <Message message={message} />
    </div>
  )
}

export default App


