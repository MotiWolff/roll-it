// Overlay that shows when player rolls double-six (6-6)
function DoubleSixOverlay({ show, playerNumber, onClose }) {
    if (!show) return null;

    return (
        <div className="double-six-overlay" onClick={onClose}>
            <div className="double-six-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label="Close">
                    ✕
                </button>
                <h2> BUSTED! </h2>
                <p className="bust-message">Player {playerNumber} rolled double six!</p>
                <div className="dice-animation">🎲🎲</div>
                <p className="penalty">Round points = 0</p>
            </div>
        </div>
    );
}

export default DoubleSixOverlay;
