import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Shipping | Shimanto",
};

export default function Page() {
  return (
    <StaticPage
      title="Shipping"
      subtitle="Delivery timelines and tracking."
      backHref="/"
    >
      <h2>Processing time</h2>
      <p>Orders are typically processed within 1–2 business days.</p>

      <h2>Delivery time</h2>
      <ul>
        <li>Standard: 3–7 business days (depending on location)</li>
        <li>Express: 1–3 business days (if available)</li>
      </ul>

      <h2>Tracking</h2>
      <p>
        Once shipped, you’ll receive tracking details by email (or in your
        account order details).
      </p>
    </StaticPage>
  );
}
