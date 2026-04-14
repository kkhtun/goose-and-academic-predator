import { BOARD_POSITIONS, REALM_TYPE } from "../constants";
import { getLevel, SQUARE_SIZE } from "../utils/position.utils";
import { BoxIcon } from "./icons/BoxIcon";

export default function Square({ number, heavenOrHell }) {
    // Some UI logic to change board colors
    const level = getLevel(number);
    let dynamicStyles = { background: "#ecf0f1" };
    if (level === 1) {
        dynamicStyles.background = "rgb(161, 93, 190)";
        // dynamicStyles.background = "rgba(142, 68, 173, 1)";
        dynamicStyles.color = "#ecf0f1";
    } else if (level === 2 || number === null) {
        // Further determine heaven or hell
        if (heavenOrHell === REALM_TYPE.HELL) {
            dynamicStyles.background = "rgb(196, 106, 100)";
        } else {
            dynamicStyles.background = "rgb(86, 164, 216)";
        }
        dynamicStyles.color = "#ecf0f1";
    }

    return (
        <div style={{ ...styles.square, ...dynamicStyles }}>
            <span style={number === 90 ? { color: "#FFD700" } : {}}>
                {number}
            </span>
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
        width: `${SQUARE_SIZE}px`,
        height: `${SQUARE_SIZE}px`,
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
