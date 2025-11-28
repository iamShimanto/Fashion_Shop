import Breadcrumb from "@/app/components/common-components/Breadcrumb";
import ProductDetails from "@/app/components/productDetails-components/ProductDetails";
import RelatedProductsSlider from "@/app/components/sliders/RelatedProductsSlider";

const product = {
  title: "Stretch Strap Top",
  price: 79.99,
  oldPrice: 98.99,
  colors: [
    { name: "Beige", code: "#e8d7c1" },
    { name: "Gray", code: "#7a7a7a" },
    { name: "Black", code: "#000000" },
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  images: ["/men.jpeg", "/women.jpeg", "/elivate2.jpeg"],
};

export default function Page() {
  return (
    <section className="pt-[120px] px-3">
      <Breadcrumb />
      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 md:pt-20  md:pb-20">
        <ProductDetails product={product} />
      </div>
      <div>
        <RelatedProductsSlider />
      </div>
    </section>
  );
}
