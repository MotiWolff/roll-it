import { useState } from "react";

const DEFAULT_TARGET = 50;

// Generate random die value (1-6)
function randDie() {
  return Math.floor(Math.random() * 6) + 1;
}

export function useGameLogic() {
  // Game state
  const [scores, setScores] = useState([0, 0]); // Total scores for both players
  const [round, setRound] = useState(0); // Current round score
  const [active, setActive] = useState(0); // Active player (0 or 1)
  const [dice, setDice] = useState([null, null]); // Current dice values
  const [target, setTarget] = useState(DEFAULT_TARGET); // Winning score
  const [gameOver, setGameOver] = useState(false); // Game end flag
  const [message, setMessage] = useState(""); // Feedback message
  const [wins, setWins] = useState([0, 0]); // Win counter for both players

  // Switch to next player
  const passTurn = () => {
    setRound(0);
    setActive((p) => (p === 0 ? 1 : 0));
  };

  // Check win/loss conditions
  const checkEnd = (newTotal, player) => {
    // Exact hit wins
    if (newTotal === target) {
      setGameOver(true);
      setMessage(`Player ${player + 1} hits exactly ${target}! WINNER! 🎉`);
      setWins((w) => {
        const nw = [...w];
        nw[player] += 1;
        return nw;
      });
      return true;
    }
    // Overshoot loses
    if (newTotal > target) {
      const other = player === 0 ? 1 : 0;
      setGameOver(true);
      setMessage(
        `Player ${player + 1} overshot ${target}. Player ${other + 1} wins! 🏆`
      );
      setWins((w) => {
        const nw = [...w];
        nw[other] += 1;
        return nw;
      });
      return true;
    }
    return false;
  };

  // Roll two dice
  const onRoll = () => {
    if (gameOver) return;
    const d1 = randDie();
    const d2 = randDie();
    setDice([d1, d2]);

    // Double six rule: lose round and pass turn
    if (d1 === 6 && d2 === 6) {
      setMessage(`Player ${active + 1} rolled double six! Round lost.`);
      setRound(0);
      setTimeout(() => {
        setMessage("");
        passTurn();
      }, 1200);
      return;
    }

    // Add to round score
    setRound((r) => r + d1 + d2);
  };

  // Hold: add round to total and switch player
  const onHold = () => {
    if (gameOver || round === 0) return;

    const player = active;
    const newTotal = scores[player] + round;

    const ns = [...scores];
    ns[player] = newTotal;
    setScores(ns);

    // Check for win/loss
    const ended = checkEnd(newTotal, player);
    if (!ended) {
      passTurn();
    }
    setRound(0);
  };

  // Reset game (preserves win counts)
  const onNewGame = () => {
    setScores([0, 0]);
    setRound(0);
    setActive(0);
    setDice([null, null]);
    setGameOver(false);
    setMessage("");
  };

  // Update target score (1-100)
  const onChangeTarget = (e) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) return;
    const clamped = Math.max(1, Math.min(100, Math.floor(val)));
    setTarget(clamped);
  };

  // Export state and handlers
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
  };
}
