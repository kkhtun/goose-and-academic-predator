import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { findPlayer } from "../../utils/common.utils";

export default function Celebration({ show, gameState }) {
    const { width, height } = useWindowSize();

    const { playerUniqueId, gameInfo } = gameState;
    const { players, gameId } = gameInfo;
    const currentPlayer = findPlayer(gameInfo, playerUniqueId);

    // Won't show a confetti if the player is not the one winning the game
    if (!show || currentPlayer.playerPos !== 90) return null;

    return (
        <Confetti
            width={width}
            height={height}
            numberOfPieces={250}
            initialVelocityY={20}
            recycle={true}
        />
    );
}
