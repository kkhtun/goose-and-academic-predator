import Square from "./Square";
import PlayerPiece from "./PlayerPiece";
import { BOARD_SIZE } from "../../constants";

export default function Board({ playerPosition, onPieceArrive }) {
  const squares = Array.from({ length: BOARD_SIZE }, (_, i) => i);

  return (
    <div style={styles.wrapper}>
      <div style={styles.board}>
        {squares.map((num) => (
          <Square key={num} number={num} />
        ))}{" "}
        <PlayerPiece position={playerPosition} onArrive={onPieceArrive} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "max-content",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(10, 80px)",
    gap: "6px",
    padding: "12px",
    background: "#2c3e50",
    borderRadius: "12px",
  },
};

// const styles = {
//   board: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
//     gap: "6px",
//     padding: "12px",
//     background: "#2c3e50",
//     borderRadius: "12px",
//     width: "100%",
//   },
// };
