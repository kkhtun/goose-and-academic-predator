const GameService = require("../services/game.service");

module.exports = {
    roll: async (req, res, next) => {
        try {
            const result = GameService.roll();
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },
};
