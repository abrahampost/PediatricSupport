const Sequelize = require("sequelize");

exports.init_table = function (sequelize) {
    return sequelize.define('patient_x_parent', {
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
        parent_id: {
            type: Sequelize.INTEGER,
            require: true,
            allowNull: false
        }
    });
}