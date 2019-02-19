const sequelize         = require("./sequelize");

async function dropTables() {
    try {
        console.log("Dropping tables");
        await sequelize.drop();
        console.log("Successfully dropped table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
} 

dropTables();