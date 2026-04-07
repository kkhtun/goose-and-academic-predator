import { BOARD_POSITIONS, POSITION_TYPE } from "../constants";
import { BoxIcon } from "./icons/BoxIcon";

export default function Square({ number }) {
    return (
        <div style={styles.square}>
            <span>{number}</span>
            <BoxIcon
                number={number}
                type={BOARD_POSITIONS[number]}
                onSquare={true}
            />
        </div>
    );
}
const styles = {
    square: {
        width: 80,
        height: 80,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 18,
        position: "relative",
        background: "#ecf0f1",
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    },
};
