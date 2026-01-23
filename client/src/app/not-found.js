"use client";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-gray-50 to-gray-200">
      <h1 className="text-8xl sm:text-9xl font-extrabold text-brand drop-shadow-lg">
        404
      </h1>
      <h2 className="text-2xl sm:text-4xl font-jakarta text-dark/80 mt-4">
        Oops! Page not found
      </h2>
      <p className="text-dark/60 font-jakarta mt-3 max-w-md">
        The page you are looking for doesn’t exist, has been moved, or is
        temporarily unavailable.
      </p>

      <Link
        href="/"
        className="mt-8 flex items-center gap-2 bg-brand text-white font-bebas text-2xl px-6 py-2 rounded-2xl shadow-lg hover:bg-brand/80 duration-200"
      >
        <FaHome className="text-xl" />
        Go Back Home
      </Link>

      <div className="mt-12 opacity-60">
        <p className="text-sm font-jakarta text-dark/50">
          © {new Date().getFullYear()} web... All rights reserved.
        </p>
      </div>
    </section>
  );
}
