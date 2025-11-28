"use client";

import React, { useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/app/components/common-components/Breadcrumb";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="pt-28 px-3">
      <Breadcrumb />

      <div className="container mx-auto pt-10 md:pt-20">
        <div className="flex flex-col md:flex-row items-start justify-center gap-5 md:gap-10">
          <div className="w-full mx-auto px-6 md:px-8 py-5 sm:py-10 md:py-15 nav-custom-shadow">
            <h2 className="text-3xl md:text-4xl font-bebas text-dark text-shadow-light mb-6">
              Register
            </h2>

            <form className="flex font-poppins flex-col gap-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 md:py-3 border rounded focus:shadow-xl focus:border-transparent focus:ring-2 focus:ring-brand focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 md:py-3 border rounded focus:shadow-xl focus:border-transparent focus:ring-2 focus:ring-brand focus:outline-none"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-2 md:py-3 border rounded focus:shadow-xl focus:border-transparent focus:ring-2 focus:ring-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:shadow-xl focus:border-transparent text-gray-500 hover:text-dark text-sm"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 md:py-3 border rounded focus:shadow-xl focus:border-transparent focus:ring-2 focus:ring-brand focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-dark text-sm"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" className="w-4 h-4" />
                <span>I agree to the Terms & Conditions</span>
              </label>

              <button
                type="submit"
                className="bg-brand text-text text-3xl font-bebas py-2 px-6 border-2 border-brand cardButtonHover text-glow font-medium hover:text-dark/90 cursor-pointer transition"
              >
                Register
              </button>
            </form>
          </div>

          <div className="hidden md:block w-px bg-gray-300"></div>

          <div className="w-full mx-auto nav-custom-shadow rounded text-center md:text-left px-6 md:px-8 py-5 sm:py-10 md:py-15">
            <h2 className="text-3xl md:text-4xl font-bebas text-dark text-shadow-lighter mb-4">
              Already have an account?
            </h2>
            <p className="font-poppins text-gray-600 mb-6">
              If you already have an account, please login to access your
              personalized dashboard, orders, and exclusive offers.
            </p>
            <Link
              href="/login"
              className="block text-center bg-dark text-text text-3xl font-bebas py-2 w-full px-6 border-2 border-dark cardButtonHover text-glow font-medium hover:text-dark/90 cursor-pointer transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
