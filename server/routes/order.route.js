const express = require("express");

const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");

const {
  createOrder,
  listMyOrders,
  getMyOrderById,
  adminListOrders,
  adminGetOrderById,
  adminUpdateOrder,
  adminAnalytics,
} = require("../controllers/order.controller");

const router = express.Router();

// Customer (auth)
router.post("/", verifyToken, createOrder);
router.get("/my", verifyToken, listMyOrders);
router.get("/my/:id", verifyToken, getMyOrderById);

// Admin
router.get("/admin", verifyToken, requireRole("admin"), adminListOrders);
router.get(
  "/admin/analytics",
  verifyToken,
  requireRole("admin"),
  adminAnalytics,
);
router.get("/admin/:id", verifyToken, requireRole("admin"), adminGetOrderById);
router.put("/admin/:id", verifyToken, requireRole("admin"), adminUpdateOrder);

module.exports = router;
