const Sequelize = require("sequelize");

exports.init_table = function(sequelize) {
  return sequelize.define('message', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      require: true,
      primaryKey: true,
    },
    content: {
      type: Sequelize.STRING(1024),
      require: true,
      allowNull: false,
    },
  });
};