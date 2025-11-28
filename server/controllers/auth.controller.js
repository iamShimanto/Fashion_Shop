const User = require("../models/auth.model");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const bcrypt = require("bcrypt");

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

    user.password = undefined;

    return successResponse(res, 200, "User login Successfully", user);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Internal server error", error);
  }
};

module.exports = {
  registerUser,
  logInUser,
};
