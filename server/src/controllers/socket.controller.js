const GameService = require("../services/game.service");
const { CustomError } = require("../utils/CustomError");
const { formatGameInfoForClientStore } = require("../utils/game.util");

// Socket helpers

// Main socket handlers
const registerSocketControllers = (io, socket) => {
    socket.on("joinGame", async (data) => {
        const { gameId, playerUniqueId } = data;
        const { game, player } = await GameService.validateGamePlayer({
            gameId,
            playerUniqueId,
        });

        socket.join(gameId);
        socket.data = { gameId };

        io.to(gameId).emit("playerJoined", {
            playerUniqueId,
            gameInfo: formatGameInfoForClientStore(game),
        });

        console.log(
            `Player ${playerUniqueId}: ${player.playerName} joined game ${gameId}`
        );
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
            const { game, quiz } = await GameService.prevalidateAnswerQuiz({
                gameId,
                playerUniqueId,
                quizId,
            });

            const { isCorrect } = await GameService.answerQuiz({
                game,
                quiz,
                answer,
                playerUniqueId,
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
};

module.exports = { registerSocketControllers };
