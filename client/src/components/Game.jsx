import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../App.css";
import * as R from "ramda";

import Board from "./Board";
import GameControls from "./GameControls";
// import TransitionOverlay from "./TransitionOverlay";
import {
    POPUP_TYPE,
    POSITION_DESCRIPTIONS,
    POSITION_TYPE,
    LEVEL_MESSAGES,
    LEVEL_MARKER,
} from "../constants";
// import { useLocalStorage } from "@uidotdev/usehooks";
import QuizPopup from "./popups/QuizPopup";
import InfoPopup from "./popups/InfoPopup";
import { toTitle } from "../utils";
import Celebration from "./popups/Celebration";
import { socket } from "../socket";
import { toast } from "react-toastify";
// import useLocalStorage from "../hooks/useLocalStorage";
import { findPlayer, isGameOver, updatePlayerPos } from "../utils/common.utils";
import { BoxIcon } from "./icons/BoxIcon";
import InstructionPopup from "./popups/InstructionPopup";
import GameOverPopup from "./popups/GameOverPopup";
import SpecialBoxPopup from "./popups/SpecialBoxPopup";
import LevelIntroPopup from "./popups/LevelIntroPopup";

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

    // Bit redundant here, but we will differentiate state for instruction (inert) popup and in-game popups
    const [popup, setPopup] = useState(null);
    const [openInstruct, setOpenInstruct] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    // Level Intro Popups State
    const [shownLevelIntros, setShownLevelIntros] = useState([]);
    const [levelIntroPopup, setLevelIntroPopup] = useState(null);
    const [pendingTilePopup, setPendingTilePopup] = useState(null);

    useEffect(() => {
        if (gameState && !openInstruct && !shownLevelIntros.includes(0)) {
            setLevelIntroPopup({
                level: 0,
                message: LEVEL_MESSAGES[0],
            });
            setShownLevelIntros((prev) => [...prev, 0]);
        }
    }, [gameState, openInstruct]);

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

            if (isGameOver(updatedGameInfo)) setGameOver(true);

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

    // useEffect(() => {
    //     const { gameInfo } = gameState || {};
    //     if (gameInfo && isGameOver(gameInfo)) setGameOver(true);
    // }, [gameState]);

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

        if (pos >= 90) return setGameOver(true);

        if (movingPlayerId !== playerUniqueId) {
            return queueNextMove();
        }

        // For level intro popup
        const prevPos = currentMoves[0]?.current || 0;
        let isTransition = false;
        if (
            prevPos <= LEVEL_MARKER.LEVEL_0_END &&
            pos > LEVEL_MARKER.LEVEL_0_END &&
            !shownLevelIntros.includes(1)
        ) {
            setLevelIntroPopup({
                level: 1,
                message: LEVEL_MESSAGES[1],
            });
            setShownLevelIntros((prev) => [...prev, 1]);
            isTransition = true;
        } else if (
            prevPos <= LEVEL_MARKER.LEVEL_1_END &&
            pos > LEVEL_MARKER.LEVEL_1_END &&
            !shownLevelIntros.includes(2)
        ) {
            setLevelIntroPopup({
                level: 2,
                message: LEVEL_MESSAGES[2],
            });
            setShownLevelIntros((prev) => [...prev, 2]);
            isTransition = true;
        }

        // Next stage (quiz popup or next move)
        if (pos == 0 || isActive === false) {
            queueNextMove();
        } else if (pos === next) {
            let nextPopupData = null;
            if (nextType === POSITION_TYPE.CHALLENGE) {
                const { quiz } = content;
                nextPopupData = { type: POPUP_TYPE.QUIZ, content: quiz };
            } else if (nextType === POSITION_TYPE.INFO) {
                const { info } = content;
                nextPopupData = {
                    type: POPUP_TYPE.INFO,
                    content: {
                        title: (
                            <div>
                                Special Box{" "}
                                <BoxIcon number={pos} type={nextType} /> -{" "}
                                {toTitle(nextType)}
                            </div>
                        ),
                        info,
                    },
                };
            } else {
                const contentData = {
                    title: (
                        <div>
                            Special Box <BoxIcon number={pos} type={nextType} />{" "}
                            - {toTitle(nextType)}
                        </div>
                    ),
                    text: POSITION_DESCRIPTIONS[nextType],
                };
                nextPopupData = {
                    type: POPUP_TYPE.SPECIAL,
                    content: contentData,
                };
            }

            if (isTransition) {
                setPendingTilePopup(nextPopupData);
            } else {
                setPopup(nextPopupData);
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
        setGameOver(false);
        socket.disconnect();
        setGameState(null);
        navigate("/");
    };

    if (!gameState) {
        return <div>Loading game...</div>;
    }

    return (
        <div className="game-wrapper">
            <div
                className="game-board"
                style={{
                    // width: "100%",
                    display: "flex",
                    gap: 10,
                    paddingTop: 10,
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
                    setOpenInstruct={setOpenInstruct}
                    gameState={gameState}
                    setGameState={setGameState}
                />
                {/* Interactive popups */}
                <QuizPopup
                    open={popup?.type === POPUP_TYPE.QUIZ}
                    payload={popup?.content}
                    onClose={handleCloseQuizPopup}
                    gameState={gameState}
                    setGameState={setGameState}
                />
                <InfoPopup
                    open={popup?.type === POPUP_TYPE.INFO}
                    payload={popup?.content}
                    onClose={handleCloseInfoPopup}
                />
                <SpecialBoxPopup
                    open={popup?.type === POPUP_TYPE.SPECIAL}
                    payload={popup?.content}
                    onClose={handleCloseInfoPopup} // Same handler reused
                />

                {/* Default popups */}
                <LevelIntroPopup
                    open={Boolean(levelIntroPopup)}
                    level={levelIntroPopup?.level}
                    message={levelIntroPopup?.message}
                    onClose={() => {
                        setLevelIntroPopup(null);
                        if (pendingTilePopup) {
                            setPopup(pendingTilePopup);
                            setPendingTilePopup(null);
                        }
                    }}
                />
                <InstructionPopup
                    open={openInstruct}
                    onClose={() => setOpenInstruct(false)}
                />
                <GameOverPopup
                    open={gameOver}
                    gameState={gameState}
                    onClose={() => {
                        setPopup(null);
                        handleQuit();
                    }}
                />
                <Celebration show={gameOver} gameState={gameState} />
            </div>
        </div>
    );
}

export default Game;
