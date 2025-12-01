"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetails({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [fadeKey, setFadeKey] = useState(0); // helps trigger animation
  const [selectedSize, setSelectedSize] = useState("L");
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
              {product.images.map((img, i) => (
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
              <div
                key={fadeKey}
                className="w-full sm:h-[50vh] h-[25vh]"
              >
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
              {product.images.map((img, i) => (
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
            ${product.price.toFixed(2)}
          </span>
          <span className="line-through text-gray-500 font-jakarta">
            ${product.oldPrice.toFixed(2)}
          </span>
          <span className="bg-red-500 text-white font-jakarta px-2 py-0.5 text-sm rounded">
            -25%
          </span>
        </div>

        <div>
          <p className="text-md sm:text-lg text-dark/50 font-jakarta pr-3">
            The garments labelled as Committed are products that have been
            produced using sustainable fibres or processes, reducing their
            environmental impact.
          </p>
        </div>

        <div>
          <p className="font-medium mb-2">Colors:</p>
          <div className="flex gap-2">
            {product.colors.map((c, i) => (
              <span
                key={i}
                style={{ backgroundColor: c.code }}
                className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-dark/80 cursor-pointer shadow-md hover:scale-85 duration-150"
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium mb-2">Size:</p>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-10 h-10 rounded-full border-2 text-sm cursor-pointer duration-250 hover:shadow-2xl hover:border-dark ${
                  selectedSize === s ? "bg-black text-white" : "border-gray-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

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
          <button className="flex-1 py-1.5 bg-dark text-2xl lg:text-4xl font-bebas cardButtonHover border-3 border-dark text-white rounded shadow hover:text-dark/90 cursor-pointer">
            Add to Cart – ${product.price.toFixed(2)}
          </button>
          <Link
            href={"/payment"}
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
            SKU: 53453412
          </p>
          <p className="text-sm md:text-md text-dark/70 font-jakarta pt-1">
            Vendor: Modave
          </p>
          <p className="text-sm md:text-md text-dark/70 font-jakarta pt-1">
            Available: Instock
          </p>
          <p className="text-sm md:text-md text-dark/70 font-jakarta pt-1">
            Categories: Clothes, women, T-shirt
          </p>
        </div>
      </div>
    </>
  );
}
