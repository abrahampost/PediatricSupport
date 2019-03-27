let express = require("express"),
    router  = express.Router();

router.use("/authenticate", require("./authenticate"));
router.use("/matches", require("./match"));
router.use("/users", require("./user"));
router.use("/attributes", require("./attribute"));
router.use("/reports", require("./user-report"));

module.exports = router;