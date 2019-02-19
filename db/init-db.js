const sequelize         = require("./sequelize");

async function createTables() {
    try {
        console.log("Attempting to create tables");
        await sequelize.sync();
        console.log("Successfully created table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

await createTables()