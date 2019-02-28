let express = require("express"),
    router  = express.Router();

router.use("/authenticate", require("./authenticate"));
router.use("/users", require("./user"));
router.use("/attributes", require("./attribute"));

module.exports = router;