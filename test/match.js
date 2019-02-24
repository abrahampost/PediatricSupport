process.env.NODE_ENV = 'test';

// project dependencies
const   userService = require("../services/user-service"),
        matchService = require("../services/match-service"),
        Match = require("../db/sequelize").user_match,
        Attribute = require('../db/sequelize').attribute,
        BadRequestException = require("../exceptions/bad-request-exception");

// testing dependencies
const   chai = require("chai"),
        assert = chai.assert
        chaiHttp = require("chai-http")
        server = require('../app'),
        should = chai.should();

chai.use(chaiHttp);

describe("Match", () => {
    before(async () => {
        await User.destroy({ where: {} });
        await userService.signUp('patient1', 'patient123', 'Le', 'Richard', 'richyle@live.unc.edu', 'patient');
        await userService.signUp('patient2', 'patient123', 'Post', 'Abraham', 'abrahamp@live.unc.edu', 'patient');
        await userService.signUp('patient3', 'patient123', 'Terrell', 'Cameron', 'cameter@live.unc.edu', 'patient');
        await userService.signUp('patient4', 'patient123', 'Aguero', 'Alex', 'daguero@live.unc.edu', 'patient');
    });
    beforeEach(async () => {
        await Match.destroy({ where: {} });
    })

    describe("MatchService", () => {
        describe("create", () => {
            it("it should succesfully create a match", async () => {
                let users = await User.findAll({
                    attributes: ['id'],
                    limit: 2,
                });
                let response = await matchService.createMatch(users[0].id, users[1].id);
                // make sure the response is properly formed
                response.should.be.eql(201, "response not 201");
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
                } catch(e) {
                    e.should.be.instanceof(BadRequestException);
                }
            });
        });

        describe("update", () => {
            beforeEach(async () => {
                let users = await User.findAll({
                    attributes: ['id'],
                    limit: 2,
                    order: [['id', 'DESC']],
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
                let response = await matchService.updateMatchType(match.id, 'matched');
                response.should.be.eql(201);
                let foundMatch = await Match.findOne({
                    where: {
                        id: match.id,
                    },
                });
                foundMatch.type.should.be.eql('matched');
            });
            it("it should update a match to 'blocked'", async () => {
                let match = await Match.findOne();
                let response = await matchService.updateMatchType(match.id, 'blocked');
                response.should.be.eql(201);
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
                    e.message.should.be.eql("Unable to update match status.", e.message);
                }
            });
        });

        describe("matching engine", () => {
            before(async () => {
                
            });
        })
    })
})