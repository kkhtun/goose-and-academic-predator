import { useNavigate } from "react-router-dom";
import "../index.css";

export default function MainMenu() {
    const navigate = useNavigate();

    return (
        <div className="menu-wrapper">
            <div className="menu-card">
                <div className="goose-avatar"></div>
                <h1 style={{ marginBottom: "8px" }}>
                    Goose and Academic Predator
                </h1>
                <p>Learn to navigate academic publishing and avoid predatory journals</p>
                <button
                    onClick={() => navigate("/start")}
                >
                    Start Game
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => navigate(`/join`)}
                >
                    👥 Join Game
                </button>
            </div>
        </div>
    );
}
