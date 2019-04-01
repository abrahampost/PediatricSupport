const Sequelize = require("sequelize"),
  sequelize = require("../db/sequelize"),
  Message = sequelize.message,
  Filter = require("bad-words"),
  filter = new Filter(),
  BadRequestExeption = require("../exceptions/bad-request-exception"),
  InternalErrorException = require("../exceptions/internal-error-exception");

exports.getAllMessages = async function (userId) {
  try {
    let results = await sequelize.query(`
    SELECT (select max("createdAt") from messages) as mostRecent, json_agg(conversations) as conversations
    from (
    select
      matches.id,
      users.username,
      json_agg( messages order by messages."createdAt" ) as "messages"
    from
      (
        select
          id,
          user_two_id as user_id
        from
          user_matches
        where
          user_one_id =:userId
          and type = 'matched'
      union select
          id,
          user_one_id as user_id
        from
          user_matches
        where
          user_two_id =:userId
          and type = 'matched'
      ) as matches
    left join users on
      matches.user_id = users.id
    left join messages on
      matches.id = messages."userMatchId"
    group by
      matches.id,
      users.username) conversations;
    `, {
        replacements: { userId: userId }, type: sequelize.QueryTypes.SELECT
      })
    return results;
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      let errorMessage = "The following values are invalid:";
      e.errors.forEach((error) => {
        errorMessage += `\n${error.path}: ${error.message}`;
      });
      throw new BadRequestException(errorMessage);
    }

    throw new InternalErrorException("Unable to retrieve user matches.");
  }
}

exports.getAllMessagesSince = async function (userId, time) {
  try {
    let results = await sequelize.query(`
    SELECT (select max("createdAt") from messages) as mostRecent, json_agg(conversations) as conversations 
    from
    (select
      matches.id,
      users.username,
      json_agg( messages order by messages."createdAt" ) as "messages"
    from
      (
        select
          id,
          user_two_id as user_id
        from
          user_matches
        where
          user_one_id =:userId
      union select
          id,
          user_one_id as user_id
        from
          user_matches
        where
          user_two_id =:userId
      ) as matches
    left join users on
      matches.user_id = users.id
    left join messages on
      matches.id = messages."userMatchId"
    where
      messages."createdAt" > :time
    group by
      matches.id,
      users.username) conversations;
    `, {
        replacements: { userId: userId, time: time }, type: sequelize.QueryTypes.SELECT
      })
    return results;
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      let errorMessage = "The following values are invalid:";
      e.errors.forEach((error) => {
        errorMessage += `\n${error.path}: ${error.message}`;
      });
      throw new BadRequestException(errorMessage);
    }

    throw new InternalErrorException("Unable to retrieve user messages.");
  }
}

exports.createMessage = async function (userId, matchId, content) {
  if (content) {
    // if the message has content, filter out bad words
    content = filter.clean(content);
  } else {
    //if content is empty or missing, is bad request
    throw new BadRequestExeption("Malformed message content.")
  }
  try {
    let newMessage = await Message.build({
      userMatchId: matchId,
      content: content,
      sender: userId
    });
    await newMessage.save();
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      let errorMessage = "The following values are invalid:";
      e.errors.forEach((error) => {
        errorMessage += `\n${error.path}: ${error.message}`;
      });
      throw new BadRequestException(errorMessage);
    }

    throw new InternalErrorException("Unable to create message.", e);
  }
}