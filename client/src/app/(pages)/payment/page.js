"use client";

import { orderApi } from "@/app/lib/orderApi";
import { useCart } from "@/app/providers/CartProvider";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const shipping = useMemo(() => {
    if (typeof window === "undefined") return "free";
    const shippingRaw = (
      new URLSearchParams(window.location.search).get("shipping") || "free"
    ).toLowerCase();

    return ["free", "local", "flat"].includes(shippingRaw)
      ? shippingRaw
      : "free";
  }, []);

  const { items, subtotal, discount, clear } = useCart();
  const [busy, setBusy] = useState(false);

  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    street: "",
    state: "",
    postalCode: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const shippingCost = shipping === "local" || shipping === "flat" ? 35 : 0;
  const total = useMemo(
    () => Number(subtotal || 0) + shippingCost - Number(discount || 0),
    [subtotal, discount, shippingCost],
  );

  const orderItems = useMemo(
    () =>
      items.map((x) => ({
        productId: x.productId,
        quantity: x.quantity,
        size: x.size,
        color: x.color,
      })),
    [items],
  );

  const onPay = async () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!info.firstName.trim()) return toast.error("First name is required");
    if (!info.lastName.trim()) return toast.error("Last name is required");

    const email = info.email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return toast.error("Valid email is required");

    if (!info.phone.trim()) return toast.error("Phone is required");
    if (!info.city.trim()) return toast.error("City is required");
    if (!info.street.trim()) return toast.error("Street is required");
    if (!info.postalCode.trim()) return toast.error("Postal code is required");

    if (!paymentMethod) {
      toast.error("Please choose a payment method");
      return;
    }

    setBusy(true);
    try {
      const res = await orderApi.create({
        items: orderItems,
        shippingAddress: {
          firstName: info.firstName,
          lastName: info.lastName,
          email,
          phone: info.phone,
          country: info.country,
          city: info.city,
          street: info.street,
          state: info.state,
          postalCode: info.postalCode,
        },
        shippingMethod: shipping,
        note: info.note,
        paymentMethod,
      });

      clear();
      toast.success(`Order placed: ${res?.data?.orderNumber || ""}`);
      router.push("/account");
    } catch (e) {
      if (
        String(e?.message || "")
          .toLowerCase()
          .includes("unauthorized")
      ) {
        toast.error("Please login to place an order");
        router.push("/login");
        return;
      }
      toast.error(e.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="pt-28 pb-5">
      <div className="px-3 flex flex-col lg:flex-row gap-8 p-6 lg:p-12 font-poppins">
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-6">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">
              Already have an account?{" "}
              <a href="#" className="text-black font-medium underline">
                Login here
              </a>
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <button className="w-full bg-brand border-3 border-brand tracking-wide cursor-pointer text-2xl lg:text-4xl text-text text-glow font-bebas text-center py-1 rounded mt-4  hover:text-dark/90 cardButtonHover transition">
                Login
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="First Name*"
                value={info.firstName}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, firstName: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Last Name*"
                value={info.lastName}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, lastName: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Email Address*"
                value={info.email}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, email: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Phone Number*"
                value={info.phone}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, phone: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Country/Region"
                value={info.country}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, country: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none col-span-1 md:col-span-2"
              />
              <input
                placeholder="Town/City*"
                value={info.city}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, city: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Street..."
                value={info.street}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, street: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="State"
                value={info.state}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, state: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Postal Code*"
                value={info.postalCode}
                onChange={(e) =>
                  setInfo((p) => ({ ...p, postalCode: e.target.value }))
                }
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
            </div>
            <textarea
              placeholder="Write note..."
              value={info.note}
              onChange={(e) => setInfo((p) => ({ ...p, note: e.target.value }))}
              className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 w-full focus:outline-none"
            ></textarea>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold">Choose payment Option:</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit Card
            </label>
            <input
              placeholder="Name On Card"
              className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 w-full focus:outline-none"
            />
            <input
              placeholder="Card Numbers"
              className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 w-full focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="mm / dd / yyyy"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="CVV"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Save Card Details
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "applepay"}
                onChange={() => setPaymentMethod("applepay")}
              />
              Apple Pay
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
              />
              PayPal
            </label>
          </div>

          <div className="border-t border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-2xl font-bebas tracking-wide">
                ${shippingCost.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Discounts</span>
              <span className="text-red-500 text-2xl font-bebas tracking-wide">
                - ${Number(discount || 0).toFixed(2)}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className=" text-2xl text-dark/90 font-bebas tracking-wide">
                ${Number(total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            disabled={busy}
            onClick={onPay}
            className="w-full bg-dark border-3 border-dark cursor-pointer tracking-wide text-2xl lg:text-4xl text-text text-glow font-bebas text-center py-1 rounded mt-4  hover:text-dark/90 cardButtonHover transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? "Processing..." : "Payment"}
          </button>
        </div>
      </div>
    </section>
  );
}
