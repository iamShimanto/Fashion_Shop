import Breadcrumb from "@/app/components/common-components/Breadcrumb";
import ProductDetails from "@/app/components/productDetails-components/ProductDetails";
import RelatedProductsSlider from "@/app/components/sliders/RelatedProductsSlider";
import { notFound } from "next/navigation";

async function fetchProduct(slug) {
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
  )
    .toString()
    .replace(/^['"]|['"]$/g, "")
    .trim();

  const res = await fetch(`${base}/products/slug/${slug}`, {
    cache: "no-store",
  });

  const payload = await res.json().catch(() => null);
  if (res.status === 404) return { notFound: true };

  if (!res.ok || payload?.success === false) {
    const message =
      payload?.message || `Failed to load product (${res.status})`;
    throw new Error(message);
  }

  return { data: payload.data };
}

async function fetchRelatedProducts(product) {
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
  )
    .toString()
    .replace(/^['"]|['"]$/g, "")
    .trim();

  const category =
    Array.isArray(product?.categories) && product.categories.length > 0
      ? product.categories[0]
      : "";

  const q = (product?.vendor || "").toString().trim();

  const search = new URLSearchParams();
  search.set("limit", "12");
  search.set("sort", "newest");
  if (category) search.set("category", category);
  else if (q) search.set("q", q);

  const res = await fetch(`${base}/products?${search.toString()}`, {
    cache: "no-store",
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok || payload?.success === false) return [];

  const items = payload?.data?.items;
  if (!Array.isArray(items)) return [];

  return items
    .filter((p) => p && p.slug && p.slug !== product?.slug)
    .slice(0, 10);
}

export default async function Page({ params }) {
  const result = await fetchProduct(params.slug);
  if (result.notFound) notFound();

  const related = await fetchRelatedProducts(result.data);

  return (
    <section className="pt-[120px] px-3">
      <Breadcrumb />
      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 md:pt-20 md:pb-20">
        <ProductDetails product={result.data} />
      </div>
      <div>
        <RelatedProductsSlider products={related} />
      </div>
    </section>
  );
}
