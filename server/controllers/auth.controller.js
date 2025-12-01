const generateToken = require("../middleware/generateToken");
const User = require("../models/auth.model");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const bcrypt = require("bcrypt");
const sendVerifyEmail = require("../utils/sendVerifyEmail");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName) return errorResponse(res, 400, "FullName is required");
    if (!email) return errorResponse(res, 400, "Email is required");
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, "Use valid email");
    }
    if (!password) return errorResponse(res, 400, "Password is required");
    if (password.length < 6)
      return errorResponse(res, 400, "Password must be 6 characters");
    if (!passwordRegex.test(password)) {
      return errorResponse(res, 400, "use strong password");
    }

    const existUser = await User.findOne({ email });
    if (existUser) return errorResponse(res, 400, "User already exist");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await user.save();
    user.password = undefined;
    user.emailVerifyToken = undefined;
    return successResponse(res, 201, "User registration successfully", user);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return errorResponse(res, 400, "Email is required");
    if (!password) return errorResponse(res, 400, "Password is required");
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, "Enter a valid email");
    }
    if (password.length < 6)
      return errorResponse(res, 400, "password must be 6 characters");
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return errorResponse(res, 401, "Access Denied, Wrong Password");

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    user.password = undefined;

    return successResponse(
      res,
      200,
      "User login Successfully",
      (data = {
        user,
        token,
      })
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const sendVerificationCode = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) return errorResponse(res, 400, "User id not found");

    const existUser = await User.findById(id);
    if (!existUser) return errorResponse(res, 400, "User not found");

    if (existUser.emailVerified)
      return errorResponse(res, 400, "Email already verified");
    if (Date.now() < existUser.emailVerifyCodeExpire) {
      return errorResponse(res, 400, "Verify code already sent to your email");
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    existUser.emailVerifyToken = code;
    existUser.emailVerifyCodeExpire = expiry;

    await sendVerifyEmail(
      existUser.email,
      "Email verification code",
      code,
      "Verify your account"
    );

    await existUser.save();
    return successResponse(
      res,
      200,
      "Email verification code sent successfully"
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    const id = req.userId;
    if (!code) return errorResponse(res, 400, "Please enter verify code");
    if (!id) return errorResponse(res, 400, "User id not found");
    const existUser = await User.findById(id);
    if (!existUser) {
      return errorResponse(res, 404, "User not found");
    }
    if (existUser.emailVerified) {
      return errorResponse(res, 400, "Email already verified");
    }
    if (Date.now() > existUser.emailVerifyCodeExpire) {
      return errorResponse(res, 400, "Verify code expired");
    }

    if (code == existUser.emailVerifyToken) {
      existUser.emailVerified = true;
      existUser.emailVerifyCodeExpire = null;
      existUser.emailVerifyToken = null;
      await existUser.save();
      return successResponse(res, 200, "Email verified successfully");
    } else {
      return errorResponse(res, 400, "Email verify code is wrong");
    }
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return successResponse(res, 200, "Logout successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const me = async (req, res) => {
  try {
    const id = req.userId;
    if (!id) {
      return errorResponse(res, 400, "User id not found");
    }
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    user.password = undefined;
    return successResponse(res, 200, "User found", user);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const sendForgetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, 400, "Please enter your email");
    if (!emailRegex.test(email)) {
      return successResponse(res, 400, "Enter valid email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not exist");
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    user.forgetPasswordToken = code;
    user.forgetPasswordCodeExpire = expiry;

    await sendVerifyEmail(
      user.email,
      "Password Reset code",
      code,
      "Change your Password"
    );
    await user.save();
    return successResponse(res, 200, "Reset password code sent to your email");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const forgetPasswordConfirm = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email) return errorResponse(res, 400, "Email is required");
    if (!emailRegex.test(email))
      return errorResponse(res, 400, "Enter valid email");
    if (!code) return errorResponse(res, 400, "Password reset code required");
    if (!newPassword) return errorResponse(res, 400, "New Password required");
    if (!passwordRegex.test(newPassword))
      return errorResponse(res, 400, "Use strong password");

    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, 400, "User not found");
    if (Date.now() > user.forgetPasswordCodeExpire) {
      return errorResponse(res, 400, "Password reset code is expired");
    }
    const checkPassword = await bcrypt.compare(newPassword, user.password);
    if (checkPassword) {
      return errorResponse(res, 401, "You entered an old password");
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = newHashedPassword;
    user.forgetPasswordCodeExpire = null;
    user.forgetPasswordToken = null;
    await user.save();

    return successResponse(res, 200, "Password change successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email) return errorResponse(res, 400, "Email is required");
    if (!emailRegex.test(email))
      return errorResponse(res, 400, "Enter valid email");
    if (!oldPassword)
      return errorResponse(res, 400, "Old password is required");
    if (!newPassword)
      return errorResponse(res, 400, "New Password is required");
    if (!passwordRegex.test(newPassword))
      return errorResponse(res, 400, "use strong new password");

    if(oldPassword === newPassword) return errorResponse(res, 400, "Old password and New password is same")

    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, 400, "User not found");

    const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkOldPassword)
      return errorResponse(res, 401, "Please enter valid old password");

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = newHashedPassword;
    await user.save();

    return successResponse(res, 200, "User password change successfully");
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

module.exports = {
  registerUser,
  logInUser,
  sendVerificationCode,
  verifyCode,
  logOutUser,
  me,
  sendForgetPasswordCode,
  forgetPasswordConfirm,
  changePassword,
};
