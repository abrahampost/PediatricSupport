let express = require("express"),
    router  = express.Router(),
    User    = require("../models/user");

router.post('/login', async function(req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        verify = await User.check_login(username, password);
        if (verify) {
            res.json({token: verify});
        } else {
            res.status(401).send("Incorrect username and password combination")
        }
    } catch (e) {
        res.status(401).send("Incorrect username and password combination")
    }
});

router.post('/signup', async function(req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let lastName = req.body.lastName;
        let firstName = req.body.firstName;
        let status = await User.sign_up(username, password, lastName, firstName);
        res.sendStatus(status);
    } catch (e) {
        res.sendStatus(400);
    }
});

module.exports = router;