export default function MentorBox({ message }) {
  return (
    <div className="mentor-box">
      <div className="mentor-header">
        <div className="mentor-avatar">🦎</div>
        <div className="mentor-name">Prof. BiblioChameleon</div>
      </div>
      <div className="mentor-message">{message}</div>
    </div>
  )
}
