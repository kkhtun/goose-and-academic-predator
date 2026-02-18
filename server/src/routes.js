const router = require("express").Router();
const GameController = require("./controllers/game.controller");

router.post("/game/start", GameController.startGame);
// router.get("/game/mcq-topics", GameController.getTopics);
// router.get("/game/random-quiz", GameController.getQuiz);
// router.post("/game/generate-mcq-batch", GameController.generateMcqBatch);

router.get("/game/board-positions", GameController.getBoardPositions);

router.post("/game/:gameId/roll", GameController.roll);
router.post("/game/:gameId/check-answer", GameController.answerQuiz);

module.exports = { router };
