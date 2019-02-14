const Sequelize = require("sequelize");

exports.init_table = function (sequelize) {
    return sequelize.define('patient_info', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            require: true,
            primaryKey: true
        },
        biography: {
            type: Sequelize.STRING,
            allowNull: true,
            require: true
        }
    });
}