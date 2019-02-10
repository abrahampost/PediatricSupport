const   Sequelize   = require("sequelize"),
        sequelize   = require("../db/sequelize"),
        User        = require("./user");


let patient_x_parent = module.exports = sequelize.define('patient_x_parent', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        require: true,
        primaryKey: true
    }
});

patient_x_parent.belongsTo(User, {foreignKey: {name: 'patient_id', allowNull: false}});
patient_x_parent.belongsTo(User, {foreignKey: {name: 'parent_id', allowNull: false}});