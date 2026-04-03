const GameService = require("../services/game.service");
const { formatGameInfoForClientStore } = require("../utils/game.util");

const registerSocketControllers = (io, socket) => {
    socket.on("joinGame", async (data) => {
        const { gameId, playerUniqueId } = data;

        const game = await GameService.getGame({ gameId });

        if (!game) {
            socket.emit("error", { message: "Game Not Found" });
            return;
        }
        console.log("Data", data);
        const player = game.players.find(
            (p) => p.playerUniqueId === playerUniqueId
        );
        console.log("Player", player);
        if (!player) {
            socket.emit("error", { message: "Player Not Found" });
            return;
        }

        socket.join(gameId);
        socket.data = { gameId };

        console.log(game);
        io.to(gameId).emit("playerJoined", {
            playerUniqueId,
            gameInfo: formatGameInfoForClientStore(game),
        });

        console.log(`Player ${playerUniqueId} joined game ${gameId}`);
    });

    socket.on("roll", async ({ playerUniqueId }) => {
        try {
            // Just validations
            const { gameId } = socket.data;
            if (!gameId || !playerUniqueId) {
                socket.emit("error", { message: "Game Not Found" });
                return;
            }
            const game = await GameService.getGame({ gameId });
            if (!game) {
                socket.emit("error", { message: "Game Not Found" });
                return;
            }

            const player = game.players.find(
                (p) => p.playerUniqueId === playerUniqueId
            );
            if (!player) {
                socket.emit("error", { message: "Player Not Found" });
                return;
            }

            // To let other players in the room know that the current player is rolling
            io.to(gameId).emit("roll", { playerUniqueId });

            const result = await GameService.roll({
                playerUniqueId,
                gameId,
            });

            // Broadcast to everyone in the room the results of the roll (to move their pieces on the board)
            io.to(gameId).emit("roll-complete", result);
        } catch (error) {
            socket.emit("error", {
                message: error.message || "Internal Server Error",
            });
        }
    });
};

module.exports = { registerSocketControllers };
