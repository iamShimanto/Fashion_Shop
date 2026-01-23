const mongoose = require("mongoose");
const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const slugify = require("../utils/slugify");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryHelper");

function parseJsonMaybe(value, fallback) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed);
  } catch {
    return fallback;
  }
}

async function generateUniqueSlug(base, productIdToExclude) {
  const root = slugify(base);
  if (!root) return null;

  let candidate = root;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate };
    if (productIdToExclude) query._id = { $ne: productIdToExclude };

    const exists = await Product.exists(query);
    if (!exists) return candidate;

    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
}

function toClientProduct(productDoc) {
  const p = productDoc?.toObject ? productDoc.toObject() : productDoc;
  if (!p) return p;

  return {
    ...p,
    oldPrice: p.compareAtPrice,
    images: Array.isArray(p.images) ? p.images.map((img) => img.url) : [],
  };
}

const listProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const q = (req.query.q || "").toString().trim();
    const category = (req.query.category || "").toString().trim();

    const minPrice =
      req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice =
      req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;

    const filter = {};

    // Public endpoint: ALWAYS restrict to active products
    filter.status = "active";

    if (category) filter.categories = category;

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { vendor: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null && !Number.isNaN(minPrice))
        filter.price.$gte = minPrice;
      if (maxPrice !== null && !Number.isNaN(maxPrice))
        filter.price.$lte = maxPrice;
    }

    const sortParam = (req.query.sort || "newest").toString();
    const sort =
      sortParam === "priceLowHigh"
        ? { price: 1 }
        : sortParam === "priceHighLow"
          ? { price: -1 }
          : { createdAt: -1 };

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return successResponse(res, 200, "Products fetched", {
      items: items.map(toClientProduct),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const listProductsAdmin = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const q = (req.query.q || "").toString().trim();
    const category = (req.query.category || "").toString().trim();
    const status = (req.query.status || "").toString().trim();

    const minPrice =
      req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice =
      req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.categories = category;

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { vendor: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
        { slug: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
      ];
    }

    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null && !Number.isNaN(minPrice))
        filter.price.$gte = minPrice;
      if (maxPrice !== null && !Number.isNaN(maxPrice))
        filter.price.$lte = maxPrice;
    }

    const sortParam = (req.query.sort || "newest").toString();
    const sort =
      sortParam === "priceLowHigh"
        ? { price: 1 }
        : sortParam === "priceHighLow"
          ? { price: -1 }
          : { createdAt: -1 };

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return successResponse(res, 200, "Products fetched", {
      items: items.map(toClientProduct),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const slug = (req.params.slug || "").toString().trim().toLowerCase();
    if (!slug) return errorResponse(res, 400, "Slug is required");

    const product = await Product.findOne({ slug, status: "active" });
    if (!product) return errorResponse(res, 404, "Product not found");

    return successResponse(
      res,
      200,
      "Product fetched",
      toClientProduct(product),
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid product id");
    }

    const product = await Product.findOne({ _id: id, status: "active" });
    if (!product) return errorResponse(res, 404, "Product not found");

    return successResponse(
      res,
      200,
      "Product fetched",
      toClientProduct(product),
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const getProductBySlugAdmin = async (req, res) => {
  try {
    const slug = (req.params.slug || "").toString().trim().toLowerCase();
    if (!slug) return errorResponse(res, 400, "Slug is required");

    const product = await Product.findOne({ slug });
    if (!product) return errorResponse(res, 404, "Product not found");

    return successResponse(
      res,
      200,
      "Product fetched",
      toClientProduct(product),
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const getProductByIdAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid product id");
    }

    const product = await Product.findById(id);
    if (!product) return errorResponse(res, 404, "Product not found");

    return successResponse(
      res,
      200,
      "Product fetched",
      toClientProduct(product),
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      price,
      compareAtPrice,
      currency,
      sku,
      vendor,
      categories,
      tags,
      colors,
      sizes,
      status,
      isFeatured,
      inventoryQuantity,
    } = req.body;

    if (!title) return errorResponse(res, 400, "Title is required");

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return errorResponse(res, 400, "Valid price is required");
    }

    if (
      compareAtPrice !== undefined &&
      compareAtPrice !== null &&
      String(compareAtPrice).trim() !== ""
    ) {
      const numericCompare = Number(compareAtPrice);
      if (Number.isNaN(numericCompare) || numericCompare < 0) {
        return errorResponse(res, 400, "Valid compareAtPrice is required");
      }
      if (numericCompare < numericPrice) {
        return errorResponse(
          res,
          400,
          "compareAtPrice must be greater than or equal to price",
        );
      }
    }

    const desiredSlugRaw = slug ? slug : title;
    const desiredSlug = await generateUniqueSlug(desiredSlugRaw);
    if (!desiredSlug) {
      return errorResponse(res, 400, "Unable to generate slug");
    }

    const parsedCategories = parseJsonMaybe(categories, categories);
    const parsedTags = parseJsonMaybe(tags, tags);
    const parsedColors = parseJsonMaybe(colors, colors);
    const parsedSizes = parseJsonMaybe(sizes, sizes);

    const images = [];
    const files = req.files || [];
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file, "products");
      images.push({ url: uploaded.secure_url, publicId: uploaded.public_id });
    }

    const product = await Product.create({
      title,
      slug: desiredSlug,
      description: description || "",
      price: numericPrice,
      compareAtPrice:
        compareAtPrice !== undefined &&
        compareAtPrice !== null &&
        String(compareAtPrice).trim() !== ""
          ? Number(compareAtPrice)
          : null,
      currency: currency || "USD",
      sku: sku || undefined,
      vendor: vendor || "",
      categories: Array.isArray(parsedCategories)
        ? parsedCategories
        : typeof parsedCategories === "string" && parsedCategories
          ? [parsedCategories]
          : [],
      tags: Array.isArray(parsedTags)
        ? parsedTags
        : typeof parsedTags === "string" && parsedTags
          ? [parsedTags]
          : [],
      colors: Array.isArray(parsedColors) ? parsedColors : [],
      sizes: Array.isArray(parsedSizes) ? parsedSizes : [],
      images,
      status: status || "active",
      isFeatured: String(isFeatured) === "true" || isFeatured === true,
      inventory: {
        track: true,
        quantity:
          inventoryQuantity !== undefined && inventoryQuantity !== null
            ? Math.max(0, Number(inventoryQuantity) || 0)
            : 0,
      },
    });

    return successResponse(
      res,
      201,
      "Product created",
      toClientProduct(product),
    );
  } catch (error) {
    if (error?.code === 11000) {
      return errorResponse(res, 400, "Duplicate field value", error);
    }
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid product id");
    }

    const product = await Product.findById(id);
    if (!product) return errorResponse(res, 404, "Product not found");

    const {
      title,
      slug,
      description,
      price,
      compareAtPrice,
      currency,
      sku,
      vendor,
      categories,
      tags,
      colors,
      sizes,
      status,
      isFeatured,
      inventoryQuantity,
      removeImagePublicIds,
      replaceImages,
    } = req.body;

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (currency !== undefined) product.currency = currency;
    if (sku !== undefined) product.sku = sku || undefined;
    if (vendor !== undefined) product.vendor = vendor;
    if (status !== undefined) product.status = status;
    if (isFeatured !== undefined)
      product.isFeatured = String(isFeatured) === "true" || isFeatured === true;

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return errorResponse(res, 400, "Valid price is required");
      }
      product.price = numericPrice;
    }

    if (compareAtPrice !== undefined) {
      if (compareAtPrice === null || String(compareAtPrice).trim() === "") {
        product.compareAtPrice = null;
      } else {
        const numericCompare = Number(compareAtPrice);
        if (Number.isNaN(numericCompare) || numericCompare < 0) {
          return errorResponse(res, 400, "Valid compareAtPrice is required");
        }
        product.compareAtPrice = numericCompare;
      }
    }

    if (
      product.compareAtPrice !== null &&
      product.compareAtPrice !== undefined &&
      product.compareAtPrice < product.price
    ) {
      return errorResponse(
        res,
        400,
        "compareAtPrice must be greater than or equal to price",
      );
    }

    if (inventoryQuantity !== undefined) {
      product.inventory.quantity = Math.max(0, Number(inventoryQuantity) || 0);
    }

    const parsedCategories = parseJsonMaybe(categories, categories);
    if (parsedCategories !== undefined) {
      product.categories = Array.isArray(parsedCategories)
        ? parsedCategories
        : typeof parsedCategories === "string" && parsedCategories
          ? [parsedCategories]
          : [];
    }

    const parsedTags = parseJsonMaybe(tags, tags);
    if (parsedTags !== undefined) {
      product.tags = Array.isArray(parsedTags)
        ? parsedTags
        : typeof parsedTags === "string" && parsedTags
          ? [parsedTags]
          : [];
    }

    const parsedColors = parseJsonMaybe(colors, colors);
    if (parsedColors !== undefined) {
      product.colors = Array.isArray(parsedColors) ? parsedColors : [];
    }

    const parsedSizes = parseJsonMaybe(sizes, sizes);
    if (parsedSizes !== undefined) {
      product.sizes = Array.isArray(parsedSizes) ? parsedSizes : [];
    }

    // Slug update
    if (slug !== undefined) {
      const desired = slugify(slug);
      if (!desired) return errorResponse(res, 400, "Invalid slug");
      product.slug = await generateUniqueSlug(desired, product._id);
    } else if (title !== undefined) {
      // If title changes and slug not provided, keep slug stable unless it was auto-generated earlier.
      // For simplicity, regenerate to keep SEO-friendly.
      const nextSlug = await generateUniqueSlug(product.title, product._id);
      if (nextSlug) product.slug = nextSlug;
    }

    const removeIds = parseJsonMaybe(
      removeImagePublicIds,
      removeImagePublicIds,
    );
    if (Array.isArray(removeIds) && removeIds.length > 0) {
      for (const publicId of removeIds) {
        if (!publicId) continue;
        await deleteFromCloudinary(publicId);
      }
      product.images = (product.images || []).filter(
        (img) => !removeIds.includes(img.publicId),
      );
    }

    const shouldReplace =
      String(replaceImages) === "true" || replaceImages === true;
    if (
      shouldReplace &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      for (const img of product.images) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
      }
      product.images = [];
    }

    // Add new images
    const files = req.files || [];
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file, "products");
      product.images.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    await product.save();

    return successResponse(
      res,
      200,
      "Product updated",
      toClientProduct(product),
    );
  } catch (error) {
    if (error?.code === 11000) {
      return errorResponse(res, 400, "Duplicate field value", error);
    }
    return errorResponse(res, 500, "Internal server error", error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid product id");
    }

    const product = await Product.findById(id);
    if (!product) return errorResponse(res, 404, "Product not found");

    for (const img of product.images || []) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }

    await Product.deleteOne({ _id: id });

    return successResponse(res, 200, "Product deleted", { id });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
};

module.exports = {
  listProducts,
  listProductsAdmin,
  getProductBySlug,
  getProductById,
  getProductBySlugAdmin,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
};
