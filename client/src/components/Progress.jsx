export default function Progress({ percent }) {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }}>
          {percent}%
        </div>
      </div>
    </div>
  )
}
