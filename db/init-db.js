const User = require("../models/user");

async function createTables() {
    try {
        await User.sync();
        console.log("Successfully created user table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createTables()