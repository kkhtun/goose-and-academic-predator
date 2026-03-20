const GameService = require("../services/game.service");
const QuizService = require("../services/quiz.service");
const Joi = require("joi");
const {
    BOARD_POSITIONS,
    POSITION_TYPE,
    POSITION_DESCRIPTIONS,
} = require("../utils/game.util");

module.exports = {
    startGame: async (req, res, next) => {
        const schema = Joi.object({
            initialPlayerName: Joi.string().required(),
        });
        const { error, value } = schema.validate(req.body || {});
        if (error) return next(error);

        try {
            const result = await GameService.startGame(value);
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    roll: async (req, res, next) => {
        const schema = Joi.object({
            gameId: Joi.string().required(),
            playerUniqueId: Joi.string().required(),
        });
        const { error, value } = schema.validate({
            ...req.params,
            ...req.body,
        });
        if (error) return next(error);

        try {
            const result = await GameService.roll(value);
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    answerQuiz: async (req, res, next) => {
        const schema = Joi.object({
            gameId: Joi.string().required(),
            playerUniqueId: Joi.string().required(),
            quizId: Joi.string().required(),
            answer: Joi.any().required(), // could be string, boolean or an array of words
        });
        const { error, value } = schema.validate({
            ...req.params,
            ...req.body,
        });
        if (error) return next(error);

        try {
            const result = await GameService.answerQuiz(value);
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    getBoardPositions: async (req, res, next) => {
        return res
            .status(200)
            .send({ POSITION_TYPE, POSITION_DESCRIPTIONS, BOARD_POSITIONS });
    },

    // Other apis
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

    // generateMcqBatch: async (req, res, next) => {
    //     try {
    //         const result = await GameService.generateMcqBatch(req.body || {});
    //         return res.status(200).send(result);
    //     } catch (error) {
    //         return next(error);
    //     }
    // },

    // Single quiz generators
    generateCrossword: async (req, res, next) => {
        try {
            const result = await QuizService.generateCrossword(req.body || {});
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    generateMcq: async (req, res, next) => {
        try {
            const result = await QuizService.generateMcq(req.body || {});
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    generateTrueFalse: async (req, res, next) => {
        try {
            const result = await QuizService.generateTrueFalse(req.body || {});
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    generateRandomQuiz: async (req, res, next) => {
        try {
            // Now only crossword
            const result = await QuizService.getRandomQuiz(req.body || {});
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },
};
