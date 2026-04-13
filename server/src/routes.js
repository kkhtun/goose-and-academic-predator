const router = require("express").Router();
const GameController = require("./controllers/game.controller");

// router.get("/game/random-quiz", GameController.getQuiz);

router.post("/game/generate-crosswords", GameController.generateCrossword);
router.post("/game/generate-mcq", GameController.generateMcq);
router.post("/game/generate-true-false", GameController.generateTrueFalse);
router.post("/game/generate-random-quiz", GameController.generateRandomQuiz);

// router.post("/game/generate-mcq-batch", GameController.generateMcqBatch);

router.post("/game/start", GameController.startGame);
router.post("/game/add-player", GameController.addPlayer);
router.get("/game/board-positions", GameController.getBoardPositions);

module.exports = { router };
