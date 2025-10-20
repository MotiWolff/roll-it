import OpenAI from "openai";

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

/**
 * Ask OpenAI to make a decision: ROLL or HOLD
 * @param {Object} gameState - Current game state
 * @returns {Promise<'ROLL'|'HOLD'>} AI decision
 */
export async function getAIDecision(gameState) {
  const { aiScore, opponentScore, currentRound, target, dice } = gameState;

  const prompt = `You are playing a dice game called "Roll It". Here are the rules:
- Target score: ${target}
- You must reach EXACTLY ${target} to win
- If you go over ${target}, you LOSE
- Each turn you roll 2 dice and accumulate points
- You can ROLL again or HOLD (bank your points)
- If you roll double-six (6,6), you lose ALL round points and your turn ends

Current situation:
- Your score: ${aiScore}
- Opponent's score: ${opponentScore}
- Your current round points: ${currentRound}
- Last dice rolled: ${dice[0]}, ${dice[1]}
- If you HOLD now, your total will be: ${aiScore + currentRound}

Should you ROLL or HOLD? Consider:
1. Can you win by holding?
2. Would holding make you overshoot?
3. Is your round score good enough to bank?
4. What's the risk of rolling double-six?

Respond with ONLY one word: "ROLL" or "HOLD"`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cheap model
      messages: [
        {
          role: "system",
          content:
            "You are a strategic dice game player. Analyze the situation and decide wisely. Respond with only 'ROLL' or 'HOLD'.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 10,
      temperature: 0.7, // Some randomness for variety
    });

    const decision = response.choices[0].message.content.trim().toUpperCase();

    // Validate response
    if (decision.includes("ROLL")) return "ROLL";
    if (decision.includes("HOLD")) return "HOLD";

    // Fallback if unclear response
    console.warn("Unclear AI response:", decision);
    return "ROLL"; // Default to rolling
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error; // Let the caller handle fallback
  }
}
