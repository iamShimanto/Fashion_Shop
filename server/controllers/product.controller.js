const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const slugify = require("../utils/slugify");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  safeDeleteFromCloudinary,
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

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function truthyQuery(value) {
  if (value === undefined || value === null) return false;
  const v = String(value).trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
}

function hasValidUniqueSerials(images) {
  if (!Array.isArray(images) || images.length === 0) return true;
  const serials = images
    .map((img) => Number(img?.serial))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (serials.length !== images.length) return false;
  return new Set(serials).size === serials.length;
}

function initializeSerialsInOrder(images) {
  if (!Array.isArray(images)) return;
  for (let i = 0; i < images.length; i += 1) {
    images[i].serial = i + 1;
  }
}

function maxSerial(images) {
  if (!Array.isArray(images) || images.length === 0) return 0;
  let max = 0;
  for (const img of images) {
    const s = Number(img?.serial);
    if (Number.isFinite(s) && s > max) max = s;
  }
  return max;
}

function normalizedImagesForClient(product) {
  const raw = Array.isArray(product?.images) ? product.images : [];
  const mapped = raw.map((img, idx) => {
    const serial =
      Number.isFinite(Number(img?.serial)) && Number(img.serial) > 0
        ? Number(img.serial)
        : idx + 1;
    return {
      serial,
      url: img?.url,
      publicId: img?.publicId || "",
    };
  });

  mapped.sort((a, b) => a.serial - b.serial);

  return {
    urls: mapped.map((x) => x.url).filter(Boolean),
    meta: mapped,
  };
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

  const images = normalizedImagesForClient(p);

  return {
    ...p,
    oldPrice: p.compareAtPrice,
    // Keep legacy/public shape as array of URLs
    images: images.urls,
    // Admin and advanced clients can use metadata (serial/publicId)
    imagesMeta: images.meta,
  };
}

const listProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const q = (req.query.q || "").toString().trim();
    const category = (req.query.category || "").toString().trim();
    const gender = (req.query.gender || "").toString().trim().toLowerCase();
    const onSale = truthyQuery(req.query.onSale);

    const minPrice =
      req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice =
      req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;

    const filter = {};

    // Public endpoint: ALWAYS restrict to active products
    filter.status = "active";

    if (gender && ["men", "women", "unisex"].includes(gender)) {
      filter.gender = gender;
    }

    if (category) {
      filter.categories = {
        $regex: `^${escapeRegex(category)}$`,
        $options: "i",
      };
    }

    if (onSale) {
      filter.compareAtPrice = { $ne: null };
      filter.$expr = { $gt: ["$compareAtPrice", "$price"] };
    }

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

    // Best-seller sort uses Orders aggregation and preserves ranking order.
    if (sortParam === "bestSeller") {
      const top = await Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        { $match: { "items.product": { $type: "objectId" } } },
        {
          $group: {
            _id: "$items.product",
            qty: { $sum: "$items.quantity" },
          },
        },
        { $sort: { qty: -1 } },
        { $limit: 500 },
      ]);

      const rankedIds = top.map((x) => String(x._id));
      if (rankedIds.length === 0) {
        return successResponse(res, 200, "Products fetched", {
          items: [],
          meta: { page, limit, total: 0, pages: 0 },
        });
      }

      const rankedSet = new Set(rankedIds);
      const products = await Product.find({
        ...filter,
        _id: { $in: Array.from(rankedSet) },
      });

      const byRank = new Map(rankedIds.map((id, idx) => [id, idx]));
      const rankedProducts = products
        .slice()
        .sort(
          (a, b) =>
            (byRank.get(String(a._id)) ?? Number.MAX_SAFE_INTEGER) -
            (byRank.get(String(b._id)) ?? Number.MAX_SAFE_INTEGER),
        );

      const total = rankedProducts.length;
      const paged = rankedProducts.slice(skip, skip + limit);

      return successResponse(res, 200, "Products fetched", {
        items: paged.map(toClientProduct),
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

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
    const gender = (req.query.gender || "").toString().trim().toLowerCase();
    const onSale = truthyQuery(req.query.onSale);

    const minPrice =
      req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice =
      req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;

    const filter = {};
    if (status) filter.status = status;
    if (gender && ["men", "women", "unisex"].includes(gender)) {
      filter.gender = gender;
    }
    if (category) {
      filter.categories = {
        $regex: `^${escapeRegex(category)}$`,
        $options: "i",
      };
    }

    if (onSale) {
      filter.compareAtPrice = { $ne: null };
      filter.$expr = { $gt: ["$compareAtPrice", "$price"] };
    }

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

    if (sortParam === "bestSeller") {
      const top = await Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        { $match: { "items.product": { $type: "objectId" } } },
        {
          $group: {
            _id: "$items.product",
            qty: { $sum: "$items.quantity" },
          },
        },
        { $sort: { qty: -1 } },
        { $limit: 500 },
      ]);

      const rankedIds = top.map((x) => String(x._id));
      const rankedSet = new Set(rankedIds);

      const products = rankedIds.length
        ? await Product.find({
            ...filter,
            _id: { $in: Array.from(rankedSet) },
          })
        : [];

      const byRank = new Map(rankedIds.map((id, idx) => [id, idx]));
      const rankedProducts = products
        .slice()
        .sort(
          (a, b) =>
            (byRank.get(String(a._id)) ?? Number.MAX_SAFE_INTEGER) -
            (byRank.get(String(b._id)) ?? Number.MAX_SAFE_INTEGER),
        );

      const total = rankedProducts.length;
      const paged = rankedProducts.slice(skip, skip + limit);

      return successResponse(res, 200, "Products fetched", {
        items: paged.map(toClientProduct),
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

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
      gender,
      categories,
      tags,
      colors,
      sizes,
      status,
      isFeatured,
      inventory,
      inventoryTrack,
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

    const parsedInventory = parseJsonMaybe(inventory, undefined);
    const trackInventory =
      parsedInventory && typeof parsedInventory === "object"
        ? parsedInventory.track
        : inventoryTrack;
    const resolvedTrack =
      trackInventory === undefined
        ? true
        : String(trackInventory) === "true" || trackInventory === true;

    const rawQuantity =
      parsedInventory && typeof parsedInventory === "object"
        ? parsedInventory.quantity
        : inventoryQuantity;
    const resolvedQuantity =
      rawQuantity !== undefined && rawQuantity !== null
        ? Math.max(0, Number(rawQuantity) || 0)
        : 0;

    const images = [];
    const files = req.files || [];
    let serial = 1;
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file, "products");
      images.push({
        serial,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
      serial += 1;
    }

    const normalizedGender = (gender || "").toString().trim().toLowerCase();

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
      gender: ["men", "women", "unisex"].includes(normalizedGender)
        ? normalizedGender
        : "unisex",
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
        track: resolvedTrack,
        quantity: resolvedQuantity,
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

    if (!hasValidUniqueSerials(product.images)) {
      initializeSerialsInOrder(product.images);
    }

    const {
      title,
      slug,
      description,
      price,
      compareAtPrice,
      currency,
      sku,
      vendor,
      gender,
      categories,
      tags,
      colors,
      sizes,
      status,
      isFeatured,
      inventory,
      inventoryTrack,
      inventoryQuantity,
      removeImagePublicIds,
      replaceImages,
    } = req.body;

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (currency !== undefined) product.currency = currency;
    if (sku !== undefined) product.sku = sku || undefined;
    if (vendor !== undefined) product.vendor = vendor;

    if (gender !== undefined) {
      const normalizedGender = (gender || "").toString().trim().toLowerCase();
      if (["men", "women", "unisex"].includes(normalizedGender)) {
        product.gender = normalizedGender;
      }
    }
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

    const parsedInventory = parseJsonMaybe(inventory, undefined);
    if (parsedInventory && typeof parsedInventory === "object") {
      if (parsedInventory.track !== undefined) {
        product.inventory.track =
          String(parsedInventory.track) === "true" ||
          parsedInventory.track === true;
      }
      if (parsedInventory.quantity !== undefined) {
        product.inventory.quantity = Math.max(
          0,
          Number(parsedInventory.quantity) || 0,
        );
      }
    }

    if (inventoryTrack !== undefined) {
      product.inventory.track =
        String(inventoryTrack) === "true" || inventoryTrack === true;
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
        await safeDeleteFromCloudinary({
          publicId: img.publicId,
          url: img.url,
        });
      }
      product.images = [];
    }

    const files = req.files || [];

    // Replace existing image by serial: file field name must be `replace_serial_<n>`
    for (const file of files) {
      const match = /^replace_serial_(\d+)$/.exec(file?.fieldname || "");
      if (!match) continue;

      const serialToReplace = Number(match[1]);
      if (!Number.isFinite(serialToReplace) || serialToReplace <= 0) {
        return errorResponse(res, 400, "Invalid image serial");
      }

      const target = (product.images || []).find(
        (img) => Number(img?.serial) === serialToReplace,
      );
      if (!target) {
        return errorResponse(
          res,
          400,
          `Image serial ${serialToReplace} not found`,
        );
      }

      await safeDeleteFromCloudinary({
        publicId: target.publicId,
        url: target.url,
      });
      const uploaded = await uploadToCloudinary(file, "products");
      target.url = uploaded.secure_url;
      target.publicId = uploaded.public_id;
    }

    // Add new images (field name `images`): appended with increasing serial
    let nextSerial = maxSerial(product.images);
    for (const file of files) {
      if ((file?.fieldname || "") !== "images") continue;
      const uploaded = await uploadToCloudinary(file, "products");
      nextSerial += 1;
      product.images.push({
        serial: nextSerial,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    if (Array.isArray(product.images) && product.images.length > 1) {
      product.images = product.images
        .slice()
        .sort((a, b) => Number(a.serial || 0) - Number(b.serial || 0));
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
      await safeDeleteFromCloudinary({ publicId: img.publicId, url: img.url });
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
