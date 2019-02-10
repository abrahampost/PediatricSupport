process.env.NODE_ENV = 'test';

let User = require("../models/user");

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
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                        done();
                    });
        });
        it('it should not allow creation of an account with missing required data', (done) => {
            let user = {
                username: "johndoe2",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    done();
                });
        })
        it('it should not allow creation of an account with too-short password', (done) => {
            let user = {
                username: "johndoe3",
                password: "pass",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                        done();
                    });
        });
        it('it should not allow creation of an account with non-alphanumeric username', (done) => {
            let user = {
                username: "john%%&",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    done();
                });
        });
        it('it should not allow creation of an account with non-alphanumeric username', (done) => {
            let user = {
                username: "john%%&",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    done();
                });
        });
        it('it should not allow creation of an account with an invalid email', (done) => {
            let user = {
                username: "johndoe4",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoegmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    done();
                });
        });
        it('it should not allow creation of an account with an invalid type', (done) => {
            let user = {
                username: "johndoe5",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "notpatient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(400);
                    done();
                });
        });
    })

    describe("/POST login", () => {
        it("it should login account with proper credentials", (done) => {
            let user = {
                username: "johndoe",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                    chai.request(server)
                        .post("/api/authenticate/login")
                        .send({
                            username: "johndoe",
                            password: "password"
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            res.body.should.be.a("object");
                            res.body.should.have.property("token");
                            done();
                        });
                });
        })
        it("it should not login with bad credentials", (done) => {
            let user = {
                username: "johndoe",
                password: "password",
                lastName: "Doe",
                firstName: "John",
                email: "johndoe@gmail.com",
                type: "patient"
            }
            chai.request(server)
                .post("/api/authenticate/signup")
                .send(user)
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                    chai.request(server)
                        .post("/api/authenticate/login")
                        .send({
                            username: "johndoe",
                            password: "badpassword"
                        })
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(401);
                            res.body.should.be.an("object");
                            res.body.should.have.property('error');
                            res.body.error.should.be.a('string');
                            res.body.error.should.be.eql('Incorrect username and password combination');
                            done();
                        });
                });
        });
        it("it should not authenticate when attempting to login a non-existent password", (done) => {
            chai.request(server)
                .post("/api/authenticate/login")
                .send({
                    username: "johndoe5",
                    password: "password"
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(401);
                    res.body.should.be.an("object");
                    res.body.should.have.property('error');
                    res.body.error.should.be.a('string');
                    res.body.error.should.be.eql('Incorrect username and password combination');
                    done();
                })
        })
    });
});