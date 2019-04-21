let express = require("express"),
    router = express.Router(),
    messageService = require("../services/message-service"),
    avatarService = require("../services/avatar-service");

router.get("/", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let time = req.query.time;  //optional param ?time=<>
    let results, avatar;
    if (time) {
      results = await messageService.getAllMessagesSince(userId, time);
    } else {
      results = await messageService.getAllMessages(userId);
      //only retrieve the requesting users avatar on the first query
      avatar = await avatarService.getAvatar(userId);
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
          avatar: conversation.avatar,
          messages: conversation.messages
        };
      })
    } else {
      //if no conversations found, send an empty array
      conversations = [];
    }
    let lastPolled = results[0].mostrecent;
    res.json({ avatar, conversations, lastPolled });
  } catch (e) {
    next(e);
  }
});

router.post("/:matchId", async function(req, res, next) {
  try {
    let userId = req.decoded.id;
    let matchId = req.params.matchId;
    let content = req.body.content;
    await messageService.createMessage(userId, matchId, content);
    res.sendStatus(201);
  } catch (e) {
    next(e);
  } 
});

module.exports = router;