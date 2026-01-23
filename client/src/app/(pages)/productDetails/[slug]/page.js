import Breadcrumb from "@/app/components/common-components/Breadcrumb";
import ProductDetails from "@/app/components/productDetails-components/ProductDetails";
import RelatedProductsSlider from "@/app/components/sliders/RelatedProductsSlider";
import { notFound } from "next/navigation";

async function fetchProduct(slug) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(`${base}/products/slug/${slug}`, {
    cache: "no-store",
  });

  const payload = await res.json().catch(() => null);
  if (res.status === 404) return { notFound: true };

  if (!res.ok || payload?.success === false) {
    const message = payload?.message || `Failed to load product (${res.status})`;
    throw new Error(message);
  }

  return { data: payload.data };
}

export default async function Page({ params }) {
  const result = await fetchProduct(params.slug);
  if (result.notFound) notFound();

  return (
    <section className="pt-[120px] px-3">
      <Breadcrumb />
      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 md:pt-20 md:pb-20">
        <ProductDetails product={result.data} />
      </div>
      <div>
        <RelatedProductsSlider />
      </div>
    </section>
  );
}
