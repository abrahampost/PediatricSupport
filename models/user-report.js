const Sequelize = require("sequelize");

exports.init_table = function (sequelize) {
    return sequelize.define('user_report', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            require: true,
            primaryKey: true
        },
        reporter_id: {
            type: Sequelize.INTEGER,
            require: true,
            allowNull: false
        },
        reported_id: {
            type: Sequelize.INTEGER,
            require: true,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            require: true,
            allowNull: false,
            validate: {
                isIn: [['pending', 'resolved']]
            }
        },
        description: {
            type: Sequelize.STRING(1024),
            allowNull: true,
        }
    });
}