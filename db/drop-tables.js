const User = require("../models/user");

async function dropTables() {
    try {
        await User.drop();
        console.log("Successfully dropped user table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

dropTables();