import dice1 from '../assets/dice-1.png'
import dice2 from '../assets/dice-2.png'
import dice3 from '../assets/dice-3.png'
import dice4 from '../assets/dice-4.png'
import dice5 from '../assets/dice-5.png'
import dice6 from '../assets/dice-6.png'

// Map dice values (1-6) to images
const DICE_IMAGES = [dice1, dice2, dice3, dice4, dice5, dice6]

// Dice display component - shows two dice with images
function Dice({ dice }) {
    return (
        <div className="dice">
            {/* First die */}
            {dice[0] !== null && (
                <div className="die">
                    <img src={DICE_IMAGES[dice[0] - 1]} alt={`Dice ${dice[0]}`} />
                </div>
            )}
            {/* Second die */}
            {dice[1] !== null && (
                <div className="die">
                    <img src={DICE_IMAGES[dice[1] - 1]} alt={`Dice ${dice[1]}`} />
                </div>
            )}
        </div>
    )
}

export default Dice;
