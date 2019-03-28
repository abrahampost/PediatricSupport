const Sequelize = require("sequelize");

exports.init_table = function (sequelize) {
    return sequelize.define('patient_x_attribute', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            require: true,
            primaryKey: true
        },
        patient_id: {
            type: Sequelize.INTEGER,
            require: true,
            allowNull: false
        },
        attribute_id: {
            type: Sequelize.INTEGER,
            require: true,
            allowNull: false
        }
    });
}