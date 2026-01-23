"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/providers/CartProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { items, setItemQuantity, removeItem, subtotal, discount } = useCart();

  const [shipping, setShipping] = useState("free");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const discounts = discount;

  const shippingCost = shipping === "local" || shipping === "flat" ? 35 : 0;

  const total = subtotal + shippingCost - discounts;

  const hasItems = items.length > 0;

  const onProceed = () => {
    if (!hasItems) {
      toast.error("Cart is empty");
      return;
    }
    if (!termsAccepted) {
      toast.error("Please accept Terms and Conditions");
      return;
    }

    router.push(`/payment?shipping=${encodeURIComponent(shipping)}`);
  };

  return (
    <section className="pt-28 px-4 pb-20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 font-poppins  font-dark-90">
        {/* Left: Products */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex flex-col lg:flex-row lg:items-center justify-between py-5 gap-6"
              >
                {/* Image + Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/men.jpeg"}
                      alt={item.title}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-base sm:text-lg">
                      {item.title}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <select
                        value={item.color?.name || ""}
                        className="border rounded px-2 py-1 text-sm"
                        readOnly
                      >
                        <option>{item.color?.name || "—"}</option>
                      </select>
                      <select
                        value={item.size}
                        className="border rounded px-2 py-1 text-sm"
                        readOnly
                      >
                        <option>{item.size}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Price / Qty / Total / Remove */}
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-8 w-full lg:w-auto justify-between">
                  {/* Price */}
                  <div className="text-sm sm:text-base font-medium min-w-[80px]">
                    <span className="text-xl tracking-wide font-bebas text-dark/90">
                      ${Number(item.unitPrice || 0).toFixed(2)}
                    </span>
                  </div>

                  {/* Qty */}
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() =>
                        setItemQuantity(
                          item.key,
                          Math.max(1, item.quantity - 1),
                        )
                      }
                      className="px-3 py-1 text-xl tracking-wide font-bebas text-dark/90"
                    >
                      −
                    </button>
                    <span className="px-3 text-xl tracking-wide font-bebas text-dark/90">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        setItemQuantity(item.key, item.quantity + 1)
                      }
                      className="px-3 py-1 text-xl tracking-wide font-bebas text-dark/90"
                    >
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div className="  min-w-[80px] text-xl tracking-wide font-bebas text-dark">
                    $
                    {(
                      Number(item.unitPrice || 0) * Number(item.quantity || 0)
                    ).toFixed(2)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-red-400 text-lg cursor-pointer duration-200 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white border-2 border-brand p-6 rounded nav-custom-shadow lg:sticky lg:top-28 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between ">
              <span>Subtotal</span>
              <span className="text-xl tracking-wide font-bebas text-dark/90">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discounts</span>
              <span className="text-xl tracking-wide font-bebas text-dark/90">
                -${discounts.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="block mb-1">Shipping</span>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={shipping === "free"}
                    onChange={() => setShipping("free")}
                  />
                  Free Shipping{" "}
                  <span className="ml-auto text-xl tracking-wide font-bebas font-dark/90">
                    $0.00
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={shipping === "local"}
                    onChange={() => setShipping("local")}
                  />
                  Local{" "}
                  <span className="ml-auto text-xl tracking-wide font-bebas text-dark/90">
                    $35.00
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={shipping === "flat"}
                    onChange={() => setShipping("flat")}
                  />
                  Flat Rate{" "}
                  <span className="ml-auto text-xl tracking-wide font-bebas text-dark/90">
                    $35.00
                  </span>
                </label>
              </div>
            </div>
            <div className="border-t border-dark/40 pt-3 flex justify-between font-poppins font-semibold font-dark text-lg">
              <span>Total</span>
              <span className="font-normal text-2xl tracking-wide font-bebas text-dark">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-4 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span>
              I agree with the{" "}
              <a href="#" className="underline font-medium">
                Terms And Conditions
              </a>
            </span>
          </div>

          {/* Buttons */}
          <button
            type="button"
            onClick={onProceed}
            disabled={!hasItems}
            className="inline-block  w-full bg-brand border-3 border-brand  text-2xl lg:text-3xl text-text text-glow font-bebas text-center  py-2 rounded mt-4 font-semibold hover:text-brand cardButtonHover transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Process To Checkout
          </button>
          <Link
            href={"/shop"}
            className="w-full text-md text-center mt-3 text-gray-600 duration-150 hover:text-brand"
          >
            Or continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
