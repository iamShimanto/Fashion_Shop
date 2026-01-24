const express = require("express");
const multer = require("multer");

const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requireRole");

const {
  listProducts,
  listProductsAdmin,
  getProductBySlug,
  getProductById,
  getProductBySlugAdmin,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();
const upload = multer();

// Admin read (role-based)
router.get("/admin", verifyToken, requireRole("admin"), listProductsAdmin);
router.get(
  "/admin/slug/:slug",
  verifyToken,
  requireRole("admin"),
  getProductBySlugAdmin,
);
router.get(
  "/admin/:id",
  verifyToken,
  requireRole("admin"),
  getProductByIdAdmin,
);

// Public
router.get("/", listProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin (role-based)
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  upload.any(),
  createProduct,
);
router.put(
  "/:id",
  verifyToken,
  requireRole("admin"),
  upload.any(),
  updateProduct,
);
router.delete("/:id", verifyToken, requireRole("admin"), deleteProduct);

module.exports = router;
