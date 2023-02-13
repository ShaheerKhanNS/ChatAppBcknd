const express = require("express");
const usercontroller = require("../controllers/userController");
const router = express.Router();

router
  .route("/")
  .get(usercontroller.getAllUsers)
  .post(usercontroller.createUser);

module.exports = router;
