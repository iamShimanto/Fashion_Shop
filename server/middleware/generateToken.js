const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const token = await jwt.sign(
      { userId: user._id, role: user.role },
      jwt_secret,
      { expiresIn: "7d" }
    );

    return token;
  } catch (error) {
    console.error("error generate token", error);
    throw error;
  }
};

module.exports = generateToken;
