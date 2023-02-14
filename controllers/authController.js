const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.currentUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETKEY);
    const user = await User.findByPk(decodedToken.userId);
    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
};
