process.env.NODE_ENV = 'test';

// project dependencies
const userService = require("../services/user-service"),
  matchService = require("../services/match-service"),
  Match = require("../db/sequelize").user_match,
  Attribute = require('../db/sequelize').attribute,
  PatientAttributes = require("../db/sequelize").patient_x_attribute,
  BadRequestException = require("../exceptions/bad-request-exception"),
  User = require("../db/sequelize").user,
  Op = require("sequelize").Op;

// testing dependencies
const chai = require("chai"),
  assert = chai.assert,
  chaiHttp = require("chai-http"),
  server = require('../app'),
  should = chai.should();

chai.use(chaiHttp);

describe("Match", () => {
  before(async () => {
    await User.destroy({
      where: {}
    });
    await Promise.all([
      userService.signUp('patient1', 'patient123', 'Le', 'Richard', 'richyle@live.unc.edu', 'patient'),
      userService.signUp('patient2', 'patient123', 'Post', 'Abraham', 'abrahamp@live.unc.edu', 'patient'),
      userService.signUp('patient3', 'patient123', 'Terrell', 'Cameron', 'cameter@live.unc.edu', 'patient'),
      userService.signUp('patient4', 'patient123', 'Aguero', 'Alex', 'daguero@live.unc.edu', 'patient'),
    ]);
    let users = await User.findAll({
      where: {}
    });
    await Promise.all([userService.createPatientInfo(users[0]),
      userService.createPatientInfo(users[1]),
      userService.createPatientInfo(users[2]),
      userService.createPatientInfo(users[3]),
    ]);
  });

  beforeEach(async () => {
    await Match.destroy({
      where: {}
    });
    await Attribute.destroy({
      where: {}
    });
    await PatientAttributes.destroy({
      where: {}
    });
  })

  describe("MatchService", () => {
    describe("create", () => {
      it("it should succesfully create a match", async () => {
        let users = await User.findAll({
          attributes: ['id'],
          limit: 2,
        });
        await matchService.createMatch(users[0].id, users[1].id);

        // check the matches table to see if it correctly updated
        let match = await Match.findOne({
          where: {
            user_one_id: users[0].id,
            user_two_id: users[1].id
          }
        });
        match.should.be.a('object', 'should find a match');
        match.type.should.be.eql("pending", "status incorrectly set");
      });

      it("it should not create a match of non-existent users", async () => {
        let maxId = await User.max('id');
        try {
          await matchService.createMatch(maxId + 1, maxId + 2);
          assert.fail("Should throw error");
        } catch (e) {
          e.should.be.instanceof(BadRequestException);
        }
      });
    });

    describe("update", () => {
      beforeEach(async () => {
        let users = await User.findAll({
          attributes: ['id'],
          limit: 2,
          order: [
            ['id', 'DESC']
          ],
        });
        await matchService.createMatch(users[0].id, users[1].id);
      });
      it("it should update a match to 'matched'", async () => {
        let match = await Match.findOne({
          where: {
            type: {
              [Op.not]: 'matched',
            },
          },
        });
        await matchService.updateMatchType(match.id, 'matched');

        let foundMatch = await Match.findOne({
          where: {
            id: match.id,
          },
        });
        foundMatch.type.should.be.eql('matched');
      });
      it("it should update a match to 'blocked'", async () => {
        let match = await Match.findOne();
        await matchService.updateMatchType(match.id, 'blocked');

        let foundMatch = await Match.findOne({
          where: {
            id: match.id,
          },
        });
        foundMatch.type.should.be.eql('blocked');
      });
      it("it should not allow updating a non-existent match", async () => {
        try {
          let maxId = await Match.max('id');
          await matchService.updateMatchType(maxId + 1, 'matched');
          assert.fail("should throw error");
        } catch (e) {
          e.should.be.instanceof(BadRequestException, typeof e);
          e.message.should.be.eql("Match does not exist.", e.message);
        }
      });

      it("it should not allow updating to an invalid type", async () => {
        try {
          let user = await Match.findOne();
          await matchService.updateMatchType(user.id, 'notvalid');
          assert.fail("should throw error");
        } catch (e) {
          e.should.be.instanceof(BadRequestException, typeof e);
        }
      });
    });

    describe("delete", () => {
      it("it should delete match correctly", async () => {
        let users = await User.findAll({
          attributes: ['id'],
          where: {},
          order: [
            ['id', 'ASC']
          ],
          limit: 2
        });
        await matchService.createMatch(users[0].id, users[1].id);
        let matches = await Match.findAll({
          where: {}
        });
        matches.should.have.length(1, "incorrect length");
        await matchService.deleteMatch(matches[0].id);
        let noMatches = await Match.findAll({
          where: {}
        });
        noMatches.should.have.length(0, "not deleted");
      });
      it("should return proper error when deleting non-existent match", async () => {
        try {
          let status = await matchService.deleteMatch(1);
        } catch (e) {
          e.should.be.instanceof(BadRequestException);
          e.message.should.be.eql("Match does not exist.", "error message incorrect");
        }
      })
    })

    describe("get matches", () => {
      it("it should receive matches with the correct attributes", async () => {
        let users = await User.findAll({
          where: {},
          attributes: ['id', 'username'],
          order: [
            ['id', 'DESC']
          ],
          limit: 2,
        });
        await matchService.createMatch(users[0].id, users[1].id);
        let results = await matchService.getMatches(users[0].id);
        results[0].should.have.property('id');
        results[0].should.have.property('username');
        results[0].should.have.property('avatar');
        results[0].should.have.property('type');
        results[0].should.have.property('attributes');
      })
      it("it should get matched users", async () => {
        let users = await User.findAll({
          where: {},
          attributes: ['id', 'username'],
          order: [
            ['id', 'DESC']
          ]
        })
        await matchService.createMatch(users[0].id, users[1].id);
        await matchService.createMatch(users[0].id, users[2].id);
        let results = await matchService.getMatches(users[0].id);
        results.should.have.length(2);
        // more recent matches should be returned first
        results[0].username.should.be.eql(users[2].username);
        results[1].username.should.be.eql(users[1].username);
      })
      it("it should return no matches if none exists", async () => {
        let user = await User.findOne();
        let results = await matchService.getMatches(user.id);
        results.should.have.length(0);
      });
    })

    //TODO: Add more matching engine tests
    describe("matching engine", () => {
      it("it should return matches with the correct attributes", async () => {
        let legos = await Attribute.create({
          name: 'legos',
          type: 'interest',
        });
        let users = await User.findAll({
          attributes: ['id'],
          where: {},
          order: [
            ['id', 'ASC']
          ],
          limit: 2,
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: legos.id
        });
        let matchedUsers = await matchService.getPotentialMatches(users[0].id);
        matchedUsers.should.have.length(1);
        matchedUsers[0].should.have.property('id');
        matchedUsers[0].should.have.property('username');
        matchedUsers[0].should.have.property('attributes');
        matchedUsers[0].should.have.property('avatar');
      })

      it("it should find correct matches", async () => {
        // #region initialize attributes
        let legos = await Attribute.create({
          name: 'legos',
          type: 'interest',
        });
        let movies = await Attribute.create({
          name: 'movies',
          type: 'interest',
        });
        let videogames = await Attribute.create({
          name: 'videogames',
          type: 'interest',
        });
        let basketball = await Attribute.create({
          name: 'basketball',
          type: 'interest',
        });
        let users = await User.findAll({
          attributes: ['id'],
          where: {},
          order: [
            ['id', 'ASC']
          ],
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: videogames.id
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: basketball.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: videogames.id
        });
        await PatientAttributes.create({
          patient_id: users[2].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[2].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[3].id,
          attribute_id: legos.id
        });
        // #endregion
        let matchedUsers = await matchService.getPotentialMatches(users[0].id);
        matchedUsers.should.have.length(3, matchedUsers.length);
        matchedUsers[0].id.should.be.eql(users[1].id, matchedUsers[0].id);
        matchedUsers[1].id.should.be.eql(users[2].id, matchedUsers[1].id);
        matchedUsers[2].id.should.be.eql(users[3].id, matchedUsers[2].id);
      });

      it("it should find matches with some non-similar interests", async () => {
        // #region initialize matches
        let legos = await Attribute.create({
          name: 'legos',
          type: 'interest',
        });
        let movies = await Attribute.create({
          name: 'movies',
          type: 'interest',
        });
        let videogames = await Attribute.create({
          name: 'videogames',
          type: 'interest',
        });
        let basketball = await Attribute.create({
          name: 'basketball',
          type: 'interest',
        });
        let users = await User.findAll({
          attributes: ['id'],
          where: {},
          order: [
            ['id', 'ASC']
          ],
        });
        //Patient 0 no longer likes legos. :(
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: videogames.id
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: basketball.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: videogames.id
        });
        await PatientAttributes.create({
          patient_id: users[2].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[2].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[3].id,
          attribute_id: legos.id
        });
        // #endregion
        let matchedUsers = await matchService.getPotentialMatches(users[0].id);
        matchedUsers.should.have.length(3, matchedUsers.length);
        matchedUsers[0].id.should.be.eql(users[1].id);
      });
      
      it("it should find matches with correct attributes", async () => {
        let legos = await Attribute.create({
          name: 'legos',
          type: 'interest',
        });
        let movies = await Attribute.create({
          name: 'movies',
          type: 'interest',
        });
        let videogames = await Attribute.create({
          name: 'videogames',
          type: 'interest',
        });
        let basketball = await Attribute.create({
          name: 'basketball',
          type: 'interest',
        });
        let users = await User.findAll({
          attributes: ['id'],
          where: {},
          order: [
            ['id', 'ASC']
          ],
        });
        //Patient 0 no longer likes legos. :(
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: videogames.id
        });
        await PatientAttributes.create({
          patient_id: users[0].id,
          attribute_id: basketball.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[1].id,
          attribute_id: videogames.id
        });
        await PatientAttributes.create({
          patient_id: users[2].id,
          attribute_id: legos.id
        });
        await PatientAttributes.create({
          patient_id: users[2].id,
          attribute_id: movies.id
        });
        await PatientAttributes.create({
          patient_id: users[3].id,
          attribute_id: legos.id
        });
        let matchedUsers = await matchService.getPotentialMatches(users[0].id);
        matchedUsers.should.have.length(3);
        matchedUsers[0].should.have.property('attributes');
        matchedUsers[0].should.have.property('avatar');
        matchedUsers[0].should.have.property('id');
        matchedUsers[0].should.have.property('similarity');
        matchedUsers[0].should.have.property('username');
      })
    })

  })
})