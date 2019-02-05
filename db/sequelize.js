let Sequelize = require("sequelize");

if (!process.env.DATABASE_URL) {
    require("dotenv").config()
}

let options = {
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false,
    logging: false
}

let sequelize;
if (process.env.NODE_ENV == 'test') {
    sequelize = new Sequelize(process.env.TEST_DATABASE_URL, options);
} else if (process.env.NODE_ENV != "testlocal") {
    sequelize = new Sequelize(process.env.DATABASE_URL, options);
} else {
    //this only tests locally
    options['dialect'] = 'sqlite';
    options['storage'] = 'db/data.db';
    sequelize = new Sequelize("local", "root", "pass", options);
}

module.exports = sequelize;