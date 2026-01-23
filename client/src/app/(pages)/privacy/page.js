import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Privacy Policy | Shimanto",
};

export default function Page() {
  return (
    <StaticPage
      title="Privacy Policy"
      subtitle="How we handle your data."
      backHref="/"
    >
      <p>
        We only collect data needed to process orders and improve your shopping
        experience.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Account info (name, email)</li>
        <li>Shipping details for delivery</li>
        <li>Order history and customer support messages</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To fulfill orders and provide tracking</li>
        <li>To provide customer support</li>
        <li>To improve site performance and usability</li>
      </ul>

      <p>
        If you have questions, contact us at{" "}
        <a href="mailto:shimanto.dev.bd@gmail.com">shimanto.dev.bd@gmail.com</a>
        .
      </p>
    </StaticPage>
  );
}
