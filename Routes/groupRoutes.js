const express = require("express");
const authController = require("../controllers/authController");
const groupController = require("../controllers/groupController");

const router = express.Router();
router
  .route("/creategroup")
  .post(authController.currentUser, groupController.createGroup);

router
  .route("/adduser")
  .post(authController.currentUser, groupController.addUserToGroup);

module.exports = router;
