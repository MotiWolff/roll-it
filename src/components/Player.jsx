function Player({ playerNumber, score, wins, round, isActive, isGameOver }) {
  return (
    <div className={`player ${isActive ? 'active' : ''} ${isGameOver ? 'disabled' : ''}`}>
      <h2>Player {playerNumber}</h2>
      <div className="score">Total: {score}</div>
      <div className="wins">Wins: {wins}</div>
      {isActive && !isGameOver && (
        <div className="round">Round: {round}</div>
      )}
    </div>
  )
}

export default Player;
