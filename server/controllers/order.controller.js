const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { generateOrderNumber } = require("../utils/orderNumber");

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeShippingMethod(value) {
  const v = String(value || "free").toLowerCase();
  if (v === "local" || v === "flat" || v === "free") return v;
  return "free";
}

function shippingCostFor(method) {
  return method === "local" || method === "flat" ? 35 : 0;
}

function normalizePaymentMethod(value) {
  const v = String(value || "cod").toLowerCase();
  if (["cod", "card", "paypal", "applepay"].includes(v)) return v;
  return "cod";
}

async function createOrder(req, res) {
  const userId = req.userId;

  try {
    const { items, shippingAddress, shippingMethod, note, paymentMethod } =
      req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, "Order items are required");
    }

    const normalizedItems = items
      .map((it) => ({
        productId: it.productId || it.product || it._id,
        quantity: Math.max(1, asNumber(it.quantity ?? it.qty, 1)),
        size: (it.size || "").toString(),
        color: it.color || null,
      }))
      .filter((it) => it.productId);

    if (normalizedItems.length === 0) {
      return errorResponse(res, 400, "Valid order items are required");
    }

    const productIds = normalizedItems.map((it) => it.productId);

    // Load products and compute totals server-side
    const products = await Product.find({
      _id: { $in: productIds },
      status: "active",
    });

    const byId = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let currency = "USD";
    let subtotal = 0;
    let discount = 0;

    for (const line of normalizedItems) {
      const product = byId.get(String(line.productId));
      if (!product) {
        return errorResponse(res, 400, "One or more products are unavailable");
      }

      currency = product.currency || currency;

      const unitPrice = asNumber(product.price, 0);
      const compareAt =
        product.compareAtPrice !== null && product.compareAtPrice !== undefined
          ? asNumber(product.compareAtPrice, null)
          : null;

      subtotal += unitPrice * line.quantity;

      if (compareAt !== null && compareAt > unitPrice) {
        discount += (compareAt - unitPrice) * line.quantity;
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        slug: product.slug,
        image: product.images?.[0]?.url || "",
        unitPrice,
        compareAtPrice: compareAt,
        quantity: line.quantity,
        size: line.size || "",
        color:
          line.color && typeof line.color === "object"
            ? {
                name: (line.color.name || "").toString(),
                code: (line.color.code || "").toString(),
              }
            : { name: "", code: "" },
      });
    }

    const shipMethod = normalizeShippingMethod(shippingMethod);
    const shippingCost = shippingCostFor(shipMethod);
    const total = Math.max(0, subtotal + shippingCost - discount);

    // Inventory decrement (atomic per product) with rollback on failure
    const decremented = [];
    try {
      for (const item of orderItems) {
        const product = byId.get(String(item.product));
        if (!product?.inventory?.track) continue;

        const result = await Product.updateOne(
          { _id: product._id, "inventory.quantity": { $gte: item.quantity } },
          { $inc: { "inventory.quantity": -item.quantity } },
        );

        if (!result || result.modifiedCount !== 1) {
          throw new Error(`Insufficient stock for ${product.title}`);
        }

        decremented.push({ productId: product._id, qty: item.quantity });
      }
    } catch (e) {
      // rollback best-effort
      for (const d of decremented) {
        await Product.updateOne(
          { _id: d.productId },
          { $inc: { "inventory.quantity": d.qty } },
        );
      }
      return errorResponse(res, 400, e.message || "Stock not available");
    }

    // Unique order number (retry a few times)
    let orderNumber = generateOrderNumber();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const exists = await Order.exists({ orderNumber });
      if (!exists) break;
      orderNumber = generateOrderNumber();
    }

    const order = await Order.create({
      orderNumber,
      user: userId,
      items: orderItems,
      currency,
      subtotal,
      discount,
      shippingCost,
      total,
      shippingMethod: shipMethod,
      shippingAddress: shippingAddress || {},
      note: note || "",
      paymentMethod: normalizePaymentMethod(paymentMethod),
      paymentStatus: "pending",
      status: "pending",
    });

    return successResponse(res, 201, "Order created", order);
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function listMyOrders(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: req.userId }),
    ]);

    return successResponse(res, 200, "Orders fetched", {
      items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function getMyOrderById(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid order id");
    }

    const order = await Order.findOne({ _id: id, user: req.userId });
    if (!order) return errorResponse(res, 404, "Order not found");

    return successResponse(res, 200, "Order fetched", order);
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function adminListOrders(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 20)));
    const skip = (page - 1) * limit;

    const status = (req.query.status || "").toString().trim();
    const paymentStatus = (req.query.paymentStatus || "").toString().trim();
    const q = (req.query.q || "").toString().trim();

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (q) {
      filter.$or = [
        { orderNumber: { $regex: q, $options: "i" } },
        { "shippingAddress.email": { $regex: q, $options: "i" } },
        { "shippingAddress.phone": { $regex: q, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return successResponse(res, 200, "Orders fetched", {
      items,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function adminGetOrderById(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid order id");
    }

    const order = await Order.findById(id);
    if (!order) return errorResponse(res, 404, "Order not found");

    return successResponse(res, 200, "Order fetched", order);
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function adminUpdateOrder(req, res) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, "Invalid order id");
    }

    const order = await Order.findById(id);
    if (!order) return errorResponse(res, 404, "Order not found");

    const { status, paymentStatus, transactionId } = req.body || {};

    if (status !== undefined) {
      const next = String(status);
      if (!order.schema.path("status").enumValues.includes(next)) {
        return errorResponse(res, 400, "Invalid status");
      }
      order.status = next;
    }

    if (paymentStatus !== undefined) {
      const next = String(paymentStatus);
      if (!order.schema.path("paymentStatus").enumValues.includes(next)) {
        return errorResponse(res, 400, "Invalid paymentStatus");
      }
      order.paymentStatus = next;
    }

    if (transactionId !== undefined) {
      order.transactionId = String(transactionId || "");
    }

    await order.save();
    return successResponse(res, 200, "Order updated", order);
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

async function adminAnalytics(req, res) {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOf7Days = new Date(startOfToday);
    startOf7Days.setDate(startOf7Days.getDate() - 6);

    const [
      totalsAgg,
      todayCreatedAgg,
      statusCounts,
      deliveredTodayAgg,
      series,
    ] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenueAll: { $sum: "$total" },
            deliveredOrders: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, 1, 0],
              },
            },
            revenueDelivered: {
              $sum: {
                $cond: [{ $eq: ["$status", "delivered"] }, "$total", 0],
              },
            },
          },
        },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenueAll: { $sum: "$total" },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      // Treat "revenue recognized" as delivered orders updated today
      Order.aggregate([
        { $match: { status: "delivered", updatedAt: { $gte: startOfToday } } },
        {
          $group: {
            _id: null,
            deliveredOrders: { $sum: 1 },
            revenueDelivered: { $sum: "$total" },
          },
        },
      ]),
      // Delivered revenue series for last 7 days by delivery (updatedAt)
      Order.aggregate([
        {
          $match: {
            status: "delivered",
            updatedAt: { $gte: startOf7Days },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
            },
            orders: { $sum: 1 },
            revenue: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totals = totalsAgg[0] || {
      orders: 0,
      revenueAll: 0,
      deliveredOrders: 0,
      revenueDelivered: 0,
    };
    const todayCreated = todayCreatedAgg[0] || { orders: 0, revenueAll: 0 };
    const deliveredToday = deliveredTodayAgg[0] || {
      deliveredOrders: 0,
      revenueDelivered: 0,
    };

    // Fill missing dates for 7-day series
    const byDate = new Map(series.map((r) => [r._id, r]));
    const deliveredRevenueLast7Days = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(startOf7Days);
      d.setDate(startOf7Days.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const row = byDate.get(key);
      deliveredRevenueLast7Days.push({
        date: key,
        orders: row?.orders || 0,
        revenue: row?.revenue || 0,
      });
    }

    return successResponse(res, 200, "Analytics fetched", {
      totals: {
        orders: totals.orders || 0,
        revenue: totals.revenueDelivered || 0,
        revenueAll: totals.revenueAll || 0,
        deliveredOrders: totals.deliveredOrders || 0,
        revenueDelivered: totals.revenueDelivered || 0,
      },
      today: {
        orders: todayCreated.orders || 0,
        revenue: deliveredToday.revenueDelivered || 0,
        revenueAll: todayCreated.revenueAll || 0,
        deliveredOrders: deliveredToday.deliveredOrders || 0,
        revenueDelivered: deliveredToday.revenueDelivered || 0,
      },
      byStatus: statusCounts.reduce((acc, row) => {
        acc[row._id] = row.count;
        return acc;
      }, {}),
      deliveredRevenueLast7Days,
    });
  } catch (error) {
    return errorResponse(res, 500, "Internal server error", error);
  }
}

module.exports = {
  createOrder,
  listMyOrders,
  getMyOrderById,
  adminListOrders,
  adminGetOrderById,
  adminUpdateOrder,
  adminAnalytics,
};
