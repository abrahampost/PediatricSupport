let express = require("express"),
    router  = express.Router();

router.use("/authenticate", require("./authenticate"));

module.exports = router;