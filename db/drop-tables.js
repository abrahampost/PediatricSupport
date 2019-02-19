const sequelize         = require("./sequelize");

async function dropTables() {
    try {
        await sequelize.drop();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

dropTables();