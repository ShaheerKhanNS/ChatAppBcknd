const express = require("express");

const messageController = require("../controllers/messageController");
const authController = require("../controllers/authController");

const router = express.Router();
router
  .route("/")

  .post(
    authController.currentUser,
    messageController.uploadImage,
    messageController.createMessage
  );

router
  .route("/:groupId")
  .get(authController.currentUser, messageController.getMessage);

module.exports = router;
