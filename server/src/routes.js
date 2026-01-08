const router = require("express").Router();
const GameController = require("./controllers/game.controller");

router.get("/game/roll", GameController.roll);
router.get("/game/generate-quiz", GameController.generateQuiz);

module.exports = { router };
