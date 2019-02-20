const userService = require("../services/user-service");
const User = require("./sequelize").user;

async function seedDB() {
    try {
        await userService.signUp('patient1', 'patient123', 'Le', 'Richard', 'richyle@live.unc.edu', 'patient');
        await userService.signUp('admin', 'admin123', 'Post', 'Abraham', 'abrahamp@live.unc.edu', 'admin');
        await userService.signUp('parent', 'parent123', 'Terrell', 'Cameron', 'cameter@live.unc.edu', 'parent');
        await userService.signUp('patient2', 'patient123', 'Aguero', 'Alex', 'daguero@live.unc.edu', 'patient');
        console.log("Successfully seeded db");
        process.exit(0);
    } catch(e) {
        console.log("Unable to seed database");
        console.log(e);
        process.exit(1);
    }
}

seedDB()