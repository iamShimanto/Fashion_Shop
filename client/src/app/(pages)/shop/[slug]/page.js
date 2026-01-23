import ProductDetails from "@/app/components/productDetails-components/ProductDetails";
import RelatedProductsSlider from "@/app/components/sliders/RelatedProductsSlider";
import { notFound } from "next/navigation";
import { getApiBaseUrl } from "@/app/lib/seo";
import { absoluteUrl, getSiteUrl } from "@/app/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchProduct(slug) {
  const base = getApiBaseUrl() || "https://fashion-server.shimanto.dev/api";

  const res = await fetch(`${base}/products/slug/${slug}`, {
    cache: "no-store",
  });

  const payload = await res.json().catch(() => null);

  // Only treat as a real "not found" when the API returns a JSON payload.
  // Misconfigured API base can return an HTML 404 which would otherwise mask issues.
  if (res.status === 404) {
    const apiSaysNotFound =
      payload &&
      (payload?.success === false ||
        /not found/i.test(String(payload?.message || "")));

    if (apiSaysNotFound) return { notFound: true };

    throw new Error(
      `Product fetch returned 404 from ${base}. Check NEXT_PUBLIC_API_BASE_URL and production deploy env.`,
    );
  }

  if (!res.ok || payload?.success === false) {
    const message =
      payload?.message || `Failed to load product (${res.status})`;
    throw new Error(message);
  }

  return { data: payload.data };
}

function pickImageUrl(product) {
  const img = product?.images?.[0];
  if (!img) return absoluteUrl("/product-2.jpeg");
  if (typeof img === "string")
    return img.startsWith("http") ? img : absoluteUrl(img);
  const url = img?.url || img?.secure_url;
  if (!url) return absoluteUrl("/product-2.jpeg");
  return url.startsWith("http") ? url : absoluteUrl(url);
}

function buildDescription(product) {
  const desc =
    product?.shortDescription ||
    product?.description ||
    product?.details ||
    "Shop this product on Shimanto.";
  return String(desc).replace(/\s+/g, " ").trim().slice(0, 160);
}

export async function generateMetadata({ params }) {
  try {
    const result = await fetchProduct(params.slug);
    if (result.notFound) {
      return {
        title: "Product not found",
        robots: { index: false, follow: false },
      };
    }

    const product = result.data;
    const title = product?.title ? String(product.title) : "Product";
    const description = buildDescription(product);
    const image = pickImageUrl(product);

    const site = getSiteUrl();
    const canonical = new URL(`/shop/${params.slug}`, site).toString();

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description,
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Product",
      description: "View product details on Shimanto.",
      alternates: {
        canonical: `/shop/${params.slug}`,
      },
    };
  }
}

async function fetchRelatedProducts(product) {
  const base = getApiBaseUrl() || "https://fashion-server.shimanto.dev/api";

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
  const product = result.data;
  const site = getSiteUrl();
  const productUrl = new URL(`/shop/${params.slug}`, site).toString();
  const imageUrl = pickImageUrl(product);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.title || "Product",
    description: buildDescription(product),
    image: [imageUrl],
    sku: product?._id,
    brand: { "@type": "Brand", name: product?.vendor || "Shimanto" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: Number(product?.price || 0),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <section className="pt-[120px] px-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10 md:pt-20 md:pb-20">
        <ProductDetails product={product} />
      </div>
      <div>
        <RelatedProductsSlider products={related} />
      </div>
    </section>
  );
}
