// Action buttons - Roll dice or Hold to save score
function Actions({ onRoll, onHold, canRoll, canHold }) {
    return (
        <div className="actions">
            {/* Roll button - roll two dice */}
            <button onClick={onRoll} disabled={!canRoll}>
                Roll
            </button>
            {/* Hold button - save round score to total */}
            <button onClick={onHold} disabled={!canHold}>
                Hold
            </button>
        </div>
    )
}

export default Actions;
