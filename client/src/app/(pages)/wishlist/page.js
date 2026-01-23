
import SingleProduct from "@/app/components/common-components/SingleProduct";
import React from "react";

const Page = () => {
  return (
    <section className="pt-25 pb-20 px-3">
      <p className="container pt-15 text-dark text-2xl font-poppins text-shadow-lighter">
        You have total <span className="text-3xl font-bebas">12</span> products
        in your wishlist
      </p>
      <div className="container [@media(min-width:320px)]:px-0 [@media(min-width:450px)]:px-[calc(3px+2vw)] [@media(min-width:550px)]:px-[calc(6px+5vw)] [@media(min-width:640px)]:px-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-7 md:gap-5 lg:gap-10 pt-15">
        <SingleProduct
          image="/product-2.jpeg"
          title="lorem ipsum torresProduct 1"
          price={49.99}
        />
        <SingleProduct
          image="/product-2.jpeg"
          title="lorem ipsum torresProduct 2"
          price={59.99}
        />
        <SingleProduct
          image="/product-2.jpeg"
          title="lorem ipsum torresProduct 3"
          price={69.99}
        />
        <SingleProduct
          image="/product-2.jpeg"
          title="lorem ipsum torresProduct 4"
          price={79.99}
        />
        <SingleProduct
          image="/product-2.jpeg"
          title="lorem ipsum torresProduct 5"
          price={89.99}
        />
        <SingleProduct
          image="/product-2.jpeg"
          title="lorem ipsum torresProduct 6"
          price={99.99}
        />
        <SingleProduct
          image="/product-2.jpeg"
          title="lorem ipsum torresProduct 7"
          price={109.99}
        />
      </div>
    </section>
  );
};

export default Page;
