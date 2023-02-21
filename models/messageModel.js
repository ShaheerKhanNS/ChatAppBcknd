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
    type: Sequelize.TEXT("long"),
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
