let express = require("express"),
    router = express.Router(),
    reportService = require("../services/report-service");

router.post('/', async function(req, res, next) {
    try {
        let reporterId = req.decoded.id;
        let reportedId = req.body.reportedId;

        await reportService.createUserReport(reporterId, reportedId);

        res.sendStatus(201);
    } catch(e)  {
        next(e);
    }
});

router.get('/', async function(req, res, next) {
    try {
        let status = req.query.status;

        let reports = await reportService.getUserReports(status);
        res.json(reports);
    } catch(e) {
        next(e);
    }
});

module.exports = router;