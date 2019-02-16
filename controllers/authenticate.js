let express = require("express"),
    router = express.Router(),
    userService = require("../services/user-service");

router.post('/login', async function (req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        verify = await userService.check_login(username, password);
        if (verify) {
            res.json({ token: verify });
        } else {
            res.status(401).send({ error: "Incorrect username and password combination" })
        }
    } catch (e) {
        res.status(401).send({ error: "Incorrect username and password combination" })
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