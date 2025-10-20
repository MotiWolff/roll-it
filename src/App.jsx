import './App.css'
import Player from './components/Player'
import Dice from './components/Dice'
import GameControls from './components/GameControls'
import Actions from './components/Actions'
import Message from './components/Message'
import DoubleSixOverlay from './components/DoubleSixOverlay'
import AudioManager from './components/AudioManager'
import { useGameLogic } from './hooks/useGameLogic'

function App() {
  // Get game state and handlers from custom hook
  const {
    scores,
    round,
    active,
    dice,
    target,
    gameOver,
    message,
    wins,
    aiEnabled,
    soundEnabled,
    showDoubleSix,
    onRoll,
    onHold,
    onNewGame,
    onChangeTarget,
    toggleAI,
    toggleSound,
    closeDoubleSix,
  } = useGameLogic()

  return (
    <div className="game">
      <h1>Roll It</h1>

      {/* Game settings and new game button */}
      <GameControls
        target={target}
        onChangeTarget={onChangeTarget}
        onNewGame={onNewGame}
        isGameOver={gameOver}
        aiEnabled={aiEnabled}
        toggleAI={toggleAI}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />

      {/* Player cards */}
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

      {/* Dice display */}
      <Dice dice={dice} />

      {/* Roll and Hold buttons */}
      <Actions
        onRoll={onRoll}
        onHold={onHold}
        canRoll={!gameOver}
        canHold={!gameOver && round > 0}
      />

      {/* Game messages */}
      <Message message={message} />

      {/* Double-six overlay */}
      <DoubleSixOverlay
        show={showDoubleSix}
        playerNumber={active + 1}
        onClose={closeDoubleSix}
      />

      {/* Audio Manager */}
      <AudioManager enabled={soundEnabled} />
    </div>
  )
}

export default App


