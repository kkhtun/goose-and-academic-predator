import { ANIMALS, DISCIPLINES } from '../../utils/constants'

export default function SectorPage({
  selectedAnimal, setSelectedAnimal,
  selectedDiscipline, setSelectedDiscipline,
  onStartLevel0, onBack
}) {
  return (
    <div className="character-selection">
      <h2 className="modal-title">Please select…</h2>

      <div className="character-grid" style={{marginTop:10}}>
        {ANIMALS.map(an => (
          <div key={an.id}
            className={`character-card ${selectedAnimal?.id === an.id ? 'selected' : ''}`}
            onClick={() => setSelectedAnimal(an)}
          >
            <div className="character-emoji">{an.emoji}</div>
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{an.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{an.skill}</div>
          </div>
        ))}
      </div>

      <select
        className="discipline-select"
        value={selectedDiscipline}
        onChange={(e) => setSelectedDiscipline(e.target.value)}
      >
        <option value="">Select a discipline…</option>
        {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:10 }}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
        <button
          className="btn btn-primary"
          disabled={!selectedAnimal || !selectedDiscipline}
          onClick={onStartLevel0}
        >
          Start Level 0
        </button>
      </div>
    </div>
  )
}
