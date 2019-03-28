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
        let foundMessage = await Message.findAll({
          where: {
            userMatchId: matchId 
          }
        });
        foundMessage.should.have.length(0);
    })
  });
})
