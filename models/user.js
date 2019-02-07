const   Sequelize   = require("sequelize"),
        sequelize   = require("../db/sequelize");


module.exports = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        require: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
        require: true,
        unique: true,
        validate: {
            isAlphanumeric: true
        }
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
        require: true
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        require: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        require: true
    }
});