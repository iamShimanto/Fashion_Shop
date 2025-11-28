"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AosWrapper = ({ children }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return <>{children}</>;
};

export default AosWrapper;
