const router = require("express").Router();
const GameController = require("./controllers/game.controller");

router.get("/game/roll", GameController.roll);

module.exports = { router };
