let express = require("express"),
    router = express.Router(),
    matchService = require("../services/match-service");

router.get("/", async function(req, res, next) {
    try {
        let userId = req.decoded.id;
        let matches = await matchService.getMatches(userId);
        let potentialMatches = await matchService.getPotentialMatches(userId);
        res.json({matches, potentialMatches });
    } catch(e) {
        next(e);
    }
});

router.post("/", async function(req, res, next) {
    try {
        let sendingId = req.decoded.id;
        let receivingId = req.body.receivingdId;
        let resultStatus = await matchService.createMatch(sendingId, receivingId);
        res.sendStatus(resultStatus);
    } catch(e) {
        next(e);
    }
});

router.put("/matches/:id", async function(req, res, next) {
    try {
        let matchId = req.params.id;
        let matchType = req.body.matchType;
        let resultStatus = await matchService.updateMatchType(matchId, matchType);
        res.sendStatus(resultStatus);
    } catch(e) {
        next(e);
    }
});

router.delete("/matches/:id", async function(req, res, next) {
    try {
        let matchId = req.params.id;
        let resultStatus = await matchService.deleteMatch(matchId);
        res.sendStatus(resultStatus);
    } catch(e) {
        next(e);
    }
});

module.exports = router;