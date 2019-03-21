process.env.NODE_ENV = 'test';

let User = require("../db/sequelize").user;
let PatientXParent = require("../db/sequelize").patient_x_parent;
let userService = require("../services/user-service");

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