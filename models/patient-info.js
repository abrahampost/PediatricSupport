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
            defaultValue: ""
        },
        avatarClothes: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false,
            defaultValue: "1"
        },
        avatarHeads: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false,
            defaultValue: "1"
        },
        avatarHats: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false,
            defaultValue: "1"
        },
        avatarAccessories: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false,
            defaultValue: "1"
        }
    });
}