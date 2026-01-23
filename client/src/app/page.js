import React from "react";
import Banner from "./components/home/Banner";

import Collections from "./components/home/Collection";

import ElivateStyle from "./components/home/ElivateStyle";
import FeatureBar from "./components/home/FeatureBar";
import Testimonial from "./components/home/Testimonial";
import Marquee from "./components/common-components/Marquee";

import Parallax from "./components/home/parallax";
import CheckProducts from "./components/sliders/CheckProducts";

export const metadata = {
  title: "Home",
  alternates: {
    canonical: "/",
  },
};

const Page = () => {
  return (
    <>
      <Banner />
      <Collections />
      <Marquee />
      <CheckProducts />
      <ElivateStyle />
      <Marquee />

      <Testimonial />
      <FeatureBar />
      <Parallax />
    </>
  );
};

export default Page;
