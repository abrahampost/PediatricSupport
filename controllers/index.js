let express = require("express"),
    router  = express.Router();

router.use("/authenticate", require("./authenticate"));
router.use("/matches", require("./match"));
router.use("/users", require("./user"));

module.exports = router;