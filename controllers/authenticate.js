let express = require("express"),
    router = express.Router(),
    userService = require("../services/user-service"),
    emailService = require("../services/email-service");

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

router.post('/signup', async function(req, res, next) {
    try {
        let username = userService.generateRandom();
        let password = userService.generateRandom();
        let email = req.body.email;
        let type = req.body.type;
        let lastName = req.body.lastName;
        let firstName = req.body.firstName;
        let status = await userService.signUp(username, password, lastName, firstName, email, type)
        await emailService.sendSignupEmail(username, email, password);
        res.sendStatus(status);
    } catch(e)  {
        next(e);
    }
});

module.exports = router;