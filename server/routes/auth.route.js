const express = require("express");
const {
  registerUser,
  logInUser,
  sendVerificationCode,
  verifyCode,
  logOutUser,
  me,
  sendForgetPasswordCode,
  forgetPasswordConfirm,
  changePassword,
} = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.get("/send-verification-code", verifyToken, sendVerificationCode);
router.post("/verify-code", verifyToken, verifyCode);
router.get("/logout", logOutUser)
router.get("/me", verifyToken, me)
router.post("/send-forget-password-code", sendForgetPasswordCode)
router.post("/forget-password-confirm", forgetPasswordConfirm)
router.post("/change-password", changePassword)

module.exports = router;
