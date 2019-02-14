const Sequelize = require("sequelize");

exports.init_table = function (sequelize) {
    return sequelize.define('attribute', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            require: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            require: true,
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
        type: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false,
            validate: {
                isIn: [['interest', 'diagnosis']]
            }
        }
    });
}