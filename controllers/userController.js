const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRETKEY);
};

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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).json({
            status: "fail",
            message: "Something went wrong",
          });
        } else if (result === true) {
          res.status(200).json({
            status: "success",
            message: "logged in successfully",
            token: generateAccessToken(user.id),
          });
        } else {
          res.status(401).json({
            status: "fail",
            message: "UNAUTHORIZED",
          });
        }
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
