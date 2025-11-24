export default function CongratsPage({ level, onNext, onGraduate }) {
  return (
    <div className="character-selection">
      <h2 className="modal-title">Congratulations!!</h2>
      <p style={{color:'#555', marginTop:6}}>You Completed Level {level}</p>
      <div style={{marginTop:14}}>
        {level < 2 ? (
          <button className="btn btn-primary" onClick={onNext}>
            Continue to Level {level + 1}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onGraduate}>Graduate</button>
        )}
      </div>
    </div>
  )
}
