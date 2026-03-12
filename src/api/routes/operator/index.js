const express = require("express");
const router = express.Router();
const exaController = require("../../controller/operator/index.js");
const verifySignature = require("../../middleware/index");

// Senin içeriden kullanacağın
router.get("/getList",    exaController.fetchGameList);

router.post("/authenticate", verifySignature, exaController.authenticate);
router.post("/bet",          verifySignature, exaController.bet);
router.post("/win",          verifySignature, exaController.win);
router.post("/rollback",     verifySignature, exaController.rollback);
router.post("/funds",        verifySignature, exaController.funds);
router.post("/game-close",   verifySignature, exaController.gameClose);

router.get("/ping", exaController.ping);

router.post("/launch", exaController.launchGame);

module.exports = router;
