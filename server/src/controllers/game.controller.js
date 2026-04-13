const GameService = require("../services/game.service");
const QuizService = require("../services/quiz.service");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const {
    BOARD_POSITIONS,
    POSITION_TYPE,
    POSITION_DESCRIPTIONS,
} = require("../utils/game.util");

module.exports = {
    startGame: async (req, res, next) => {
        const schema = Joi.object({
            playerName: Joi.string().required(),
            avatar: Joi.string().required(),
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

    addPlayer: async (req, res, next) => {
        const schema = Joi.object({
            gameId: Joi.objectId().required().messages({
                "string.pattern.base": "Invalid Game ID",
                "string.pattern.name": "Invalid Game ID",
                "any.required": "Game ID is required",
                "string.empty": "Game ID cannot be empty",
            }),
            playerName: Joi.string().required(),
            avatar: Joi.string().required(),
        });
        const { error, value } = schema.validate(req.body || {});
        if (error) return next(error);

        try {
            const result = await GameService.addPlayer(value);
            return res.status(200).send(result);
        } catch (error) {
            return next(error);
        }
    },

    // Other apis
    getBoardPositions: async (req, res, next) => {
        return res
            .status(200)
            .send({ POSITION_TYPE, POSITION_DESCRIPTIONS, BOARD_POSITIONS });
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
