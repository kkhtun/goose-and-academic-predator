const GameService = require("../services/game.service");
const Joi = require("joi");

module.exports = {
    startGame: async (req, res, next) => {
        try {
            const result = await GameService.startGame(req.body || {});
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    roll: async (req, res, next) => {
        try {
            const result = await GameService.roll();
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    getTopics: async (req, res, next) => {
        try {
            const result = await GameService.getTopics();
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    getQuiz: async (req, res, next) => {
        const quizSchema = Joi.object({
            topic: Joi.string(),
            difficulty: Joi.string().valid("easy", "medium", "hard"),
        });
        const { error, value } = quizSchema.validate(req.query);
        if (error) return next(error);

        try {
            const result = await GameService.getQuiz(value);
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    generateMcqBatch: async (req, res, next) => {
        try {
            const result = await GameService.generateMcqBatch(req.body || {});
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },
};
