const { errorResponse } = require("../utils/responseHandler");

const requireRole = (...allowedRoles) => {
  const normalized = allowedRoles.flat().filter(Boolean);

  return (req, res, next) => {
    if (!req.role) return errorResponse(res, 401, "Unauthorized access");

    if (normalized.length > 0 && !normalized.includes(req.role)) {
      return errorResponse(res, 403, "Forbidden");
    }

    return next();
  };
};

module.exports = requireRole;
