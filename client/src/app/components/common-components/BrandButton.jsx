import Link from "next/link";
import React from "react";

const BrandButton = ({ href = "/", text = "", className = "" }) => {
  return (
    <Link
      href={href}
      className={`relative inline-block group text-3xl lg:text-4xl cardButtonHover border-3 hover:text-shadow-2xl lg:border-brand text-glow hover:text-dark/90 overflow-hidden font-bebas bg-brand py-1.5 px-6 rounded-xs ${className}`}
    >
      <span>{text}</span>
    </Link>
  );
};

export default BrandButton;
