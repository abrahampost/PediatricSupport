const userService = require("../services/user-service");
const User = require("./sequelize").user;

async function seedDB() {
    try {
        await userService.signUp('richardle', 'richardle', 'Le', 'Richard', 'richyle@live.unc.edu', 'patient');
        await userService.signUp('abrahampost', 'abrahampost', 'Post', 'Abraham', 'abrahamp@live.unc.edu', 'admin');
        await userService.signUp('cameronterrell', 'cameronterrell', 'Terrell', 'Cameron', 'cameter@live.unc.edu', 'parent');
        await userService.signUp('alexaguero', 'alexaguero', 'Aguero', 'Alex', 'daguero@live.unc.edu', 'patient');
        console.log("Successfully seeded db");
        process.exit(0);
    } catch(e) {
        console.log("Unable to seed database");
        console.log(e);
        process.exit(1);
    }
}

seedDB()