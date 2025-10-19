// Game controls - target score input and new game button
function GameControls({ target, onChangeTarget, onNewGame, isGameOver }) {
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

            {/* New game button */}
            <div className="control">
                <button onClick={onNewGame}>New Game</button>
            </div>
        </div>
    )
}

export default GameControls;
