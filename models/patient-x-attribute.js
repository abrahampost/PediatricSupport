const   Sequelize   = require("sequelize"),
        sequelize   = require("../db/sequelize"),
        User        = require("./user")
        Attribute   = require("./attribute");


let patient_x_attribute = module.exports = sequelize.define('patient_x_attribute', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        require: true,
        primaryKey: true
    }
});

patient_x_attribute.belongsTo(User, {foreignKey: {name: 'patient_id', allowNull: false}});
patient_x_attribute.belongsTo(Attribute, {foreignKey: {name: 'attribute_id', allowNull: false}});