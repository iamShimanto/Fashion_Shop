import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Orders FAQs | Shimanto",
};

export default function Page() {
  return (
    <StaticPage title="Orders FAQs" subtitle="Common questions." backHref="/">
      <h2>How can I track my order?</h2>
      <p>
        After your order ships, you’ll see tracking details in your email and
        (if you have an account) in your order details.
      </p>

      <h2>Can I cancel my order?</h2>
      <p>
        If your order hasn’t shipped yet, contact support as soon as possible to
        request cancellation.
      </p>

      <h2>What if I receive a damaged item?</h2>
      <p>
        Contact support with photos of the product and packaging. We’ll help
        with a replacement or refund.
      </p>

      <h2>How long do refunds take?</h2>
      <p>
        After inspection, refunds are processed quickly, but banks/providers may
        take a few business days to reflect the amount.
      </p>
    </StaticPage>
  );
}
