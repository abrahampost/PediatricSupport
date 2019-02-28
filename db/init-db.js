const sequelize         = require("./sequelize");

async function createTables() {
    try {
        await sequelize.sync();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createTables()