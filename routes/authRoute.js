const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")

router.route("/login").post(authController.login)
router.route("/register").post(authController.signup)
router.route("/forgot-password").post(authController.forgotPassword)
router.route("/reset-password/:token").post(authController.resetPassword)
router.route("/logout").get(authController.logout)

module.exports = router