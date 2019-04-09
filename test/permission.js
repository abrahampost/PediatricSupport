process.env.NODE_ENV = 'test';

let User = require("../db/sequelize").user;
let userService = require("../services/user-service");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require('../app');

chai.use(chaiHttp);

const patient = {
    username: 'patient',
    password: 'password',
    lastName: "patient",
    firstName: "Test",
    email: "notarealemail@gmail.com",
    type: "patient"
}

const parent = {
  username: 'parent',
  password: 'password',
  lastName: "parent",
  firstName: "Test",
  email: "notarealparentemail@gmail.com",
  type: "parent"
}

const admin = {
  username: 'admin',
  password: 'admin123',
  lastName: 'admin',
  firstName: 'test',
  email: 'definitelynotreal@gmail.com',
  type: 'admin'
}

describe('Permissions', () => {
    beforeEach(async () => {
        await User.destroy({ where: {} });
    })

    describe("/GET reports permission", () => {
        beforeEach(async () => {
            await userService.signUp(patient.username, patient.password, patient.lastName, patient.firstName, patient.email, patient.type);
            await userService.signUp(parent.username, parent.password, parent.lastName, parent.firstName, parent.email, parent.type);
        });

        it('it should not allow a patient to retrieve reports', async () => {
            let res = await chai.request(server)
                .post("/api/authenticate/login")
                .send({
                  username: patient.username,
                  password: patient.password
                });
            let token = res.body.token;

            res = await chai.request(server)
                .get("/api/reports")
                .set("Authorization", token);
            
            res.should.have.status(401);
        });

        it('it should not allow a parent to retrieve reports', async () => {
          let res = await chai.request(server)
              .post("/api/authenticate/login")
              .send({
                username: parent.username,
                password: parent.password
              });
          let token = res.body.token;

          res = await chai.request(server)
              .get("/api/reports")
              .set("Authorization", token);
          
          res.should.have.status(401);
      });
    });

    describe("/GET matches permission", () => {
      beforeEach(async () => {
          await userService.signUp(admin.username, admin.password, admin.lastName, admin.firstName, admin.email, admin.type);
          await userService.signUp(parent.username, parent.password, parent.lastName, parent.firstName, parent.email, parent.type);
      });

      it('it should allow an admin to retrieve matches', async () => {
          let res = await chai.request(server)
              .post("/api/authenticate/login")
              .send({
                username: admin.username,
                password: admin.password
              });
          let token = res.body.token;

          res = await chai.request(server)
              .get("/api/matches")
              .set("Authorization", token);
          
          res.should.have.status(200);
      });

      it('it should not allow a parent to retrieve matches', async () => {
        let res = await chai.request(server)
            .post("/api/authenticate/login")
            .send({
              username: parent.username,
              password: parent.password
            });
        let token = res.body.token;

        res = await chai.request(server)
            .get("/api/matches")
            .set("Authorization", token);
        
        res.should.have.status(401);
    });
  });
});