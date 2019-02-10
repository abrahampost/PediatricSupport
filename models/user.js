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
        type: Sequelize.STRING,
        allowNull: false,
        require: true,
        unique: true,
        validate: {
            isAlphanumeric: true,
            len: [5,32]
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        require: true
    },
    email: {
        type: Sequelize.STRING,
        require: true,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    type: {
        type: Sequelize.STRING,
        require: true,
        allowNull: false,
        validate: {
            isIn: [['admin','parent','patient']]
        }
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