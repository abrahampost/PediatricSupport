let express = require("express"),
    router = express.Router(),
    userService = require("../services/user-service");

router.post('/login', async function (req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        jsonResponse = await userService.checkLogin(username, password);
        res.json(jsonResponse);
    } catch (e) {
        next(e);
    }
});

module.exports = router;