const   userService = require("../services/user-service"),
        matchService = require("../services/match-service"),
        User = require("./sequelize").user,
        Match = require("./sequelize").user_match,
        Attribute = require("./sequelize").attribute,
        PatientAttributes = require("./sequelize").patient_x_attribute;

async function seedDB() {
    try {
        await signupUsers();
        await seedInterests();
        await seedMatches();
        console.log("Successfully seeded db");
        process.exit(0);
    } catch(e) {
        console.log("Unable to seed database");
        console.log(e);
        process.exit(1);
    }
}

async function signupUsers() {
    await userService.signUp('patient1', 'patient123', 'Le', 'Richard', 'richyle@live.unc.edu', 'patient');
    await userService.signUp('patient2', 'patient123', 'Aguero', 'Alex', 'daguero@live.unc.edu', 'patient');
    await userService.signUp('patient3', 'patient123', 'Doe', 'John', 'abrahampost@yahoo.com', 'patient');
    await userService.signUp('patient4', 'patient123', 'Doe', 'Jane', 'abrahamlpost@gmail.com', 'patient');
    await userService.signUp('patient5', 'patient123', 'Doe', 'Jane', 'example@example.com', 'patient');
    await userService.signUp('admin', 'admin123', 'Post', 'Abraham', 'abrahamp@live.unc.edu', 'admin');
    await userService.signUp('parent', 'parent123', 'Terrell', 'Cameron', 'cameter@live.unc.edu', 'parent');
}

async function seedInterests() {
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
        order: [['id', 'ASC']],
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
    await PatientAttributes.create({
        patient_id: users[4].id,
        attribute_id: legos.id
    });
    await PatientAttributes.create({
        patient_id: users[4].id,
        attribute_id: videogames.id
    });
}

async function seedMatches() {
    let users = await User.findAll({
        attributes: ['id', 'username'],
        where: {},
        order: [['id', 'ASC']],
    });
    //Sent
    await matchService.createMatch(users[0].id, users[3].id);
    //Received
    await matchService.createMatch(users[2].id, users[0].id);
    //matched
    await matchService.createMatch(users[0].id, users[1].id);
    let match = await Match.findOne({where: {
        user_one_id: users[0].id,
        user_two_id: users[1].id
    }});
    await matchService.updateMatchType(match.id, 'matched');
}

seedDB()