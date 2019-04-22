process.env.NODE_ENV = "test";

const userService = require("../services/user-service"),
      matchService = require("../services/match-service"),
      messageService = require("../services/message-service"),
      User = require("../db/sequelize").user,
      Match = require("../db/sequelize").user_match,
      Message = require("../db/sequelize").message;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require('../app');
let assert = chai.assert;

chai.use(chaiHttp);

const patientOne = {
  username: 'patientOne',
  password: 'password',
  lastName: "patient",
  firstName: "Test",
  email: "notarealemail@gmail.com",
  type: "patient"
};

const patientTwo = {
  username: 'patientTwo',
  password: 'password',
  lastName: "patient",
  firstName: "Test",
  email: "anothernotarealemail@gmail.com",
  type: "patient"
};

const patientThree = {
  username: 'patientThree',
  password: 'password',
  lastName: "patient",
  firstName: "Test",
  email: "yetanothernotarealemail@gmail.com",
  type: "patient"
}

const admin = {
  username: 'testadmin',
  password: 'password',
  lastName: "Admin",
  firstName: "Test",
  email: "notarealemail1@gmail.com",
  type: "admin"
};

describe('Messaging', () => {
  beforeEach(async () => {
    await Match.destroy({where: {}});
    await Message.destroy({where: {}});
    await User.destroy({where: {}});
  })

  describe("/POST messages", async () => {
    var userOne, userTwo, matchId, token;
    beforeEach(async () => {
      await userService.signUp(patientOne.username, patientOne.password, patientOne.lastName, patientOne.firstName, patientOne.email, patientOne.type);
      await userService.signUp(patientTwo.username, patientTwo.password, patientTwo.lastName, patientTwo.firstName, patientTwo.email, patientTwo.type);
      let users = await User.findAll({
        where: {},
        attributes: ['id', 'username'],
        order: [['id', 'DESC']]
      });
      userOne = users[0];
      userTwo = users[1];
      await userService.createPatientInfo(users[0]);
      await userService.createPatientInfo(users[1]);
      await matchService.createMatch(userOne.id, userTwo.id);
      let match = await Match.findOne({
        where: {
          user_one_id: userOne.id,
          user_two_id: userTwo.id
        }
      });
      matchId = match.id;

      await matchService.updateMatchType(matchId, 'matched');
      let res = await chai.request(server)
        .post("/api/authenticate/login")
        .send({
          username: userOne.username,
          password: userOne.username === patientOne.username ? patientOne.password : patientTwo.password
        });
      token = res.body.token;
    });

    it("it should create a message", async () => {
      let content = "This is a test message";
      res = await chai.request(server)
            .post(`/api/messages/${matchId}`)
            .send({ content })
            .set('Authorization', token)
      res.should.have.status(201);
      let foundMessage = await Message.findAll({
        where: {
          userMatchId: matchId 
        }
      });
      foundMessage.should.have.length(1);
      foundMessage[0].should.have.property('content');
      foundMessage[0].content.should.be.eql(content);
    })
    it("it should create multiple messages", async () => {
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      let res;
      res = await chai.request(server)
            .post(`/api/messages/${matchId}`)
            .send({ content: messages[0] })
            .set('Authorization', token)
      res.should.have.status(201);
      res = await chai.request(server)
            .post(`/api/messages/${matchId}`)
            .send({ content: messages[1] })
            .set('Authorization', token)
      res.should.have.status(201);
      res = await chai.request(server)
            .post(`/api/messages/${matchId}`)
            .send({ content: messages[2] })
            .set('Authorization', token)
      res.should.have.status(201);
      let foundMessages = await Message.findAll({
        where: {
          userMatchId: matchId 
        },
        order: [['createdAt', 'ASC']]
      });
      foundMessages.should.have.length(3);
      foundMessages[0].should.have.property('content');
      foundMessages[0].content.should.be.eql(messages[0]);
      foundMessages[1].should.have.property('content');
      foundMessages[1].content.should.be.eql(messages[1]);
      foundMessages[2].should.have.property('content');
      foundMessages[2].content.should.be.eql(messages[2]);
    });
    it("it should not allow a message with missing content", async () => {
      res = await chai.request(server)
            .post(`/api/messages/${matchId}`)
            .send({ })
            .set('Authorization', token)
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.error.should.be.eql("Malformed message content.");
      let foundMessage = await Message.findAll({
        where: {
          userMatchId: matchId 
        }
      });
      foundMessage.should.have.length(0);
    });
    it("it should not allow a zero length message", async () => {
      res = await chai.request(server)
              .post(`/api/messages/${matchId}`)
              .send({ content: '' })
              .set('Authorization', token)
        res.should.have.status(400);
        res.body.should.have.property('error');
        res.body.error.should.be.eql("Malformed message content.");
        let foundMessage = await Message.findAll({
          where: {
            userMatchId: matchId 
          }
        });
        foundMessage.should.have.length(0);
    });
  });
  describe("/GET messages", async () => {
    beforeEach(async () => {
      await userService.signUp(patientOne.username, patientOne.password, patientOne.lastName, patientOne.firstName, patientOne.email, patientOne.type);
      await userService.signUp(patientTwo.username, patientTwo.password, patientTwo.lastName, patientTwo.firstName, patientTwo.email, patientTwo.type);
      let users = await User.findAll({
        where: {},
        attributes: ['id', 'username'],
        order: [['id', 'DESC']]
      });
      userOne = users[0];
      userTwo = users[1];
      await userService.createPatientInfo(users[0]);
      await userService.createPatientInfo(users[1]);
      await matchService.createMatch(userOne.id, userTwo.id);
      let match = await Match.findOne({
        where: {
          user_one_id: userOne.id,
          user_two_id: userTwo.id
        }
      });
      matchId = match.id;

      await matchService.updateMatchType(matchId, 'matched');
      let res = await chai.request(server)
        .post("/api/authenticate/login")
        .send({
          username: userOne.username,
          password: userOne.username === patientOne.username ? patientOne.password : patientTwo.password
        });
      token = res.body.token;
    });

    it("it should retrieve all messages", async () => {
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      await messageService.createMessage(userOne.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, matchId, messages[2]);
      let res = await chai.request(server)
        .get("/api/messages")
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('lastPolled');
      body.should.have.property('conversations');
      body.conversations.should.have.length(1);
      body.conversations[0].should.have.property('id');
      body.conversations[0].id.should.be.eql(matchId);
      body.conversations[0].should.have.property('messages');
      body.conversations[0].messages.should.have.length(3);
      body.conversations[0].messages[0].should.have.property('content');
      body.conversations[0].messages[0].content.should.be.eql(messages[0]);
      body.conversations[0].messages[1].content.should.be.eql(messages[1]);
      body.conversations[0].messages[2].content.should.be.eql(messages[2]);
    });
    it("it should retrieve all messages since a given time", async () => {
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      let currentTime = new Date();
      let res = await chai.request(server)
        .get("/api/messages")
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('lastPolled');
      let lastPolled = body.lastPolled;
      body.should.have.property('conversations');
      body.conversations.should.have.length(1);
      body.conversations[0].should.have.property('id');
      body.conversations[0].id.should.be.eql(matchId);
      body.conversations[0].should.have.property('messages');
      body.conversations[0].messages.should.have.length(1);
      body.conversations[0].messages[0].content.should.be.eql(messages[0]);
      body.conversations[0].messages[0].should.have.property('content');
      await messageService.createMessage(userOne.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, matchId, messages[2]);
      res = await chai.request(server)
        .get(`/api/messages?time=${lastPolled}`)
        .set('Authorization', token);
      body = res.body;
      body.should.have.property('lastPolled');
      body.should.have.property('conversations');
      body.conversations.should.have.length(1);
      body.conversations[0].should.have.property('id');
      body.conversations[0].id.should.be.eql(matchId);
      body.conversations[0].should.have.property('messages');
      body.conversations[0].messages.should.have.length(2);
      body.conversations[0].messages[0].content.should.be.eql(messages[1]);
      body.conversations[0].messages[0].should.have.property('content');
      body.conversations[0].messages[1].content.should.be.eql(messages[2]);
    });
    it("it should only retrieve messages from matched users", async () => {
      await userService.signUp(patientThree.username, patientThree.password, patientThree.lastName, patientThree.firstName, patientThree.email, patientThree.type);
      let userThree = await User.findOne({
        attributes: ['id'],
        where: {
          username: patientThree.username
        }
      });
      await matchService.createMatch(userOne.id, userThree.id);
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      await messageService.createMessage(userOne.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, matchId, messages[2]);
      let res = await chai.request(server)
        .get("/api/messages")
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('lastPolled');
      body.should.have.property('conversations');
      body.conversations.should.have.length(1);
      body.conversations[0].should.have.property('id');
      body.conversations[0].id.should.be.eql(matchId);
      body.conversations[0].should.have.property('messages');
      body.conversations[0].messages.should.have.length(3);
      body.conversations[0].messages[0].should.have.property('content');
      body.conversations[0].messages[0].content.should.be.eql(messages[0]);
      body.conversations[0].messages[1].content.should.be.eql(messages[1]);
      body.conversations[0].messages[2].content.should.be.eql(messages[2]);
    });
    it("it should retrieve messages from all matched users", async () => {
      await userService.signUp(patientThree.username, patientThree.password, patientThree.lastName, patientThree.firstName, patientThree.email, patientThree.type);
      let userThree = await User.findOne({
        attributes: ['id'],
        where: {
          username: patientThree.username
        }
      });
      await matchService.createMatch(userOne.id, userThree.id);
      let newMatch = await Match.findOne({
        attributes: ['id'],
        where: {
          user_one_id: userOne.id,
          user_two_id: userThree.id
        }
      });
      await matchService.updateMatchType(newMatch.id, 'matched');
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      await messageService.createMessage(userOne.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, newMatch.id, messages[2]);
      let res = await chai.request(server)
        .get("/api/messages")
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('lastPolled');
      body.should.have.property('conversations');
      body.conversations.should.have.length(2);
      body.conversations[0].should.have.property('id');
      body.conversations[0].id.should.be.eql(matchId);
      body.conversations[0].should.have.property('messages');
      body.conversations[0].messages.should.have.length(2);
      body.conversations[0].messages[0].should.have.property('content');
      body.conversations[0].messages[0].content.should.be.eql(messages[0]);
      body.conversations[0].messages[1].content.should.be.eql(messages[1]);
      body.conversations[1].should.have.property('messages');
      body.conversations[1].messages.should.have.length(1);
      body.conversations[1].messages[0].content.should.be.eql(messages[2]);
    });
    it("it should retrieve conversations with no messages", async () => {
      await userService.signUp(patientThree.username, patientThree.password, patientThree.lastName, patientThree.firstName, patientThree.email, patientThree.type);
      let userThree = await User.findOne({
        attributes: ['id', 'username'],
        where: {
          username: patientThree.username
        }
      });
      await matchService.createMatch(userOne.id, userThree.id);
      let newMatch = await Match.findOne({
        attributes: ['id'],
        where: {
          user_one_id: userOne.id,
          user_two_id: userThree.id
        }
      });
      await matchService.updateMatchType(newMatch.id, 'matched');
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      await messageService.createMessage(userOne.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, matchId, messages[2]);
      let res = await chai.request(server)
        .get("/api/messages")
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('lastPolled');
      body.should.have.property('conversations');
      body.conversations.should.have.length(2);
      body.conversations[0].should.have.property('id');
      body.conversations[0].id.should.be.eql(matchId);
      body.conversations[0].should.have.property('username');
      body.conversations[0].username.should.be.eql(userTwo.username);
      body.conversations[0].should.have.property('messages');
      body.conversations[0].messages.should.have.length(3);
      body.conversations[0].messages[0].should.have.property('content');
      body.conversations[0].messages[0].content.should.be.eql(messages[0]);
      body.conversations[0].messages[1].content.should.be.eql(messages[1]);
      body.conversations[0].messages[2].content.should.be.eql(messages[2]);
      body.conversations[1].should.have.property('id');
      body.conversations[1].id.should.be.eql(newMatch.id);
      body.conversations[1].should.have.property('messages');
      body.conversations[1].should.have.property('username');
      body.conversations[1].username.should.be.eql(userThree.username);
      body.conversations[1].messages.should.have.length(0);
    });
    it("it should retrieve sent and received messages", async () => {
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      await messageService.createMessage(userTwo.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, matchId, messages[2]);
      let res = await chai.request(server)
        .get("/api/messages")
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('lastPolled');
      body.should.have.property('conversations');
      body.conversations.should.have.length(1);
      body.conversations[0].should.have.property('id');
      body.conversations[0].id.should.be.eql(matchId);
      body.conversations[0].should.have.property('username');
      body.conversations[0].username.should.be.eql(userTwo.username);
      body.conversations[0].should.have.property('messages');
      body.conversations[0].messages.should.have.length(3);
      body.conversations[0].messages[0].should.have.property('content');
      body.conversations[0].messages[0].content.should.be.eql(messages[0]);
      body.conversations[0].messages[0].should.have.property('sender');
      body.conversations[0].messages[0].sender.should.be.eql(userOne.id);
      body.conversations[0].messages[1].content.should.be.eql(messages[1]);
      body.conversations[0].messages[1].should.have.property('sender');
      body.conversations[0].messages[1].sender.should.be.eql(userTwo.id);
      body.conversations[0].messages[2].content.should.be.eql(messages[2]);
      body.conversations[0].messages[2].sender.should.be.eql(userOne.id);
    });
    it("it should retrieve 0 conversations with no matches", async () => {
      await Match.destroy({where: {}});
      let res = await chai.request(server)
        .get("/api/messages")
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('lastPolled');
      body.should.have.property('conversations');
      body.conversations.should.have.length(0);
    });
  });

  describe("/GET conversation", async () => {
    var userOne, userTwo, matchId, token;

    beforeEach(async () => {
      await userService.signUp(patientOne.username, patientOne.password, patientOne.lastName, patientOne.firstName, patientOne.email, patientOne.type);
      await userService.signUp(patientTwo.username, patientTwo.password, patientTwo.lastName, patientTwo.firstName, patientTwo.email, patientTwo.type);
      await userService.signUp(admin.username, admin.password, admin.lastName, admin.firstName, admin.email, admin.type);

      let users = await User.findAll({
        where: {},
        attributes: ['id', 'username'],
        order: [['id', 'DESC']]
      });
      userOne = users[0];
      userTwo = users[1];
      await userService.createPatientInfo(users[0]);
      await userService.createPatientInfo(users[1]);
      await matchService.createMatch(userOne.id, userTwo.id);
      let match = await Match.findOne({
        where: {
          user_one_id: userOne.id,
          user_two_id: userTwo.id
        }
      });
      matchId = match.id;

      await matchService.updateMatchType(matchId, 'matched');
      let res = await chai.request(server)
        .post("/api/authenticate/login")
        .send({
          username: admin.username,
          password: admin.password
        });
      token = res.body.token;
    });

    it("it should retrieve the entire conversation", async () => {
      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      await messageService.createMessage(userOne.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, matchId, messages[2]);
      let res = await chai.request(server)
        .get("/api/users/"+userOne.id+"/conversations/"+userTwo.id)
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('userOneAvatar');
      body.should.have.property('userTwoAvatar');
      body.should.have.property('messages');
      body.messages.should.have.length(3);
      body.messages[0].should.have.property('content');
      body.messages[0].content.should.be.eql(messages[0]);
      body.messages[1].content.should.be.eql(messages[1]);
      body.messages[2].content.should.be.eql(messages[2]);
    });

    it("it should retrieve messages from blocked users", async () => {
      let userThree = await userService.signUp(patientThree.username, patientThree.password, patientThree.lastName, patientThree.firstName, patientThree.email, patientThree.type);

      await matchService.createMatch(userOne.id, userThree.id);
      let newMatch = await Match.findOne({
        attributes: ['id'],
        where: {
          user_one_id: userOne.id,
          user_two_id: userThree.id
        }
      });
      await matchService.updateMatchType(newMatch.id, 'blocked');

      let messages = ["Test message 1", "Test message 2", "Test message 3"];
      await messageService.createMessage(userOne.id, matchId, messages[0]);
      await messageService.createMessage(userOne.id, matchId, messages[1]);
      await messageService.createMessage(userOne.id, matchId, messages[2]);
      let res = await chai.request(server)
        .get("/api/users/"+userOne.id+"/conversations/"+userTwo.id)
        .set('Authorization', token);
      let body = res.body;
      body.should.have.property('userOneAvatar');
      body.should.have.property('userTwoAvatar');
      body.should.have.property('messages');
      body.messages.should.have.length(3);
      body.messages[0].should.have.property('content');
      body.messages[0].content.should.be.eql(messages[0]);
      body.messages[1].content.should.be.eql(messages[1]);
      body.messages[2].content.should.be.eql(messages[2]);
    });
  });
})
