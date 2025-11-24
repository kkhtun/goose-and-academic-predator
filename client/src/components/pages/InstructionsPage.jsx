export default function InstructionsPage({ onBack }) {
  return (
    <div className="character-selection">
      <h2 className="modal-title">Gaming Instructions</h2>
      <ul style={{marginTop:10, paddingLeft:18, lineHeight:1.7, color:'#555'}}>
        <li>Roll <b>two dice</b> to move across the 90-square board.</li>
        <li>Face quizzes, moral choices, and scenarios at each stop.</li>
        <li>Earn reputation, knowledge, collaborators, and coins.</li>
        <li>Complete Level 0 → Level 1 → Level 2 to graduate.</li>
      </ul>
      <div style={{marginTop:14, textAlign:'right'}}>
        <button className="btn btn-secondary" onClick={onBack}>Back</button>
      </div>
    </div>
  )
}
