process.env.NODE_ENV = 'test';

let Attribute = require("../db/sequelize").attribute;
let User = require("../db/sequelize").user;
let userService = require("../services/user-service");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require('../app');

chai.use(chaiHttp);

const testAdmin = {
    username: 'testadmin',
    password: 'password',
    lastName: "Admin",
    firstName: "Test",
    email: "notarealemail@gmail.com",
    type: "admin"
}

describe('Attributes', () => {
    beforeEach(async () => {
        await Attribute.destroy({ where: {} });
        await User.destroy({ where: {} });
    })

    describe("/POST attributes", () => {
        beforeEach(async () => {
            await userService.signUp(testAdmin.username, testAdmin.password, testAdmin.lastName, testAdmin.firstName, testAdmin.email, testAdmin.type);
        });

        it('it should create an interest', async () => {
            let requestBody = {
                name: "legos",
                type: "interest"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/attributes")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(201);
        });

        it('it should create a diagnosis', async () => {
            let requestBody = {
                name: "flu",
                type: "diagnosis"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/attributes")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(201);
        });

        it('it should not allow creation of an attribute with missing required data', async () => {
            let requestBody = {
                name: "dogs"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/attributes")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(400);
        });
        it('it should not allow creation of an account with an invalid type', async () => {
            let requestBody = {
                name:"hamburger",
                type:"food"
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: testAdmin.username,
                    password: testAdmin.password
                });

            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/attributes")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(400);
        });
    });
});