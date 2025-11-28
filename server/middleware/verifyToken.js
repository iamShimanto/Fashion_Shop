const { errorResponse } = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return errorResponse(res, 403, "Unauthorized access, token not found");
    }

    const decoded = await jwt.verify(token, jwt_secret);

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    return errorResponse(res, 500, "Verify token failed", error);
  }
};

module.exports = verifyToken;
