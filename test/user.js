process.env.NODE_ENV = 'test';

let User = require("../models/user").Model;

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        User.destroy({where: {}})
            .then(done())
    })
    
    describe("/POST signup", () => {
        it('it should create an account', (done) => {
            let user = {
                username: "johndoe1",
                password: "johndoepassword",
                lastName: "Doe",
                firstName: "John"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                        done();
                    });
        });
        it('it should not allow creation of an account with missing required data', (done) =>{
            let user = {
                username: "johndoe2",
                lastName: "Doe",
                firstName: "John"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        })
        it('it should not allow creation of an account with too-short password', (done) =>{
            let user = {
                username: "johndoe3",
                password: "pass",
                lastName: "Doe",
                firstName: "John"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                        done();
                    });
        });
        it('it should not allow creation of an account with non-alphanumeric username', (done) =>{
            let user = {
                username: "john%%&",
                password: "password",
                lastName: "Doe",
                firstName: "John"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    })
});