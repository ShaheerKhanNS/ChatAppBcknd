/*

for many to many relations we need an in between table

*/

const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const userGroup = sequelize.define("user-group", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  admin: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
});

module.exports = userGroup;
