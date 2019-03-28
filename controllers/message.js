let express = require("express"),
    router = express.Router(),
    messageService = require("../services/message-service"),
    Filter = require("bad-words"),
    filter = new Filter(),
    BadRequestExeption = require("../exceptions/bad-request-exception");

router.get("/", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let time = req.query.time;  //optional param ?time=<>
    let results;
    if (time) {
      results = await messageService.getAllMessagesSince(userId, time);
    } else {
      results = await messageService.getAllMessages(userId);
    }
    let conversations;
    if (results[0].conversations) {
      conversations = results[0].conversations.map((conversation) => {
        if (conversation.messages.length == 1 && conversation.messages[0] === null) {
          conversation.messages = [];
        }
        return {
          id: conversation.id,
          username: conversation.username,
          messages: conversation.messages
        };
      })
    } else {
      conversations = [];
    }
    let lastPolled = results[0].mostrecent;
    res.json({ conversations, lastPolled });
  } catch (e) {
    next(e);
  }
});

router.post("/:matchId", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let matchId = req.params.matchId;
    let content = req.body.content;
    if (content) {
      content = filter.clean(req.body.content);
    } else {
      throw new BadRequestExeption("")
    }
    await messageService.createMessage(userId, matchId, content);
    res.sendStatus(201);
  } catch (e) {
    next(e);
  } 
})

module.exports = router;