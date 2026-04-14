import { POSITION_TYPE } from "../../constants";
import GooseIcon from "../../assets/goose-icon.svg";

export function BoxIcon({ number, type, onSquare = false, style = {} }) {
    const iconStyle = onSquare
        ? {
              fontSize: 18,
              position: "absolute",
              bottom: 4,
              right: 6,
              ...style,
          }
        : { ...style };

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
