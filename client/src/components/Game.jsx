import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import * as R from "ramda";

import Board from "./Board";
import GameControls from "./GameControls";
import TransitionOverlay from "./TransitionOverlay";
import { POSITION_DESCRIPTIONS, POSITION_TYPE } from "../constants";
// import { useLocalStorage } from "@uidotdev/usehooks";
import QuizPopup from "./popups/QuizPopup";
import InfoPopup from "./popups/InfoPopup";
import { toTitle } from "../utils";
import Celebration from "./popups/Celebration";
import { socket } from "../socket";
import { toast } from "react-toastify";
import useLocalStorage from "../hooks/useLocalStorage";

function Game() {
    const navigate = useNavigate();

    const [gameState, setGameState] = useLocalStorage("GAME_STATE", null);

    // const [gameId, setGameId] = useLocalStorage("GAME_ID", null);
    // const [playerUniqueId, setPlayerUniqueId] = useLocalStorage(
    //     "PLAYER_UNIQUE_ID",
    //     null,
    // );
    // const [playerName, setPlayerName] = useLocalStorage("PLAYER_NAME", null);

    const [position, setPosition] = useState(0);
    const [currentMoves, setCurrentMoves] = useState([]);

    const [lastRoll, setLastRoll] = useState(null);
    const [score, setScore] = useState(0);

    const [popup, setPopup] = useState(null);
    const [won, setWon] = useState(false);
    const [transition, setTransition] = useState(null);

    const gameStateRef = useRef(gameState);
    useEffect(() => {
        gameStateRef.current = gameState; // always keep latest state in ref
    }, [gameState]);

    const { gameInfo, playerUniqueId } = gameState || {};
    const { gameId } = gameInfo || {};

    // useEffect(() => {
    //     if (!gameId || !playerUniqueId) {
    //         toast.error("Invalid Game Access");
    //         navigate("/");
    //     }
    // }, [gameId, playerUniqueId]);

    // SocketIO
    useEffect(() => {
        const { gameInfo, playerUniqueId } = gameStateRef.current;
        const { gameId } = gameInfo;

        socket.connect();

        const handleConnect = () => {
            console.log("Connected:", socket.id);
            socket.emit("joinGame", { gameId, playerUniqueId });
        };

        const handlePlayerJoined = (data) => {
            const {
                playerUniqueId: joinedPlayerId,
                gameInfo: updatedGameInfo,
            } = data;

            setGameState({
                gameInfo: updatedGameInfo,
                playerUniqueId,
            });
            toast.info(`Player ${joinedPlayerId} joined the game.`);
        };

        const handleError = (err) => {
            console.error("[Socket error]:", err);
            const errMessage = err?.message || "Something went wrong";
            toast.error(errMessage, { toastId: errMessage });
        };

        socket.on("connect", handleConnect);
        socket.on("playerJoined", handlePlayerJoined);
        socket.on("error", handleError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("playerJoined", handlePlayerJoined);
            socket.off("error", handleError);
            socket.disconnect();
            gameStateRef.current = null;
        };
    }, []);

    const handleRoll = ({ roll, moves, game, gameInfo }) => {
        const { total } = roll;
        setLastRoll(total);

        // which player moves which?
        handleScore(game, playerUniqueId);
        setCurrentMoves(moves);
        takeStep(moves[0]);
    };

    const handleScore = (game, playerId) => {
        const { players } = game;
        const player = players.find((p) => p.playerUniqueId === playerId);
        if (player) setScore(player.score);
    };

    const takeStep = (move) => {
        const { next } = move;

        const prevLevel = position >= 60 ? 2 : position >= 30 ? 1 : 0;
        const nextLevel = next >= 60 ? 2 : next >= 30 ? 1 : 0;

        if (nextLevel > prevLevel) {
            let transitionType = "ELEVATOR";
            if (nextLevel === 2) {
                transitionType = score >= 60 ? "HEAVEN" : "HELL";
            }
            setTransition(transitionType);

            setTimeout(() => {
                setTransition(null);
                setPosition(next);
            }, 3000);
        } else {
            setPosition(next);
        }
    };

    const handlePieceArrive = (pos) => {
        const { playerUniqueId, next, nextType, content, isActive } =
            currentMoves[0];
        setCurrentMoves(R.tail(currentMoves));

        if (pos >= 90) {
            const endgame = {
                title: "Congratulations",
                text: "You have graduated the game!!! 🎓🎓🎓",
            };
            setWon(true);
            setPopup({ type: POSITION_TYPE.INFO, content: endgame });
        } else if (pos == 0 || isActive === false) {
            return;
        } else if (pos === next) {
            if (nextType === POSITION_TYPE.CHALLENGE) {
                const { quiz } = content;
                setPopup({ type: POSITION_TYPE.CHALLENGE, content: quiz });
            } else if (nextType === POSITION_TYPE.INFO) {
                setPopup({
                    type: POSITION_TYPE.INFO,
                    content: {
                        title: `Special Box - ${toTitle(nextType)}`,
                        text: content.info,
                    },
                });
            } else {
                const content = {
                    title: `Special Box - ${toTitle(nextType)}`,
                    text: POSITION_DESCRIPTIONS[nextType],
                };
                setPopup({ type: POSITION_TYPE.INFO, content });
            }
        }
    };

    const handleQuit = () => {
        setPosition(0);
        setCurrentMoves([]);
        setScore(0);
        setLastRoll(null);
        setPopup(null);
        setWon(false);
        setTransition(null);
        gameStateRef.current = null;

        setGameState(null);
        socket.disconnect();
        navigate("/");
    };

    const handleClosePopup = () => {
        setPopup(null);
        currentMoves[0] && takeStep(currentMoves[0]);
        if (position >= 90) handleQuit();
        setWon(false);
    };

    const handleSubmit = (option) => {
        setPopup(null);
        currentMoves[0] && takeStep(currentMoves[0]);
    };

    const level = position >= 60 ? 2 : position >= 30 ? 1 : 0;
    let realm = "NORMAL";
    if (level === 1) realm = "PUBLISHING_HOUSE";
    if (level === 2) realm = score >= 60 ? "HEAVEN" : "HELL";

    return (
        <div
            className="game-wrapper"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
                minHeight: "100vh",
                padding: "16px",
                boxSizing: "border-box",
                width: "100%",
            }}
        >
            <TransitionOverlay type={transition} />
            <div
                className="game-board"
                style={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    gap: 10,
                }}
            >
                <Board
                    playerPosition={position}
                    level={level}
                    realm={realm}
                    onPieceArrive={handlePieceArrive}
                />

                <GameControls
                    isCurrentTurn={true}
                    lastRoll={lastRoll}
                    points={score}
                    position={position}
                    onRoll={handleRoll}
                    onQuit={handleQuit}
                />

                <QuizPopup
                    open={popup?.type === POSITION_TYPE.CHALLENGE}
                    payload={popup?.content}
                    onClose={handleClosePopup}
                    onSubmit={handleSubmit}
                    handleScore={handleScore}
                />
                <InfoPopup
                    open={popup?.type === POSITION_TYPE.INFO}
                    payload={popup?.content}
                    onClose={handleClosePopup}
                />

                <Celebration show={won} />
            </div>

            {/* <GameControls
        isCurrentTurn={true}
        lastRoll={lastRoll}
        points={score}
        onRoll={(total) => handleRoll(total)}
        onQuit={handleQuit}
      /> */}

            {/* <QuizPopup
                open={popup?.type === POSITION_TYPE.CHALLENGE}
                payload={popup?.content}
                onClose={handleClosePopup}
                onSubmit={handleSubmit}
                handleScore={handleScore}
            />
            <InfoPopup
                open={popup?.type === POSITION_TYPE.INFO}
                payload={popup?.content}
                onClose={handleClosePopup}
            /> */}

            {/* <Celebration show={won} /> */}
        </div>
    );
}

export default Game;
