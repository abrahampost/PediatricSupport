let express = require("express"),
    router = express.Router(),
    messageService = require("../services/message-service"),
    Filter = require("bad-words"),
    filter = new Filter();

router.get("/", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let time = req.query.time;  //optional param ?time=<>
    let lastPolled = new Date();
    let conversations;
    if (time) {
      conversations = await messageService.getAllMessagesSince(userId, time);
    } else {
      conversations = await messageService.getAllMessages(userId);
    }
    conversations = conversations.map((conversation) => {
      if (conversation.messages.length == 1 && conversation.messages[0] === null) {
        conversation.messages = [];
      }
      return conversation;
    });
    res.json({ conversations, lastPolled});
  } catch (e) {
    next(e);
  }
});

router.get("/:matchId", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let matchId = req.params.matchId;
    let time = req.query.time;  //optional param ?time=<>
    let lastPolled = new Date();
    let conversations;
    if (time) {
      conversations = await messageService.getMessagesFromMatchSince(userId, matchId, time);
    } else {
      conversations = await messageService.getMessagesFromMatch(userId, matchId);
    }
    conversations = conversations.map((conversation) => {
      if (conversation.messages.length == 1 && conversation.messages[0] === null) {
        conversation.messages = [];
      }
      return conversation;
    })
    res.json({ conversations, lastPolled });
  } catch (e) {
    next(e);
  }
});

router.post("/:matchId", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let matchId = req.params.matchId;
    let content = filter.clean(req.body.content);
    let createdAt = new Date();
    await messageService.createMessage(userId, matchId, content);
    res.json({ message: { content, createdAt, sender: req.decoded.id } });
  } catch (e) {
    next(e);
  } 
})

module.exports = router;