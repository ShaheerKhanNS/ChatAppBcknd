const express = require("express");
const usercontroller = require("../controllers/userController");
const router = express.Router();

router.route("/signup").post(usercontroller.createUser);
router.route("/login").post(usercontroller.login);

module.exports = router;
