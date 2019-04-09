let express = require("express"),
    router = express.Router(),
    attributeService = require("../services/attribute-service"),
    permissions = require("../middleware/permissions");

router.post('/', permissions.ADMIN, async function(req, res, next) {
    try {
        let name = req.body.name;
        let type = req.body.type;

        await attributeService.createAttribute(name, type);

        res.sendStatus(201);
    } catch(e)  {
        next(e);
    }
});

router.get('/', async function(req, res, next) {
    try {
        let type = req.query.type;

        let attributes = await attributeService.getAttributes(type);
        res.json(attributes);
    } catch(e) {
        next(e);
    }
});

module.exports = router;