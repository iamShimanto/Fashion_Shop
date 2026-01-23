import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop",
  description:
    "Browse new arrivals, best sellers, and on-sale fashion. Filter by men, women, and more.",
  alternates: {
    canonical: "/shop",
  },
};

export default function Page() {
  return <ShopClient />;
}
