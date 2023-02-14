const express = require("express");
const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

const router = express.Router();
router
  .route("/")
  .get(authController.currentUser, messageController.getMessage)
  .post(authController.currentUser, messageController.createMessage);

module.exports = router;
