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
};

let testUser = {
  username: 'testuser',
  password: 'password',
  lastName: 'Patient',
  firstName: 'Test',
  email: 'notarealemail@gmail.com',
  type: 'patient',
};

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
      var token;
      var userId;
      beforeEach(async () => {
        const requestBody = {
          patientFirstName: "John",
          patientLastName: "Patient",
          patientEmail: "523pediatrics@gmail.com",
          parentFirstName: "Todd",
          parentLastName: "Parent",
          parentEmail: "geschwat@masafiagrofood.com"
        };

        await userService.signUp(testUser.username, testUser.password, testUser.lastName, testUser.firstName, testUser.email, testUser.type);
        let userLogin = await chai.request(server)
          .post("/api/authenticate/login")
          .send({
              username: testUser.username,
              password: testUser.password
          });
        token = userLogin.body.token;
        userId = userLogin.body.user.id;

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
        let testBio = "This is a test bio.";

        let interests = await Attribute.findAll({
            limit: 2,
            attributes: ['id'],
            where: {
              type: 'interest'
            },
            order: [ [ 'id', 'DESC' ]]
          });
        
        interests = interests.map((interest) => interest.id);

        let res = await chai.request(server)
          .put("/api/users")
          .send({
            biography: testBio,
            interests: interests
          })
          .set('Authorization', token);
        res.should.have.status(200);

        let foundAttributes = await PatientXAttribute.findAll({
            attributes: ['attribute_id'],
            where: {
              patient_id: userId,
            },
            order: [ [ 'attribute_id', 'DESC' ]]
        });
        foundAttributes = foundAttributes.map((attribute) => attribute.attribute_id);
        interests.should.be.eql(foundAttributes);
      
        let patientInfo = await PatientInfo.findOne({
          where: {
            user_id: userId
          },
        });
        patientInfo.should.have.property('biography');
        patientInfo.biography.should.be.eql(testBio);
      });

      it("it should update user info with blank interests and bio", async () => {
        let res = await chai.request(server)
          .put("/api/users")
          .send({
            biography: "",
            interests: []
          })
          .set('Authorization', token);
        res.should.have.status(200);
        
        let interestsTest = await PatientXAttribute.findAll({
            where: {
              patient_id: userId,
            }
          });
        interestsTest.should.be.eql([], "interestsTest should be empty");
        let testBio = await PatientInfo.findOne({
          where: {
            user_id: userId
          }
        });

        testBio.should.have.property("biography");
        testBio.biography.should.be.eql("", "biography should be blank");
      });

      it("it should update user info back to empty", async () => {
        let interests = await Attribute.findAll({
          limit: 2,
          attributes: ['id'],
          where: {
            type: 'interest'
          },
          order: [ [ 'id', 'DESC' ]]
        });
        interests = interests.map((interest) => interest.id);
        await userService.updatePatientInfo(userId, interests, "This is a test bio.");

        let res = await chai.request(server)
          .put("/api/users")
          .send({
            biography: "",
            interests: []
          })
          .set('Authorization', token);
        res.should.have.status(200);
        let interestsTest = await PatientXAttribute.findAll({
            where: {
              patient_id: userId,
            }
          });
        interestsTest = interestsTest.map((interest) => interest.attribute_id);
        interestsTest.should.be.eql([]);
        let patientInfo = await PatientInfo.findOne({
          where: {
              user_id: userId,
          },
        });
        patientInfo.should.have.property('biography');
        patientInfo.biography.should.be.eql("");
      });
    });

    describe("/GET user", () => {
      var token;
      var userId;
      beforeEach(async () => {
        await userService.signUp(testUser.username, testUser.password, testUser.lastName, testUser.firstName, testUser.email, testUser.type);
        let userLogin = await chai.request(server)
          .post("/api/authenticate/login")
          .send({
              username: testUser.username,
              password: testUser.password
          });
        token = userLogin.body.token;
        userId = userLogin.body.user.id;

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

      it("it should retrieve the correct biography", async () => {
        const testBio = 'this is a test bio';
        await userService.updatePatientInfo(userId, [], testBio);
        let res = await chai.request(server)
          .get("/api/users")
          .set('Authorization', token);
        let body = res.body;
        body.should.have.property('biography');
        body.biography.should.be.eql(testBio);
      });

      it("it should retrieve the correct interests", async () => {
        const testBio = 'this is a test bio';
        let interests = await Attribute.findAll({
          attributes: ['id'],
          where: {
            type: 'interest'
          },
          order: [['id', 'ASC']]
        });
        let interestsIDs = interests.map((intr) => intr.id);
        await userService.updatePatientInfo(userId, interestsIDs, testBio);
        let res = await chai.request(server)
          .get("/api/users")
          .set('Authorization', token);
        let body = res.body;
        body.should.have.property('attributes');
        body.attributes.should.be.length(interestsIDs.length, "returned incorrect number of interests");
        body.attributes[0].should.have.property('id');
        body.attributes[0].should.have.property('name');
        body.attributes[0].id.should.be.eql(interestsIDs[0]);
        body.attributes[1].id.should.be.eql(interestsIDs[1]);
        body.attributes[2].id.should.be.eql(interestsIDs[2]);
        body.attributes[3].id.should.be.eql(interestsIDs[3]);
      });
      it("it should retrieve blank bio and interests" , async () => {
        await userService.updatePatientInfo(userId, [], "");
        let res = await chai.request(server)
          .get("/api/users")
          .set('Authorization', token);
        let body = res.body;
        body.should.have.property("attributes");
        body.should.have.property("biography");
        body.attributes.should.have.length(0);
        body.biography.should.be.eql("");
      });
    })

    describe("/PUT resetPassword", () => {
        beforeEach(async () => {
            await userService.signUp(testAdmin.username, testAdmin.password, testAdmin.lastName, testAdmin.firstName, testAdmin.email, testAdmin.type);
        });

        it('it should reset the password of the user', async () => {
            let newPassword = "password123";
            let requestBody = {
                username: testAdmin.username,
                oldPassword: testAdmin.password,
                newPassword: newPassword
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .put("/api/users/passwords/reset")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(204);
            res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: newPassword
                });
            res.should.have.status(200);
        });
        it('it should not allow resetting a password with an invalid password', async () => {
            let requestBody = {
                username: testAdmin.username,
                oldPassword: testAdmin.password,
                newPassword: "short"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .put("/api/users/passwords/reset")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(400);
        });
    });
});