let express = require("express"),
    router = express.Router(),
    messageService = require("../services/message-service");

router.get("/", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let conversations = await messageService.getAllMessages(userId);
    res.json(conversations);
  } catch (e) {
    next(e);
  }
});

module.exports = router;