# Roll It – Yalla Balagan! 🎲

A two-player dice game built with React and Vite. Roll the dice, accumulate points, but watch out for double sixes!

## Game Rules

### Basic Gameplay
- **2 Players**: Players take turns rolling two dice
- **Accumulate Points**: Each roll adds to your round score
- **Hold**: Save your round score to your total and pass the turn
- **Double Six Rule**: Roll 6-6 and you lose your entire round score and the turn passes

### Winning Conditions
- **Win**: Be the first to reach the target score **exactly**
- **Lose**: If you hold and your total **exceeds** the target, you lose and your opponent wins
- **Customizable Target**: Set the winning score anywhere from 1 to 100 (default: 50)

### Features
- ✅ Real-time score tracking for both players
- ✅ Win counter persistence across games
- ✅ Visual dice with images
- ✅ Active player highlighting
- ✅ Responsive design for mobile and desktop
- ✅ Game state messages and feedback
- ✅ New game functionality that preserves win statistics

## Project Structure

```
src/
├── components/
│   ├── Player.jsx       # Player card with scores and win count
│   ├── Dice.jsx         # Dice display with images
│   ├── GameControls.jsx # Target input and new game button
│   ├── Actions.jsx      # Roll and Hold buttons
│   └── Message.jsx      # Game messages and feedback
├── hooks/
│   └── useGameLogic.js  # Custom hook for game state management
├── assets/
│   ├── dice-1.png through dice-6.png
│   └── react.svg
├── App.jsx              # Main app component
├── App.css              # Global styles
└── main.jsx             # Entry point
```

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm build
```

### Preview Production Build
```bash
npm run preview
```

## How to Play

1. **Set Target Score**: Enter your desired winning score (1-100) before starting
2. **Roll Dice**: Click "Roll" to roll two dice
3. **Build Your Score**: Keep rolling to accumulate points in your round
4. **Hold**: Click "Hold" to add your round score to your total and pass the turn
5. **Avoid Double Six**: If you roll 6-6, you lose your round score and the turn
6. **Win Exactly**: Reach the target score exactly to win!
7. **New Game**: Click "New Game" anytime to reset (win counts are preserved)

## Technologies

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **CSS3** - Styling with gradients and animations
- **ES6+** - Modern JavaScript

## Development Notes

- Uses custom React hooks for clean state management
- Component-based architecture for maintainability
- Responsive CSS with mobile-first approach
- Real dice images for better UX

---

**Yalla Balagan!** Let the games begin! 🎉
