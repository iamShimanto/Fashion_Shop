import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Our Stories | Shimanto",
};

export default function Page() {
  return (
    <StaticPage title="Our Stories" subtitle="Behind the brand." backHref="/">
      <p>
        Every collection has a story — inspiration, fabric choices, color
        direction, and the little design details that make it feel special.
      </p>

      <h2>What you’ll find here</h2>
      <ul>
        <li>New drops and seasonal highlights</li>
        <li>Care tips to keep your pieces looking great</li>
        <li>Behind-the-scenes notes from our team</li>
      </ul>

      <p>
        We’ll keep expanding this page with updates as we launch new
        collections.
      </p>
    </StaticPage>
  );
}
