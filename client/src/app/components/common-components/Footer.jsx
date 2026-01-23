"use client";

import Link from "next/link";
import { CiMail, CiPhone } from "react-icons/ci";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaPinterestP,
} from "react-icons/fa6";
import { useState } from "react";

export default function Footer() {
  const [language, setLanguage] = useState("en");
  return (
    <footer
      data-aos="fade-in"
      data-aos-duration="1000"
      className="sm:pb-5 pt-10 md:pt-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:pt-10 pb-6  overflow-hidden">
        <div className="flex font-jakarta justify-end mb-5">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 flex-wrap">
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            className="flex-1 min-w-[250px]"
          >
            <h2 className=" mb-4 text-3xl md:text-4xl text-shadow-2xl text-brand font-bebas ">
              Shimanto
            </h2>
            <p className="font-jakarta text-gray-600 mb-1">
              549 Oak St. Crystal Lake, IL 60014
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-jakarta font-medium text-black hover:underline flex items-center gap-1"
            >
              Get Direction →
            </a>

            <div className="mt-4 space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <CiMail className="w-4 h-4" /> shimanto.dev.bd@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <CiPhone className="w-4 h-4" /> 01750658101
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition hover:bg-[#1877F2] hover:text-white"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition hover:bg-black hover:text-white"
              >
                <FaXTwitter size={14} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition hover:bg-black hover:text-[#69C9D0]"
              >
                <FaTiktok size={14} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center transition hover:bg-[#E60023] hover:text-white"
              >
                <FaPinterestP size={14} />
              </a>
            </div>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1200"
            className="flex-1 min-w-[180px]"
          >
            <h3 className=" mb-4 text-3xl md:text-4xl text-dark/90 font-bebas ">
              Information
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/about"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Our Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Career
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1400"
            className="flex-1 min-w-[180px]"
          >
            <h3 className=" mb-4 text-3xl md:text-4xl text-dark/90 font-bebas ">
              Services
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/shipping"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-md text-dark/70 font-jakarta hover:text-brand duration-150 lg:hover:ml-2"
                >
                  Orders FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="1800"
            className="flex-1 min-w-[250px] text-dark/90 gap-5 font-jakarta"
          >
            <h3 className="text-2xl mb-4">Newsletter</h3>
            <p className="font-jakarta text-gray-600 text-sm mb-3">
              Sign up for our newsletter and get 10% off your first purchase
            </p>
            <form className="flex items-center pb-3 my-5">
              <input
                type="email"
                placeholder="Enter your e-mail..."
                className="w-full px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="text-xl w-10 h-10 rounded-full text-black flex items-center justify-center hover:text-brand cursor-pointer transition"
              >
                →
              </button>
            </form>
            <label className="flex items-start gap-2 text-xs text-gray-500">
              <input type="checkbox" className="mt-1" />
              <div>
                By clicking subscribe, you agree to the{" "}
                <Link href="/terms" className="underline text-black">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline text-black">
                  Privacy Policy
                </Link>
                .
              </div>
            </label>
          </div>
        </div>

        <div className="border-t mt-10 border-dark/20 pt-5">
          <a
            href="https://weblaa.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-dark/80 font-jakarta"
          >
            ©2025 weblaa. All Rights Reserved.
          </a>
        </div>
      </div>
    </footer>
  );
}
