const R = require("ramda");
const GameService = require("../services/game.service");
const { CustomError } = require("../utils/CustomError");
const {
    formatGameInfoForClientStore,
    findPlayer,
} = require("../utils/game.util");

// Socket helpers
const disconnectTimers = new Map();

// Main socket handlers
const registerSocketControllers = (io, socket) => {
    socket.on("joinGame", async (data) => {
        try {
            const { gameId, playerUniqueId } = data;
            const { player } = await GameService.validateGamePlayer({
                gameId,
                playerUniqueId,
            });

            let game = await GameService.activatePlayer(
                gameId,
                playerUniqueId,
                true
            );

            socket.join(gameId);
            socket.data = { gameId, playerUniqueId };

            // We will give the player the dice if they are the only player active when they join
            const activePlayers = R.filter(R.propEq(true, "isActive"))(
                game.players
            );
            if (
                activePlayers.length === 1 &&
                activePlayers[0].playerUniqueId === playerUniqueId
            ) {
                game = await GameService.lockRolling(gameId, false);
                game = await GameService.updateTurn({
                    game,
                    currentPlayerId: playerUniqueId,
                });
            }

            io.to(gameId).emit("playerJoined", {
                playerUniqueId,
                gameInfo: formatGameInfoForClientStore(game),
            });

            console.log(
                `Player ${playerUniqueId}: ${player.playerName} joined game ${gameId}`
            );
        } catch (err) {
            console.log("[Socket Error]", err);
            socket.emit("error", {
                message: err.message || "Internal Server Error",
            });
        }
    });

    socket.on("roll-start", async ({ playerUniqueId }) => {
        const { gameId } = socket.data;

        try {
            // Just validations
            let { game, player } = await GameService.validateGamePlayer({
                gameId,
                playerUniqueId,
            });

            if (playerUniqueId !== game.turnPlayerId) {
                socket.emit("error", { message: "Not your turn!" });
                return;
            }

            if (await GameService.checkIsLocked(gameId)) {
                socket.emit("error", {
                    message: "A player is current rolling!",
                });
                return;
            }
            game = await GameService.lockRolling(gameId, true);

            // To let other players in the room know that the current player is rolling
            io.to(gameId).emit("roll-start", {
                playerUniqueId,
                gameInfo: formatGameInfoForClientStore(game),
            });
            console.log("Event roll-start emitted for player ", playerUniqueId);

            const result = await GameService.roll({ game, player });

            // Broadcast to everyone in the room the results of the roll (to move their pieces on the board)
            io.to(gameId).emit("roll-result", result);
            console.log(
                "Event roll-result emitted for player to room ",
                playerUniqueId
            );
        } catch (error) {
            console.log("[Socket Error]", error);
            await GameService.lockRolling(gameId, false);
            socket.emit("error", {
                message: error.message || "Internal Server Error",
            });
        }
    });

    socket.on("check-answer", async ({ playerUniqueId, quizId, answer }) => {
        const { gameId } = socket.data;

        try {
            const { game, quiz, player, move } =
                await GameService.prevalidateAnswerQuiz({
                    gameId,
                    playerUniqueId,
                    quizId,
                });

            const { isCorrect } = await GameService.answerQuiz({
                game,
                quiz,
                answer,
                player,
                move,
            });

            await GameService.lockRolling(gameId, true);

            // Updated scores will be here
            const updatedGame = await GameService.getGame({ gameId });

            io.to(gameId).emit("answer-complete", {
                isCorrect,
                playerUniqueId,
                gameInfo: formatGameInfoForClientStore(updatedGame),
            });
        } catch (err) {
            console.log("[Socket Error]", err);
            await GameService.lockRolling(gameId, false);
            socket.emit("error", {
                message: err.message || "Internal Server Error",
            });
        }
    });

    socket.on("request-roll-complete", async ({ playerUniqueId }) => {
        const { gameId } = socket.data;

        try {
            const { game } = await GameService.validateGamePlayer({
                gameId,
                playerUniqueId,
            });

            // Only current player can request roll complete
            const currentPlayerId =
                game.moves[game.moves.length - 1].playerUniqueId;
            if (currentPlayerId !== playerUniqueId)
                throw new CustomError("Invalid request for roll-complete");

            // Check player has completed the roll (currently only challenge box types will need follow up)
            // All other boxes will have been calculated and communicated to frontend on roll-result call

            // Update turn
            await GameService.updateTurn({
                game,
                currentPlayerId,
            });

            // Unlock roll
            const updatedGame = await GameService.lockRolling(gameId, false);

            // Emit roll-complete with gameInfo
            io.to(gameId).emit("roll-complete", {
                gameInfo: formatGameInfoForClientStore(updatedGame),
            });
        } catch (err) {
            console.log("[Socket Error]", err);
            await GameService.lockRolling(gameId, false);
            socket.emit("error", {
                message: err.message || "Internal Server Error",
            });
        }
    });

    // Quitting (assume player no longer wants to play)
    // Currently, FE will just disconnect on quit (see below)

    // socket.on("request-quit", async () => {
    //     const { gameId, playerUniqueId } = socket.data;
    //     const game = await GameService.quitPlayer({
    //         gameId,
    //         playerUniqueId,
    //     });

    //     io.to(gameId).emit("playerDisconnected", {
    //         disconnectedPlayerId: playerUniqueId,
    //         gameInfo: formatGameInfoForClientStore(game),
    //     });
    // });

    // Disconnecting (due to refresh or browser issues, handle with grace period)
    socket.on("disconnect", async () => {
        const { gameId, playerUniqueId } = socket.data;
        console.log(
            `[Socket Event] User disconnected: ${socket.id} ${gameId}:${playerUniqueId}`
        );

        await GameService.validateGamePlayer({ gameId, playerUniqueId });
        await GameService.activatePlayer(gameId, playerUniqueId, false);

        const key = `${gameId}:${playerUniqueId}`;
        // Clear any existing timer first
        if (disconnectTimers.has(key)) {
            clearTimeout(disconnectTimers.get(key));
        }

        // Set a timeout of 5s for any disconnecting players
        // After that, send an event to all other players that the player has disconnected
        const timeoutId = setTimeout(async () => {
            let game = await GameService.getGame({ gameId });
            const player = findPlayer(game, playerUniqueId);

            if (player && !player.isActive) {
                // In the case where disconnecting player is the current player
                // We unlock the game and update turn and continue the game with active players
                if (game.turnPlayerId === playerUniqueId) {
                    await GameService.lockRolling(gameId, false);
                    game = await GameService.updateTurn({
                        game,
                        currentPlayerId: playerUniqueId,
                    });
                }

                io.to(gameId).emit("playerDisconnected", {
                    disconnectedPlayerId: player.playerUniqueId,
                    gameInfo: formatGameInfoForClientStore(game),
                });
            }

            // cleanup
            disconnectTimers.delete(key);
        }, 5000);

        disconnectTimers.set(key, timeoutId);
    });
};

module.exports = { registerSocketControllers };
