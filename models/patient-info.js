const   Sequelize   = require("sequelize"),
        sequelize   = require("../db/sequelize"),
        User        = require("./user");


let patient_info = module.exports = sequelize.define('patient_info', {
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

patient_info.belongsTo(User, {foreignKey: 'user_id'});