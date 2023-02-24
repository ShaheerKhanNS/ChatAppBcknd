const express = require("express");
const authController = require("../controllers/authController");
const groupController = require("../controllers/groupController");

const router = express.Router();

router.route("/").get(authController.currentUser, groupController.getAllGroups);
router
  .route("/admin")
  .get(authController.currentUser, groupController.getAdminGroups);
router
  .route("/creategroup")
  .post(authController.currentUser, groupController.createGroup);

router
  .route("/adduser")
  .post(authController.currentUser, groupController.addUserToGroup);

router
  .route("/deleteuser")
  .post(authController.currentUser, groupController.deleteUser);

module.exports = router;
