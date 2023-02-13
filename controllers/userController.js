const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phonenumber } = req.body;

    bcrypt.hash(password, 12, async (err, hash) => {
      try {
        await User.create({
          name,
          email,
          password: hash,
          phonenumber,
        });
        res.status(201).json({
          status: "success",
        });
      } catch (err) {
        res.status(400).json({
          status: "fail",
          message: err.message,
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
