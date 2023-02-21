const passwordController = require("../controllers/passwordResetCntrl");

const express = require("express");

const router = express.Router();

router.route("/sendmail").post(passwordController.passwordResetMail);
router.route("/resetPassword/:id").get(passwordController.resetPasswordPage);
router.route("/updatePassword/:id").post(passwordController.updatePassword);

module.exports = router;
