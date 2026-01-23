import { getSiteUrl } from "./lib/seo";

export default function robots() {
  const site = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/account/",
          "/account/orders",
          "/account/orders/",
          "/payment",
          "/confirmOrder",
          "/login",
          "/registration",
          "/verify-email",
          "/forgot-password",
        ],
      },
    ],
    sitemap: new URL("/sitemap.xml", site).toString(),
  };
}
