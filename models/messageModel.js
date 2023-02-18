const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Message = sequelize.define("messages", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  message: {
    type: Sequelize.STRING,
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Message;
