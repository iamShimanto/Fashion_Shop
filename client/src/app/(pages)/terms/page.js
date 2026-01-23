import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Terms & Conditions | Shimanto",
};

export default function Page() {
  return (
    <StaticPage
      title="Terms & Conditions"
      subtitle="Using our website."
      backHref="/"
    >
      <p>
        By using this website, you agree to follow these terms. Please read them
        carefully.
      </p>

      <h2>Orders</h2>
      <ul>
        <li>
          Orders are confirmed after successful payment (or confirmation step).
        </li>
        <li>
          We may cancel orders in case of stock issues or suspected fraud.
        </li>
      </ul>

      <h2>Pricing</h2>
      <p>
        Prices may change without notice. We always display the price at
        checkout.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions about these terms, email{" "}
        <a href="mailto:shimanto.dev.bd@gmail.com">shimanto.dev.bd@gmail.com</a>
        .
      </p>
    </StaticPage>
  );
}
