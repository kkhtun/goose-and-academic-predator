import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function Celebration({ show }) {
  const { width, height } = useWindowSize();

  if (!show) return null;

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
