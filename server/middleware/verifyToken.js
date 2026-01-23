const { errorResponse } = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    const token = req.cookies?.token || bearerToken;

    if (!token) return errorResponse(res, 401, "Unauthorized access");

    const decoded = jwt.verify(token, jwt_secret);

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    return errorResponse(res, 401, "Unauthorized access");
  }
};

module.exports = verifyToken;
