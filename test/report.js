process.env.NODE_ENV = 'test';

let UserReport = require("../db/sequelize").user_report;
let User = require("../db/sequelize").user;
let userService = require("../services/user-service");
let reportService = require("../services/report-service");

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
}

const patientTwo = {
    username: 'patientTwo',
    password: 'password',
    lastName: "patient",
    firstName: "Test",
    email: "anothernotarealemail@gmail.com",
    type: "patient"
}

describe('Reports', () => {
    beforeEach(async () => {
        await UserReport.destroy({ where: {} });
        await User.destroy({ where: {} });
    })

    describe("/POST reports", () => {
        beforeEach(async () => {
            await userService.signUp(patientOne.username, patientOne.password, patientOne.lastName, patientOne.firstName, patientOne.email, patientOne.type);
            await userService.signUp(patientTwo.username, patientTwo.password, patientTwo.lastName, patientTwo.firstName, patientTwo.email, patientTwo.type);
        });

        it('it should create a report', async () => {
            let users = await User.findAll({
                where: {},
                attributes: ['id', 'username'],
                order: [['id', 'DESC']]
            });
            let userOne = users[0];
            let userTwo = users[1];

            let requestBody = {
                reportedId: userTwo.id
            }
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: userOne.username,
                    password: userOne.username === patientOne.username ? patientOne.password : patientTwo.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/reports")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(201);
        });

        it('it should not allow creation of a report with missing required data', async () => {
            let requestBody = {}
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: patientOne.username,
                    password: patientOne.password
                });
            let token = res.body.token;
            res = await chai.request(server)
                .post("/api/reports")
                .send(requestBody)
                .set('Authorization', token);
            res.should.have.status(400);
        });
    });

    describe("/GET reports", () => {
        beforeEach(async () => {
            await userService.signUp(patientOne.username, patientOne.password, patientOne.lastName, patientOne.firstName, patientOne.email, patientOne.type);
            await userService.signUp(patientTwo.username, patientTwo.password, patientTwo.lastName, patientTwo.firstName, patientTwo.email, patientTwo.type);
        
            let users = await User.findAll({
                where: {},
                attributes: ['id', 'username', 'password'],
                order: [['id', 'DESC']]
            });
            let userOne = users[0];
            let userTwo = users[1];

            await reportService.createUserReport(userOne.id,userTwo.id);
        });

        it('it should retrieve all reports', async () => {
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: patientOne.username,
                    password: patientOne.password
                });
            let token = res.body.token;

            res = await chai.request(server)
                .get("/api/reports")
                .set("Authorization", token);
            
            let body = res.body;
            assert.exists(body);
            assert.equal(1,body.length);
        });

        it('it should retrieve all pending reports', async () => {
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: patientOne.username,
                    password: patientOne.password
                });
            let token = res.body.token;

            res = await chai.request(server)
                .get("/api/reports?status=pending")
                .set("Authorization", token);
            
            let body = res.body;
            assert.exists(body);
            assert.equal(1,body.length);
        });
    });
});