import { FaDog, FaCat, FaCrow, FaFish } from "react-icons/fa";
import { GiCamel } from "react-icons/gi";

export const avatars = [
    { id: "dog", icon: <FaDog size={64} />, name: "Dog", color: "#6c5ce7" },
    { id: "cat", icon: <FaCat size={64} />, name: "Cat", color: "#e84393" },
    {
        id: "bird",
        icon: <FaCrow size={64} />,
        name: "Bird",
        color: "#00b894",
    },
    {
        id: "fish",
        icon: <FaFish size={64} />,
        name: "Fish",
        color: "#0984e3",
    },
    {
        id: "camel",
        icon: <GiCamel size={64} />,
        name: "Camel",
        color: "#e17055",
    },
];
