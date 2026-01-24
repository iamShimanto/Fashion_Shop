import { Bebas_Neue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "./components/common-components/Nav";
import Footer from "./components/common-components/Footer";
import AosWrapper from "./components/common-components/AosWrapper";
import BackToTop from "./components/common-components/BackToTop";
import CustomCursor from "./components/common-components/CustomCursor";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./providers/AuthProvider";
import { CartProvider } from "./providers/CartProvider";
import { absoluteUrl, getSiteUrl } from "./lib/seo";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Shimanto — Fashion Shop",
    template: "%s | Shimanto",
  },
  description:
    "Shop the latest fashion for men and women. Discover new arrivals, best sellers, and on-sale items.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "Shimanto — Fashion Shop",
    description:
      "Shop the latest fashion for men and women. Discover new arrivals, best sellers, and on-sale items.",
    images: [
      {
        url: absoluteUrl("/banner1.jpg"),
        width: 1200,
        height: 630,
        alt: "Shimanto Fashion Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shimanto — Fashion Shop",
    description:
      "Shop the latest fashion for men and women. Discover new arrivals, best sellers, and on-sale items.",
    images: [absoluteUrl("/banner1.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Shimanto",
    url: absoluteUrl("/"),
    email: "shimanto.dev.bd@gmail.com",
    telephone: "+8801750658101",
    address: {
      "@type": "PostalAddress",
      streetAddress: "549 Oak St.",
      addressLocality: "Crystal Lake",
      addressRegion: "IL",
      postalCode: "60014",
      addressCountry: "US",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${jakarta.variable} antialiased font-jakarta`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Toaster position="top-center" reverseOrder={false} />
        <AuthProvider>
          <CartProvider>
            <CustomCursor />
            <BackToTop />
            <Nav />
            <AosWrapper>{children}</AosWrapper>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
