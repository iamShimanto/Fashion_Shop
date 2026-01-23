const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: { type: String, required: true, trim: true },
    slug: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },

    unitPrice: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    quantity: { type: Number, required: true, min: 1 },

    size: { type: String, default: "", trim: true },
    color: {
      name: { type: String, default: "", trim: true },
      code: { type: String, default: "", trim: true },
    },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },

    country: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    street: { type: String, default: "", trim: true },
    postalCode: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: { type: [orderItemSchema], required: true, default: [] },
    currency: { type: String, default: "USD", trim: true },

    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },

    shippingMethod: {
      type: String,
      enum: ["free", "local", "flat"],
      default: "free",
      index: true,
    },

    shippingAddress: { type: addressSchema, default: {} },
    note: { type: String, default: "", trim: true, maxlength: 2000 },

    paymentMethod: {
      type: String,
      enum: ["cod", "card", "paypal", "applepay"],
      default: "cod",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    transactionId: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
