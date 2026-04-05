const GameService = require("../services/game.service");
const { CustomError } = require("../utils/CustomError");
const { formatGameInfoForClientStore } = require("../utils/game.util");

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
        try {
            // Just validations
            const { gameId } = socket.data;
            const { game, player } = await GameService.validateGamePlayer({
                gameId,
                playerUniqueId,
            });

            if (playerUniqueId !== game.turnPlayerId) {
                socket.emit("error", { message: "Not Your Turn" });
                return;
            }

            // To let other players in the room know that the current player is rolling
            io.to(gameId).emit("roll-start", { playerUniqueId });
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
            socket.emit("error", {
                message: error.message || "Internal Server Error",
            });
        }
    });

    socket.on("check-answer", async ({ playerUniqueId, quizId, answer }) => {
        try {
            const { gameId } = socket.data;
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

            // Updated scores will be here
            const updatedGame = await GameService.getGame({ gameId });

            io.to(gameId).emit("answer-complete", {
                isCorrect,
                playerUniqueId,
                gameInfo: formatGameInfoForClientStore(updatedGame),
            });
        } catch (err) {
            console.log("[Socket Error]", err);
            socket.emit("error", {
                message: err.message || "Internal Server Error",
            });
        }
    });

    socket.on("request-roll-complete", async ({ playerUniqueId }) => {
        try {
            const { gameId } = socket.data;
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
            const { game: updatedGame } = await GameService.updateTurn({
                game,
                currentPlayerId,
            });

            // Emit roll-complete with gameInfo
            io.to(gameId).emit("roll-complete", {
                gameInfo: formatGameInfoForClientStore(updatedGame),
            });
        } catch (err) {
            console.log("[Socket Error]", err);
            socket.emit("error", {
                message: err.message || "Internal Server Error",
            });
        }
    });
};

module.exports = { registerSocketControllers };
