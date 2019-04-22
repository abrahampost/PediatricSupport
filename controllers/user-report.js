let express = require("express"),
    router = express.Router(),
    reportService = require("../services/report-service"),
    permissions = require("../middleware/permissions");

router.post('/', permissions.PATIENT, async function(req, res, next) {
    try {
        let reporterId = req.decoded.id;
        let reportedId = req.body.reportedId;
        let description = req.body.description;

        await reportService.createUserReport(reporterId, reportedId, description);

        res.sendStatus(201);
    } catch(e)  {
        next(e);
    }
});

router.get('/', permissions.ADMIN, async function(req, res, next) {
    try {
        let status = req.query.status;

        let reports = await reportService.getUserReports(status);
        res.json(reports);
    } catch(e) {
        next(e);
    }
});

router.put('/:id', permissions.ADMIN, async function(req, res, next) {
    try {
        let reportId = req.params.id;
        let status = req.body.status;

        await reportService.updateUserReport(reportId, status);
        res.sendStatus(200);
    } catch(e) {
        next(e);
    }
});

module.exports = router;