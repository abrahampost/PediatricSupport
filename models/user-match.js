const Sequelize = require("sequelize");

exports.init_table = function (sequelize) {
    return sequelize.define('user_match', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            require: true,
            primaryKey: true
        },
        user_one_id: {
            type: Sequelize.INTEGER,
            require: true
        },
        user_two_id: {
            type: Sequelize.INTEGER,
            require: true
        },
        type: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false,
            validate: {
                isIn: [['pending', 'matched', 'blocked']]
            }
        }
    });
}