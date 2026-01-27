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

  getTopics: async (req, res, next) => {
    try {
      const result = await GameService.getTopics();
      return res.status(200).send(result);
    } catch (error) {
      return next(error);
    }
  },

  getQuiz: async (req, res, next) => {
    try {
      const result = await GameService.getQuiz(res.query);
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
