import { useNavigate } from "react-router-dom";
import "../index.css";

export default function MainMenu() {
    const navigate = useNavigate();

    return (
        <div
            className="menu-wrapper"
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="menu-card"
                style={{ width: "90%", maxWidth: "600px" }}
            >
                <div className="goose-avatar"></div>
                <h1 style={{ paddingBottom: "20px" }}>
                    Goose and Academic Predator
                </h1>
                <button
                    onClick={() => navigate("/start")}
                    style={{
                        padding: "12px 30px",
                        fontSize: "18px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Start Game
                </button>
                <button
                    onClick={() => navigate(`/join`)}
                    style={{
                        padding: "12px 30px",
                        fontSize: "18px",
                        backgroundColor: "#FEBE10",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Join Game
                </button>
            </div>
        </div>
    );
}
