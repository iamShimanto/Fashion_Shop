const express = require("express");

const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");

const {
  adminListUsers,
  adminGetUserById,
  adminUpdateUser,
  adminDeleteUser,
} = require("../controllers/user.controller");

const router = express.Router();

// Admin-only user management
router.get("/admin", verifyToken, requireRole("admin"), adminListUsers);
router.get("/admin/:id", verifyToken, requireRole("admin"), adminGetUserById);
router.put("/admin/:id", verifyToken, requireRole("admin"), adminUpdateUser);
router.delete("/admin/:id", verifyToken, requireRole("admin"), adminDeleteUser);

module.exports = router;
