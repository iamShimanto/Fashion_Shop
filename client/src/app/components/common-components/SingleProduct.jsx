import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LuHeart } from "react-icons/lu";
import { BsCartCheck } from "react-icons/bs";

const SingleProduct = ({ image, title, price, slug, href }) => {
  const finalHref =
    href || (slug ? `/productDetails/${slug}` : "/productDetails");

  return (
    <div className="rounded-2xl overflow-hidden group w-full">
      <Link href={finalHref} className="">
        <div
          className="
            relative 
             mx-auto 
            w-full 
            [@media(min-width:320px)]:h-[calc(30vh+5vw)] 
            [@media(min-width:500px)]:h-[calc(40vh+5vw)] 
            [@media(min-width:600px)]:h-[calc(40vh+5vw)] 
            [@media(min-width:700px)]:h-[45dvh] 
            [@media(min-width:1000px)]:h-[50dvh] 
            
             
            shadow-lg 
            lg:border-2 lg:border-transparent 
            rounded-2xl 
            
            duration-150 
            lg:group-hover:border-brand 

            overflow-hidden
          "
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-103 duration-300"
            priority
          />

          <div className="absolute top-1.5 lg:top-3 left-1.5  lg:left-3 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
            <button className="scale-100 p-1.5 sm:p-2 md:p-2.5 bg-lightBrand text-white rounded-full shadow-2xl hover:bg-brand cursor-pointer transition">
              <LuHeart className=" w-5 h-5 md:w-6 md:h-6 text-glow" />
            </button>
            <button className="scale-100 p-1.5 sm:p-2 md:p-2.5 bg-lightBrand text-white rounded-full shadow-2xl hover:bg-brand cursor-pointer transition">
              <BsCartCheck className="w-5 h-5 md:w-6 md:h-6 text-glow" />
            </button>
          </div>
        </div>
      </Link>

      <div className="p-3 text-center">
        <Link href={finalHref}>
          <h3 className="font-normal font-jakarta     mb-2 text-[15px]  text-brand text-shadow-2xs">
            {title}
          </h3>
        </Link>
        <p className="text-dark/90   text-xl lg:text-2xl mt-1 pb-1.5 font-bebas border-b-2 border-brand lg:border-b-transparent lg:group-hover:border-b-brand">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default SingleProduct;
