process.env.NODE_ENV = 'test';

let User = require("../db/sequelize").user;
let PatientXParent = require("../db/sequelize").patient_x_parent;
let userService = require("../services/user-service");
let Attribute = require("../db/sequelize").attribute;
let PatientXAttribute = require("../db/sequelize").patient_x_attribute;
let PatientInfo = require("../db/sequelize").patient_info;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

const testAdmin = {
    username: 'testadmin',
    password: 'password',
    lastName: "Admin",
    firstName: "Test",
    email: "notarealemail@gmail.com",
    type: "admin"
}

describe('Users', () => {
    beforeEach(async () => {
        await PatientXParent.destroy({ where: {} });
        await User.destroy({ where: {} });
        await Attribute.destroy({where: {} });
        await PatientXAttribute.destroy({where: {} });
        await PatientInfo.destroy({where: {} });
    })

    describe("/POST signup", () => {
        beforeEach(async () => {
            await userService.signUp(testAdmin.username, testAdmin.password, testAdmin.lastName, testAdmin.firstName, testAdmin.email, testAdmin.type);
        });

        it('it should create an account', async () => {
            let requestBody = {
                patientFirstName: "John",
                patientLastName: "Patient",
                patientEmail: "523pediatrics@gmail.com",
                parentFirstName: "Todd",
                parentLastName: "Parent",
                parentEmail: "geschwat@masafiagrofood.com"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/users")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(201);
        });
        it('it should not allow creation of an account with missing required data', async () => {
            let requestBody = {
                patientFirstName: "John",
                patientLastName: "Patient",
                parentFirstName: "Todd",
                parentLastName: "Parent",
                parentEmail: "geschwat@masafiagrofood.com"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/users")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(400);
        });
        it('it should not allow creation of an account with an invalid email', async () => {
            let requestBody = {
                patientFirstName: "John",
                patientLastName: "Patient",
                patientEmail: "bademail.com",
                parentFirstName: "Todd",
                parentLastName: "Parent",
                parentEmail: "geschwat@masafiagrofood.com"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });

            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/users")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(400);
        });
    });

    describe("/POST login", () => {
        it("it should login patient account with proper credentials", async () => {
            let user = {
                username: "johndoe",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            await userService.signUp(user.username, user.password, user.lastName, user.firstName, user.email, user.type);
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: "johndoe",
                    password: "password"
                });

            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            res.body.should.have.property("user");
            res.body.user.should.be.a("object");
            res.body.user.should.have.property("username");
            res.body.user.should.have.property("email");
            res.body.user.should.have.property("type");
            res.body.user.username.should.be.eql(user.username);
            res.body.user.email.should.be.eql(user.email);
            res.body.user.type.should.be.eql(user.type, "should be " + user.type);
        });

        it("it should login admin account with proper credentials", async () => {
            let user = {
                username: "johndoe",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "admin"
            }
            await userService.signUp(user.username, user.password, user.lastName, user.firstName, user.email, user.type);
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: "johndoe",
                    password: "password"
                });
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            res.body.should.have.property("user");
            res.body.user.should.be.a("object");
            res.body.user.should.have.property("username");
            res.body.user.should.have.property("email");
            res.body.user.should.have.property("type");
            res.body.user.username.should.be.eql(user.username);
            res.body.user.email.should.be.eql(user.email);
            res.body.user.type.should.be.eql(user.type, "should be " + user.type);
        });

        it("it should login parent account with proper credentials", async () => {
            let user = {
                username: "johndoe",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "parent"
            }
            await userService.signUp(user.username, user.password, user.lastName, user.firstName, user.email, user.type);
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: "johndoe",
                    password: "password"
                });
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            res.body.should.have.property("user");
            res.body.user.should.be.a("object");
            res.body.user.should.have.property("username");
            res.body.user.should.have.property("email");
            res.body.user.should.have.property("type");
            res.body.user.username.should.be.eql(user.username);
            res.body.user.email.should.be.eql(user.email);
            res.body.user.type.should.be.eql(user.type, "should be " + user.type);
        });

        it("it should not login with bad credentials", async () => {
            let user = {
                username: "johndoe",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            await userService.signUp(user.username, user.password, user.lastName, user.firstName, user.email, user.type);
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: "johndoe",
                    password: "badpassword"
                });

            res.should.have.status(401);
            res.body.should.be.an("object");
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            res.body.error.should.be.eql('Incorrect username and password combination.');
        });

        it("it should not authenticate when attempting to login a non-existent user", async () => {
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: "johndoe5",
                    password: "password"
                });
            res.should.have.status(401);
            res.body.should.be.an("object");
            res.body.should.have.property('error');
            res.body.error.should.be.a('string');
            res.body.error.should.be.eql('Incorrect username and password combination.');

        });
    });
    describe("/PUT updateUserInfo", () => {
        beforeEach(async () => {
            await userService.signUp(testAdmin.username, testAdmin.password, testAdmin.lastName, testAdmin.firstName, testAdmin.email, testAdmin.type);
            //TODO add interests to attribute table
            await Attribute.create({
                name: 'legos',
                type: 'interest',
            });
            await Attribute.create({
                name: 'movies',
                type: 'interest',
            });
            await Attribute.create({
                name: 'videogames',
                type: 'interest',
            });
            await Attribute.create({
                name: 'basketball',
                type: 'interest',
            });
        });
        it("it should update user info with valid interests and bio", async () => {
            let requestBody = {
                patientFirstName: "John",
                patientLastName: "Patient",
                patientEmail: "523pediatrics@gmail.com",
                parentFirstName: "Todd",
                parentLastName: "Parent",
                parentEmail: "geschwat@masafiagrofood.com"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            await chai.request(server)
                .post("/api/users")
                .send(requestBody)
                .set('Authorization', token);
            
            let testId = 0;
            await User.findAll({
                limit: 1,
                where: {
                  type: 'patient'
                },
                order: [ [ 'id', 'DESC' ]]
              }).then(function(entries){
                testId = entries[0].id;
              });

            let interests = [1];
            await Attribute.findAll({
                limit: 2,
                where: {
                  type: 'interest'
                },
                order: [ [ 'id', 'DESC' ]]
              }).then(function(entries){
                for (i=0; i<entries.length; i++) {
                    interests[i] = entries[i].id;
                }
              });
            await userService.updatePatientInfo(testId, interests, "This is a test bio.");

            let interestsTest = [];
            await PatientXAttribute.findAll({
                limit: 2,
                where: {
                  patient_id: testId,
                },
                order: [ [ 'attribute_id', 'DESC' ]]
              }).then(function(entries){
                for (i=0; i<entries.length; i++) {
                    interestsTest[i] = entries[i].attribute_id;
                }
              });
              interestsTest.should.be.eql(interests);
            
              let testBio = "test";
              await PatientInfo.findAll({
                limit: 1,
                where: {
                    user_id: testId,
                },
              }).then(function(entries){
                testBio = entries[0].biography;
              });
              testBio.should.be.eql("This is a test bio.");
        });

        it("it should update user info with blank interests and bio", async () => {
            let requestBody = {
                patientFirstName: "John",
                patientLastName: "Patient",
                patientEmail: "523pediatrics@gmail.com",
                parentFirstName: "Todd",
                parentLastName: "Parent",
                parentEmail: "geschwat@masafiagrofood.com"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            await chai.request(server)
                .post("/api/users")
                .send(requestBody)
                .set('Authorization', token);
            
            let testId = 0;
            await User.findAll({
                limit: 1,
                where: {
                  type: 'patient'
                },
                order: [ [ 'id', 'DESC' ]]
              }).then(function(entries){
                testId = entries[0].id;
              });

            await userService.updatePatientInfo(testId, [], "");

            let interestsTest = [];
            await PatientXAttribute.findAll({
                where: {
                  patient_id: testId,
                }
              }).then(function(entries){
                for (i=0; i<entries.length; i++) {
                    interestsTest[i] = entries[i].attribute_id;
                }
              });
              interestsTest.should.be.eql([]);
            
              let testBio = "test";
              await PatientInfo.findAll({
                limit: 1,
                where: {
                    user_id: testId,
                },
              }).then(function(entries){
                testBio = entries[0].biography;
              });
              testBio.should.be.eql("");
        });

        it("it should update user info back to empty", async () => {
            let requestBody = {
                patientFirstName: "John",
                patientLastName: "Patient",
                patientEmail: "523pediatrics@gmail.com",
                parentFirstName: "Todd",
                parentLastName: "Parent",
                parentEmail: "geschwat@masafiagrofood.com"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            await chai.request(server)
                .post("/api/users")
                .send(requestBody)
                .set('Authorization', token);
            
            let testId = 0;
            await User.findAll({
                limit: 1,
                where: {
                  type: 'patient'
                },
                order: [ [ 'id', 'DESC' ]]
              }).then(function(entries){
                testId = entries[0].id;
              });

            let interests = [1];
            await Attribute.findAll({
                limit: 2,
                where: {
                  type: 'interest'
                },
                order: [ [ 'id', 'DESC' ]]
              }).then(function(entries){
                for (i=0; i<entries.length; i++) {
                    interests[i] = entries[i].id;
                }
              });
            await userService.updatePatientInfo(testId, interests, "This is a test bio.");
            await userService.updatePatientInfo(testId, [], "");

            let interestsTest = [];
            await PatientXAttribute.findAll({
                where: {
                  patient_id: testId,
                }
              }).then(function(entries){
                for (i=0; i<entries.length; i++) {
                    interestsTest[i] = entries[i].attribute_id;
                }
              });
              interestsTest.should.be.eql([]);
            
              let testBio = "test";
              let len = 0;
              await PatientInfo.findAll({
                where: {
                    user_id: testId,
                },
              }).then(function(entries){
                testBio = entries[0].biography;
                len = entries.length;
              });
              testBio.should.be.eql("");
              len.should.be.eql(1);
        });
    });
});