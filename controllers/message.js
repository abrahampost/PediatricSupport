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
      // if it found conversations, normalize the data
      conversations = results[0].conversations.map((conversation) => {
        if (conversation.messages.length == 1 && conversation.messages[0] === null) {
          // aggregate function will return an array with a single null value if nothing found
          conversation.messages = [];
        }
        return {
          id: conversation.id,
          username: conversation.username,
          messages: conversation.messages
        };
      })
    } else {
      //if no conversations found, send an empty array
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
      // if the message has content, filter out bad words
      content = filter.clean(req.body.content);
    } else {
      //if content is empty or missing, is bad request
      throw new BadRequestExeption("Malformed message content.")
    }
    await messageService.createMessage(userId, matchId, content);
    res.sendStatus(201);
  } catch (e) {
    next(e);
  } 
})

module.exports = router;