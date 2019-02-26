let express = require("express"),
    router = express.Router(),
    matchService = require("../services/match-service");

router.get("/", async function(req, res) {
    let userId = req.decoded.id;
    let results = await matchService.getMatches(userId);
    res.send(results);
});

router.post("/", async function(req, res) {
    let sendingId = req.decoded.id;
    let receivingId = req.body.receivingdId;
    let resultStatus = await matchService.createMatch(sendingId, receivingId);
    res.sendStatus(resultStatus);
});

router.put("/matches/:id", async function(req, res) {
    let matchId = req.params.id;
    let matchType = req.body.matchType;
    let resultStatus = await matchService.updateMatchType(matchId, matchType);
    res.sendStatus(resultStatus);
});

router.delete("/matches/:id", async function(req, res) {
    let matchId = req.params.id;
    let resultStatus = await matchService.deleteMatch(matchId);
    res.sendStatus(resultStatus);
});

module.exports = router;