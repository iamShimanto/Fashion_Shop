import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Return & Refund | Shimanto",
};

export default function Page() {
  return (
    <StaticPage title="Return & Refund" subtitle="Easy returns." backHref="/">
      <h2>Return window</h2>
      <p>
        You can request a return within 7 days of delivery (items must be unused
        and in original condition).
      </p>

      <h2>Refunds</h2>
      <p>
        After inspection, refunds are issued to the original payment method
        (processing time depends on your bank/provider).
      </p>

      <h2>How to request</h2>
      <p>
        Contact support with your order number and reason for return:{" "}
        <a href="mailto:shimanto.dev.bd@gmail.com">shimanto.dev.bd@gmail.com</a>
        .
      </p>
    </StaticPage>
  );
}
