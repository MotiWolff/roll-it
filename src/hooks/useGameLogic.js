import { useState, useEffect, useCallback } from "react";
import { getAIDecision } from "../services/openai";

const DEFAULT_TARGET = 50;
const STORAGE_KEY = "rollit-game-data"; // localStorage key

// Generate random die value (1-6)
function randDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// Load saved data from localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
  }
  return null;
}

// Save data to localStorage
function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function useGameLogic() {
  // Load saved data on first render
  const savedData = loadFromStorage();

  // Game state - initialize with saved data if available
  const [scores, setScores] = useState([0, 0]); // Total scores for both players
  const [round, setRound] = useState(0); // Current round score
  const [active, setActive] = useState(0); // Active player (0 or 1)
  const [dice, setDice] = useState([null, null]); // Current dice values
  const [target, setTarget] = useState(savedData?.target || DEFAULT_TARGET); // Winning score
  const [gameOver, setGameOver] = useState(false); // Game end flag
  const [message, setMessage] = useState(""); // Feedback message
  const [wins, setWins] = useState(savedData?.wins || [0, 0]); // Win counter for both players
  const [aiEnabled, setAiEnabled] = useState(savedData?.aiEnabled || false); // AI opponent toggle
  const [showDoubleSix, setShowDoubleSix] = useState(false); // Double-six overlay state
  const [soundEnabled, setSoundEnabled] = useState(
    savedData?.soundEnabled || true
  ); // Sound effects toggle

  // Save wins, target, AI setting, and sound to localStorage whenever they change
  useEffect(() => {
    saveToStorage({ wins, target, aiEnabled, soundEnabled });
  }, [wins, target, aiEnabled, soundEnabled]);

  // Switch active player
  const passTurn = useCallback(() => {
    setRound(0);
    setActive((p) => (p === 0 ? 1 : 0));
  }, []); // Check win/loss conditions
  const checkEnd = useCallback(
    (newTotal, player) => {
      // Exact hit wins
      if (newTotal === target) {
        setGameOver(true);
        setMessage(`Player ${player + 1} hits exactly ${target}! WINNER! 🎉`);
        setWins((w) => {
          const nw = [...w];
          nw[player] += 1;
          return nw;
        });

        // Play win sound
        if (soundEnabled && window.playWinSound) {
          setTimeout(() => window.playWinSound(), 100);
        }

        return true;
      }
      // Overshoot loses
      if (newTotal > target) {
        const other = player === 0 ? 1 : 0;
        setGameOver(true);
        setMessage(
          `Player ${player + 1} overshot ${target}. Player ${
            other + 1
          } wins! 🏆`
        );
        setWins((w) => {
          const nw = [...w];
          nw[other] += 1;
          return nw;
        });

        // Play win sound for the winner
        if (soundEnabled && window.playWinSound) {
          setTimeout(() => window.playWinSound(), 100);
        }

        return true;
      }
      return false;
    },
    [target, soundEnabled]
  );

  // Roll two dice
  const onRoll = useCallback(() => {
    if (gameOver) return;
    const d1 = randDie();
    const d2 = randDie();
    setDice([d1, d2]);

    // Play roll sound
    if (soundEnabled && window.playRollSound) {
      window.playRollSound();
    }

    // Double six rule: lose round and pass turn with 4 second overlay
    if (d1 === 6 && d2 === 6) {
      setMessage(`Player ${active + 1} rolled double six! Round lost.`);
      setShowDoubleSix(true); // Show overlay
      setRound(0);

      // Play bust sound
      if (soundEnabled && window.playBustSound) {
        setTimeout(() => window.playBustSound(), 100);
      }

      // Hold for 4 seconds with overlay, then hide and pass turn
      setTimeout(() => {
        setShowDoubleSix(false);
        setMessage("");
        passTurn();
      }, 4000);
      return;
    }

    // Add to round score
    setRound((r) => r + d1 + d2);
  }, [gameOver, active, passTurn, soundEnabled]);

  // Hold: add round to total and switch player
  const onHold = useCallback(() => {
    if (gameOver || round === 0) return;

    const player = active;
    const newTotal = scores[player] + round;

    const ns = [...scores];
    ns[player] = newTotal;
    setScores(ns);

    // Play hold sound
    if (soundEnabled && window.playHoldSound) {
      window.playHoldSound();
    }

    // Check for win/loss
    const ended = checkEnd(newTotal, player);
    if (!ended) {
      passTurn();
    }
    setRound(0);
  }, [gameOver, round, active, scores, checkEnd, passTurn, soundEnabled]);

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

  // Toggle AI opponent on/off
  const toggleAI = () => {
    setAiEnabled((prev) => !prev);
  };

  // Toggle sound effects on/off
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Manually close double-six overlay
  const closeDoubleSix = () => {
    setShowDoubleSix(false);
    setMessage("");
    passTurn();
  };

  // AI decision making logic using OpenAI
  useEffect(() => {
    // Only run if AI is enabled, it's AI's turn (player 2), and game is not over
    if (!aiEnabled || active !== 1 || gameOver) return;

    // AI needs to make a decision
    const makeAIDecision = async () => {
      const aiScore = scores[1]; // AI is player 2 (index 1)
      const potentialTotal = aiScore + round;

      try {
        // Call OpenAI API for decision
        const decision = await getAIDecision({
          aiScore,
          opponentScore: scores[0],
          currentRound: round,
          target,
          dice,
        });

        console.log("🤖 AI Decision:", decision);

        // Execute the AI's decision
        if (decision === "HOLD") {
          onHold();
        } else {
          onRoll();
        }
      } catch (error) {
        console.warn("OpenAI API failed, using fallback logic:", error);

        // Fallback to rule-based logic if API fails
        if (potentialTotal === target) {
          onHold();
        } else if (potentialTotal > target) {
          onRoll();
        } else {
          const threshold = Math.min(20, Math.max(12, target - aiScore - 5));
          if (round >= threshold) {
            onHold();
          } else {
            onRoll();
          }
        }
      }
    };

    // Add delay so human can see what's happening
    const aiDelay = setTimeout(makeAIDecision, 1500); // 1.5s for API call

    // Cleanup timeout if component unmounts or dependencies change
    return () => clearTimeout(aiDelay);
  }, [
    aiEnabled,
    active,
    gameOver,
    round,
    scores,
    target,
    dice,
    onHold,
    onRoll,
  ]); // Re-run when these change

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
  };
}
