import StarIcon from '../icons/StarIcon'
import BooksIcon from '../icons/BooksIcon'
import CoinIcon from '../icons/CoinIcon'

export default function StatChips({ reputation, knowledge, coins }) {
  return (
    <div className="stat-chips" role="group" aria-label="player stats">
      <div className="chip">
        <span className="chip-icon"><StarIcon/></span>
        <span className="chip-value">{reputation}</span>
      </div>
      <div className="chip">
        <span className="chip-icon"><BooksIcon/></span>
        <span className="chip-value">{knowledge}</span>
      </div>
      <div className="chip">
        <span className="chip-icon"><CoinIcon/></span>
        <span className="chip-value">{coins}</span>
      </div>
    </div>
  )
}
