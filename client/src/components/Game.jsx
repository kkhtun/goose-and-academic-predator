import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../App.css";
import * as R from "ramda";

import Board from "./Board";
import GameControls from "./GameControls";
// import TransitionOverlay from "./TransitionOverlay";
import { POSITION_DESCRIPTIONS, POSITION_TYPE } from "../constants";
// import { useLocalStorage } from "@uidotdev/usehooks";
import QuizPopup from "./popups/QuizPopup";
import InfoPopup from "./popups/InfoPopup";
import { toTitle } from "../utils";
import Celebration from "./popups/Celebration";
import { socket } from "../socket";
import { toast } from "react-toastify";
// import useLocalStorage from "../hooks/useLocalStorage";
import { findPlayer, updatePlayerPos } from "../utils/common.utils";
import { BoxIcon } from "./icons/BoxIcon";

function Game() {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [searchParams] = useSearchParams();
    const playerUniqueId = searchParams.get("playerUniqueId");

    // const [gameState, setGameState] = useLocalStorage("GAME_STATE", null);
    const [gameState, setGameState] = useState(null);

    // A roll includes all dice throws, popups and answerings
    // These states (rollingPlayerId and currentMoves) are only concerned with moving the piece on board and calling correct events
    // Not involved with turn synchronization or validation
    const [rollingPlayerId, setRollingPlayerId] = useState(null);
    const [currentMoves, setCurrentMoves] = useState([]);

    const [lastRoll, setLastRoll] = useState(null);
    const [popup, setPopup] = useState(null);
    const [won, setWon] = useState(false);

    // SocketIO
    useEffect(() => {
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
            toast.info(
                `${findPlayer(updatedGameInfo, joinedPlayerId).playerName} has joined the game.`,
            );
        };

        const handleError = (err) => {
            console.error("[Socket error]:", err);
            const errMessage = err?.message || "Something went wrong";
            toast.error(errMessage, { toastId: errMessage });
        };

        const handleRollComplete = ({ gameInfo }) => {
            setGameState((prev) => ({ ...prev, gameInfo }));
        };

        const handlePlayerDisconnected = ({
            gameInfo,
            disconnectedPlayerId,
        }) => {
            console.log(disconnectedPlayerId);
            toast.info(
                `${findPlayer(gameInfo, disconnectedPlayerId).playerName} has disconnected.`,
            );
            setGameState((prev) => ({ ...prev, gameInfo }));
        };

        socket.on("connect", handleConnect);
        socket.on("playerJoined", handlePlayerJoined);
        socket.on("roll-complete", handleRollComplete);
        socket.on("playerDisconnected", handlePlayerDisconnected);
        socket.on("error", handleError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("playerJoined", handlePlayerJoined);
            socket.off("roll-complete", handleRollComplete);
            socket.off("playerDisconnected", handlePlayerDisconnected);
            socket.off("error", handleError);
            socket.disconnect();
        };
    }, [gameId, playerUniqueId]);

    const handleRoll = ({ roll, moves, gameInfo, rollingPlayerId }) => {
        const { total } = roll;
        // [BUG] We don't update gameInfo here, have some issues with path calculation
        // since playerPos comes precalcuated to final pos on backend
        setRollingPlayerId(rollingPlayerId);
        setLastRoll(total);
        setCurrentMoves(moves);
    };

    const checkRequestRollComplete = () => {
        // If no moves left, we can call roll-complete
        // Make sure this func is only called when player has nothing left to do such as popup closing
        if (currentMoves.length === 0) {
            socket.emit("request-roll-complete", { playerUniqueId });
            console.log(
                "Roll complete event requested by player " + playerUniqueId,
            );
        }
    };

    useEffect(() => {
        if (currentMoves.length === 0) {
            setRollingPlayerId(null);
        }
    }, [currentMoves]);

    useEffect(() => {
        if (!rollingPlayerId) return;
        if (rollingPlayerId === playerUniqueId && currentMoves.length === 0) {
            checkRequestRollComplete(); // Will only hit if rollingPlayer is the same as you (client)
            return;
        }
        if (currentMoves.length === 0) return;
        const move = currentMoves[0];
        const { current, next, steps } = move;
        const { gameInfo } = gameState; // This gameInfo is an old one (with old player pos)
        setGameState({
            gameInfo: updatePlayerPos(
                gameInfo,
                rollingPlayerId,
                current,
                next,
                steps, // We add step here since it can be from 87 to 89 and step is 4 (and not 2!)
            ),
            // gameInfo: updatePlayerPos(gameInfo, rollingPlayerId, next),
            playerUniqueId,
        });
    }, [currentMoves, rollingPlayerId]);

    // Could be multiple moves (such as Goose)
    // useEffect will trigger upon queueing updated move
    const queueNextMove = () => {
        setCurrentMoves((prevMoves) => {
            const updatedMoves = R.tail(prevMoves);
            return updatedMoves;
        });
    };

    const handlePieceArrive = (pos) => {
        const {
            playerUniqueId: movingPlayerId,
            next,
            nextType,
            content,
            isActive,
        } = currentMoves[0];

        if (movingPlayerId !== playerUniqueId) {
            return queueNextMove();
        }

        if (pos >= 90) {
            const endgame = {
                title: "Congratulations",
                text: "You have graduated the game!!! 🎓🎓🎓",
            };
            setWon(true);
            setPopup({ type: POSITION_TYPE.INFO, content: endgame });
        } else if (pos == 0 || isActive === false) {
            queueNextMove();
        } else if (pos === next) {
            if (nextType === POSITION_TYPE.CHALLENGE) {
                const { quiz } = content;
                setPopup({ type: POSITION_TYPE.CHALLENGE, content: quiz });
            } else if (nextType === POSITION_TYPE.INFO) {
                setPopup({
                    type: POSITION_TYPE.INFO,
                    content: {
                        title: (
                            <div>
                                Special Box{" "}
                                <BoxIcon number={pos} type={nextType} /> -{" "}
                                {toTitle(nextType)}
                            </div>
                        ),
                        text: content.info,
                    },
                });
            } else {
                const content = {
                    title: (
                        <div>
                            Special Box <BoxIcon number={pos} type={nextType} />{" "}
                            - {toTitle(nextType)}
                        </div>
                    ),
                    text: POSITION_DESCRIPTIONS[nextType],
                };
                setPopup({ type: POSITION_TYPE.INFO, content });
            }
        }
    };

    const handleCloseQuizPopup = () => {
        setPopup(null);
        queueNextMove();
    };

    const handleCloseInfoPopup = () => {
        // Could have further moves (such as Goose)
        setPopup(null);
        queueNextMove();
    };

    const handleQuit = () => {
        setCurrentMoves([]);
        setLastRoll(null);
        setPopup(null);
        setWon(false);
        socket.disconnect();
        setGameState(null);
        navigate("/");
    };

    if (!gameState) {
        return <div>Loading game...</div>;
    }

    return (
        <div
            className="game-wrapper"
            style={{
                padding: 10,
            }}
        >
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
                    onPieceArrive={handlePieceArrive}
                    gameState={gameState}
                    setGameState={setGameState}
                />

                <GameControls
                    isCurrentTurn={true}
                    lastRoll={lastRoll}
                    onRoll={handleRoll}
                    onQuit={handleQuit}
                    gameState={gameState}
                    setGameState={setGameState}
                />

                <QuizPopup
                    open={popup?.type === POSITION_TYPE.CHALLENGE}
                    payload={popup?.content}
                    onClose={handleCloseQuizPopup}
                    gameState={gameState}
                    setGameState={setGameState}
                />
                <InfoPopup
                    open={popup?.type === POSITION_TYPE.INFO}
                    payload={popup?.content}
                    onClose={handleCloseInfoPopup}
                />

                <Celebration show={won} />
            </div>
        </div>
    );
}

export default Game;
