const   Sequelize   = require("sequelize"),
        sequelize   = require("../db/sequelize"),
        User        = require("./user"),
        Attribute   = require("./attribute");


let user_match = module.exports = sequelize.define('user_match', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        require: true,
        primaryKey: true
    },
    type: {
        type: Sequelize.STRING,
        require: true,
        allowNull: false,
        validate: {
            isIn: [['pending','matched','blocked']]
        }
    }
});

user_match.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}});
user_match.belongsTo(Attribute, {foreignKey: {name: 'attribute_id', allowNull: false}});