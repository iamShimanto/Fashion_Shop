const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    code: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null, min: 0 },
    currency: { type: String, default: "USD", trim: true },

    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    vendor: { type: String, default: "", trim: true, index: true },

    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
      index: true,
    },

    categories: [{ type: String, trim: true, index: true }],
    tags: [{ type: String, trim: true, index: true }],

    colors: { type: [colorSchema], default: [] },
    sizes: { type: [String], default: [] },

    images: { type: [imageSchema], default: [] },

    inventory: {
      track: { type: Boolean, default: true },
      quantity: { type: Number, default: 0, min: 0 },
    },

    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

productSchema.virtual("inStock").get(function () {
  if (!this.inventory?.track) return true;
  return (this.inventory?.quantity || 0) > 0;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
