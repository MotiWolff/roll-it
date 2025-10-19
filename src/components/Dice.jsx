import dice1 from '../assets/dice-1.png'
import dice2 from '../assets/dice-2.png'
import dice3 from '../assets/dice-3.png'
import dice4 from '../assets/dice-4.png'
import dice5 from '../assets/dice-5.png'
import dice6 from '../assets/dice-6.png'

const DICE_IMAGES = [dice1, dice2, dice3, dice4, dice5, dice6]

function Dice({ dice }) {
  return (
    <div className="dice">
      {dice[0] !== null && (
        <div className="die">
          <img src={DICE_IMAGES[dice[0] - 1]} alt={`Dice ${dice[0]}`} />
        </div>
      )}
      {dice[1] !== null && (
        <div className="die">
          <img src={DICE_IMAGES[dice[1] - 1]} alt={`Dice ${dice[1]}`} />
        </div>
      )}
    </div>
  )
}

export default Dice;
