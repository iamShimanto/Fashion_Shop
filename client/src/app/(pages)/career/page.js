import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Career | Shimanto",
};

export default function Page() {
  return (
    <StaticPage title="Career" subtitle="Join our team." backHref="/">
      <p>
        We’re always looking for people who care about product, design, and
        customer experience.
      </p>

      <h2>Open roles</h2>
      <ul>
        <li>Customer Support (Part-time / Full-time)</li>
        <li>Content & Social Media</li>
        <li>Warehouse & Fulfillment</li>
      </ul>

      <p>
        To apply, email your CV/portfolio to{" "}
        <a href="mailto:shimanto.dev.bd@gmail.com">shimanto.dev.bd@gmail.com</a>
        .
      </p>
    </StaticPage>
  );
}
