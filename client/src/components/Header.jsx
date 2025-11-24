import { useState } from 'react'

export default function Header({ showTitle = true, showExit = false, onExit, onHome }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}
      >
        {/* Title (clickable to go Home) — hidden when showTitle === false */}
        {showTitle ? (
          <h1
            onClick={onHome}
            title="Go to Home"
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,.25)',
              cursor: 'pointer',
              userSelect: 'none',
              margin: 0
            }}
          >
            Goose & Academic Predator
          </h1>
        ) : (
          // spacer to keep the Exit button aligned when the title is hidden
          <div style={{ height: 32 }} />
        )}

        {/* Exit appears only when showExit === true */}
        {showExit && (
          <button className="btn btn-secondary" onClick={() => setOpen(true)}>
            Exit ?
          </button>
        )}
      </div>

      {/* Confirm Exit modal */}
      {showExit && open && (
        <div className="event-modal">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon">❓</div>
              <div className="modal-title">Exit and return to Home?</div>
            </div>
            <div className="choices">
              <button
                className="choice-btn"
                onClick={() => {
                  setOpen(false)
                  onExit && onExit()
                }}
              >
                Yes
              </button>
              <button className="choice-btn" onClick={() => setOpen(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
