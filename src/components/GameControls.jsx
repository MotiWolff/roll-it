// Game controls - target score input, AI toggle, sound toggle, and new game button
function GameControls({ target, onChangeTarget, onNewGame, isGameOver, aiEnabled, toggleAI, soundEnabled, toggleSound }) {
    return (
        <div className="controls">
            {/* Target score input */}
            <div className="control">
                <label>
                    Target (1–100):
                    {' '}
                    <input
                        type="number"
                        min={1}
                        max={100}
                        value={target}
                        onChange={onChangeTarget}
                        disabled={isGameOver}
                    />
                </label>
            </div>

            {/* AI opponent toggle */}
            <div className="control">
                <label>
                    <input
                        type="checkbox"
                        checked={aiEnabled}
                        onChange={toggleAI}
                    />
                    {' '}
                    🤖 AI Opponent
                </label>
            </div>

            {/* Sound effects toggle */}
            <div className="control">
                <label>
                    <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={toggleSound}
                    />
                    {' '}
                    🔊 Sound Effects
                </label>
            </div>

            {/* New game button */}
            <div className="control">
                <button onClick={onNewGame}>New Game</button>
            </div>
        </div>
    )
}

export default GameControls;
