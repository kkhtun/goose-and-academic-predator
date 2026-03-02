import { BOARD_POSITIONS, POSITION_TYPE } from "../../constants";
import GooseIcon from "../../assets/goose-icon.svg";

function getIcon(number, type) {
  const iconStyle = { fontSize: 18, position: "absolute", bottom: 4, right: 6 };

  if (number === 0) return <span style={iconStyle}>🚩</span>;
  if (number === 90) return <span style={iconStyle}>🎓</span>;

  switch (type) {
    case POSITION_TYPE.GOOSE:
      return (
        <span style={iconStyle}>
          <img src={GooseIcon} alt="goose" width={18} height={18} />
        </span>
      );

    case POSITION_TYPE.CHALLENGE:
      return <span style={iconStyle}>❓</span>;

    case POSITION_TYPE.INFO:
      return <span style={iconStyle}>ℹ️</span>;

    case POSITION_TYPE.JUMP_TURN:
      return <span style={iconStyle}>⏭️</span>;

    case POSITION_TYPE.DICE_TWICE:
      return <span style={iconStyle}>🎲</span>;

    case POSITION_TYPE.BACK_TO_START:
      return <span style={iconStyle}>🔁</span>;

    case POSITION_TYPE.LUCKY:
      return <span style={iconStyle}>🍀</span>;

    case POSITION_TYPE.PENALTY:
      return <span style={iconStyle}>🐊</span>; // crocodile idea 🐊

    default:
      return <></>;
  }
}

export default function Square({ number }) {
  return (
    <div style={styles.square}>
      <span>{number}</span>
      {getIcon(number, BOARD_POSITIONS[number])}
    </div>
  );
}

const styles = {
  square: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 18,
    position: "relative",
    background: "#ecf0f1",
    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },
};
