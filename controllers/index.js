let express = require("express"),
    router  = express.Router();

router.use("/authenticate", require("./authenticate"));
router.use("/matches", require("./match"));
router.use("/users", require("./user"));
router.use("/attributes", require("./attribute"));

module.exports = router;