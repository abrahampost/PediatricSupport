let express = require("express"),
    router  = express.Router();

router.post('/login', function(req, res) {
    res.send("Login route");
});

router.post('/signup', function(req, res) {
    res.send("Signup route")
});

module.exports = router;