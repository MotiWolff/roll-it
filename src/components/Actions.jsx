function Actions({ onRoll, onHold, canRoll, canHold }) {
  return (
    <div className="actions">
      <button onClick={onRoll} disabled={!canRoll}>
        Roll
      </button>
      <button onClick={onHold} disabled={!canHold}>
        Hold
      </button>
    </div>
  )
}

export default Actions;
