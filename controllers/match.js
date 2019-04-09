let express = require("express"),
    router = express.Router(),
    matchService = require("../services/match-service"),
    permissions = require("../middleware/permissions");

router.get("/", permissions.PATIENT, async function(req, res, next) {
    try {
        let userId = req.decoded.id;
        let matches = await matchService.getMatches(userId);
        let potentialMatches = await matchService.getPotentialMatches(userId);
        res.json({matches, potentialMatches });
    } catch(e) {
        next(e);
    }
});

router.post("/", permissions.PATIENT, async function(req, res, next) {
    try {
        let sendingId = req.decoded.id;
        let receivingId = req.body.receivingId;
        await matchService.createMatch(sendingId, receivingId);
        res.sendStatus(201);
    } catch(e) {
        next(e);
    }
});

router.put("/:id", permissions.PATIENT, async function(req, res, next) {
    try {
        let matchId = req.params.id;
        let matchType = req.body.matchType;
        await matchService.updateMatchType(matchId, matchType);
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

router.delete("/:id", permissions.PATIENT, async function(req, res, next) {
    try {
        let matchId = req.params.id;
        await matchService.deleteMatch(matchId);
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

module.exports = router;