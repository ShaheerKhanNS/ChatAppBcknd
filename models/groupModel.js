const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Group = sequelize.define("groups", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  groupName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = Group;

/*
A User has many groups and groups can have many users
Group belongs to many users and users belong to many groups

*/
