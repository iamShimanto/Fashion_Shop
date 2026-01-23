"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import { useCart } from "@/app/providers/CartProvider";

export default function CartPopup({ isOpen, onClose }) {
  const { items, removeItem, subtotal } = useCart();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`w-full sm:w-[420px] h-full bg-white shadow-xl relative flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-2xl text-dark duration-200 hover:text-brand"
          onClick={onClose}
        >
          <HiOutlineX />
        </button>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          <h2 className="font-bebas text-dark/90 text-shadow-2xl text-2xl mb-4">
            Shopping Cart
          </h2>

          <div className="flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="py-10 text-center text-sm text-dark/60">
                Your cart is empty.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.key} className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={item.image || "/men.jpeg"}
                      alt={item.name || "image"}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {(item.size || "—") + " / " + (item.color?.name || "—")}
                    </p>
                    <p className="text-sm">
                      {item.quantity} x $
                      {Number(item.unitPrice || 0).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-red-400 text-lg cursor-pointer hover:text-red-600"
                  >
                    <HiOutlineX />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-5">
          <div className="flex justify-between font-semibold font-jakarta text-lg">
            <span>Subtotal</span>
            <span className="font-bebas text-2xl md:text-3xl text-dark/90">
              ${Number(subtotal || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <input type="checkbox" id="terms" className="cursor-pointer" />
            <label htmlFor="terms" className="text-sm">
              I agree with{" "}
              <a href="#" className="text-brand underline">
                Terms & Conditions
              </a>
            </label>
          </div>

          <div className="flex gap-3 mt-5">
            <Link
              href="/shop"
              onClick={onClose}
              className="w-1/2 py-1 text-center text-2xl text-text md:text-3xl bg-dark rounded border-2 border-dark duration-150 hover:text-dark text-glow font-bebas cardButtonHover cursor-pointer"
            >
              shop
            </Link>
            <Link
              href="/confirmOrder"
              onClick={onClose}
              aria-disabled={items.length === 0}
              className="w-1/2 py-1 text-center text-2xl md:text-3xl bg-brand text-white rounded border-2 border-brand duration-150 hover:text-dark text-glow font-bebas cardButtonHover cursor-pointer"
            >
              Check Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
