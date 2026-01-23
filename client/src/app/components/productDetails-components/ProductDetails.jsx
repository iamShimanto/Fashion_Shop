"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/providers/CartProvider";

export default function ProductDetails({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const safeImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : ["/product-2.jpeg"];
  const safeColors = Array.isArray(product?.colors) ? product.colors : [];
  const safeSizes = Array.isArray(product?.sizes) ? product.sizes : [];

  const numericPrice = Number(product?.price || 0);
  const numericOldPrice =
    product?.oldPrice !== undefined && product?.oldPrice !== null
      ? Number(product.oldPrice)
      : null;
  const hasDiscount =
    numericOldPrice !== null &&
    !Number.isNaN(numericOldPrice) &&
    numericOldPrice > numericPrice;
  const discountPercent = hasDiscount
    ? Math.round(((numericOldPrice - numericPrice) / numericOldPrice) * 100)
    : 0;

  const stockQty = Number(product?.inventory?.quantity ?? 0);
  const inStock = product?.inStock ?? stockQty > 0;

  const [selectedImage, setSelectedImage] = useState(safeImages[0]);
  const [fadeKey, setFadeKey] = useState(0); // helps trigger animation
  const [selectedSize, setSelectedSize] = useState(safeSizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  const handleImageChange = (img) => {
    setSelectedImage(img);
    setFadeKey((k) => k + 1);
  };

  return (
    <>
      <div className="lg:w-full relative">
        <div className="sticky top-10">
          <div className="flex flex-col lg:flex-row gap-4 md:flex-1 md:max-w-[650px]">
            <div className="hidden lg:flex flex-col gap-3 md:gap-4 justify-start">
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleImageChange(img)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 rounded  overflow-hidden ${
                    selectedImage === img ? "border-brand" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`thumb-${i}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <div
              className="relative w-full rounded overflow-hidden shadow-xl"
              style={{
                height: "calc(50vw + 100px)",
                maxHeight: "600px",
                minHeight: "500px",
              }}
            >
              {/* made image half size on smaller devices */}
              <div key={fadeKey} className="w-full sm:h-[50vh] h-[25vh]">
                <Image
                  src={selectedImage}
                  alt="main product"
                  fill
                  className="object-cover animate-fadeIn"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
            <div className="lg:hidden flex gap-3 md:gap-4 justify-start">
              {safeImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleImageChange(img)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 rounded overflow-hidden ${
                    selectedImage === img ? "border-brand" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`thumb-${i}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-full max-h-screen overflow-y-auto  px-1 sm:px-4 space-y-6">
        <h1 className="text-2xl sm:text-4xl font-jakarta text-shadow-lighter text-dark/90 border-b border-dark/20 pb-4">
          {product.title}
        </h1>

        <div className="flex items-center gap-3">
          <span className="text-4xl sm:text-6xl font-bebas font-semibold tracking-wide text-shadow-lighter text-dark/90">
            ${numericPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="line-through text-gray-500 font-jakarta">
                ${numericOldPrice.toFixed(2)}
              </span>
              <span className="bg-red-500 text-white font-jakarta px-2 py-0.5 text-sm rounded">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        <div>
          <p className="text-md sm:text-lg text-dark/50 font-jakarta pr-3">
            {product?.description?.trim()
              ? product.description
              : "Premium fabric, modern fit, and designed for everyday comfort."}
          </p>
        </div>

        {safeColors.length > 0 && (
          <div>
            <p className="font-medium mb-2">Colors:</p>
            <div className="flex gap-2 flex-wrap">
              {safeColors.map((c, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: c.code || "#000" }}
                  className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-dark/80 cursor-pointer shadow-md hover:scale-85 duration-150"
                  title={c.name || "Color"}
                />
              ))}
            </div>
          </div>
        )}

        {safeSizes.length > 0 && (
          <div>
            <p className="font-medium mb-2">Size:</p>
            <div className="flex gap-2 flex-wrap">
              {safeSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-10 h-10 rounded-full border-2 text-sm cursor-pointer duration-250 hover:shadow-2xl hover:border-dark ${
                    selectedSize === s
                      ? "bg-black text-white"
                      : "border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 py-3">
          <p className="font-medium">Quantity:</p>
          <div className="flex items-center border-2 border-dark/60 rounded duration-150 hover:scale-105">
            <button
              className="px-3 py-1 cursor-pointer"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              className="px-3 py-1 cursor-pointer"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 border-b border-dark/20 pb-4">
          <button
            disabled={!inStock}
            onClick={() =>
              addItem(product, {
                quantity,
                size: selectedSize,
                color: safeColors?.[0] || null,
              })
            }
            className="flex-1 py-1.5 bg-dark text-2xl lg:text-4xl font-bebas cardButtonHover border-3 border-dark text-white rounded shadow hover:text-dark/90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {inStock
              ? `Add to Cart – $${numericPrice.toFixed(2)}`
              : "Out of Stock"}
          </button>
          <Link
            href={"/confirmOrder"}
            onClick={(e) => {
              e.preventDefault();
              if (!inStock) return;
              addItem(product, {
                quantity,
                size: selectedSize,
                color: safeColors?.[0] || null,
              });
              router.push("/confirmOrder");
            }}
            className=" flex-1 text-center py-1.5 bg-brand text-2xl lg:text-4xl font-bebas cardButtonHover border-3 border-brand text-white rounded shadow hover:text-dark/90 cursor-pointer"
          >
            Buy It Now
          </Link>
        </div>

        <div className="border-b border-dark/20 pb-4">
          <p className="text-sm md:text-md text-dark/80 font-jakarta pt-1">
            Estimated Delivery: 12-26 days (International), 3-6 days (United
            States)
          </p>
          <p className="text-sm md:text-md text-dark/80 font-jakarta pt-1">
            Return within 45 days of purchase. Duties & taxes are
            non-refundable.
          </p>
        </div>

        <div className="border-b border-dark/20 pb-4">
          <p className="text-sm md:text-md text-dark/70 font-jakarta pt-1">
            SKU: {product?.sku || "N/A"}
          </p>
          <p className="text-sm md:text-md text-dark/70 font-jakarta pt-1">
            Vendor: {product?.vendor || "N/A"}
          </p>
          <p className="text-sm md:text-md text-dark/70 font-jakarta pt-1">
            Available: {inStock ? "In stock" : "Out of stock"}
          </p>
          <p className="text-sm md:text-md text-dark/70 font-jakarta pt-1">
            Categories:{" "}
            {Array.isArray(product?.categories) && product.categories.length > 0
              ? product.categories.join(", ")
              : "N/A"}
          </p>
        </div>
      </div>
    </>
  );
}
