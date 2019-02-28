let express = require("express"),
    router = express.Router(),
    attributeService = require("../services/attribute-service");

router.post('/', async function(req, res, next) {
    try {
        let name = req.body.name;
        let type = req.body.type;

        await attributeService.createAttribute(name, type);

        res.sendStatus(201);
    } catch(e)  {
        next(e);
    }
});

module.exports = router;