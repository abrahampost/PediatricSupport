let express = require("express"),
    router = express.Router(),
    userService = require("../services/user-service");

router.post('/login', async function (req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        verify = await userService.check_login(username, password);
        res.json({ token: verify });
    } catch (e) {
        next(e);
    }
});

router.post('/signup', async function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let type = req.body.type;
    let lastName = req.body.lastName;
    let firstName = req.body.firstName;
    userService.sign_up(username, password, lastName, firstName, email, type).then(status => {
        res.sendStatus(status);
    }).catch(e => {
        next(e);
    });
});

module.exports = router;