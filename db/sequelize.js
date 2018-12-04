let Sequelize = require("sequelize");

if (!process.env.DATABASE_URL) {
    require("dotenv").config()
}

const sequelize = module.exports = new Sequelize(process.env.DATABASE_URL, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false,
    logging: false
});