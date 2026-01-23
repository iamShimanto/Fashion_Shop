import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "About Us | Shimanto",
};

export default function Page() {
  return (
    <StaticPage
      title="About Us"
      subtitle="Who we are and what we stand for."
      backHref="/"
    >
      <p>
        Shimanto is a fashion shop focused on clean design, quality materials,
        and a smooth shopping experience.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>Curate modern collections for everyday wear</li>
        <li>Keep product details clear: sizing, fabric, and care</li>
        <li>Ship fast and support customers end-to-end</li>
      </ul>

      <h2>Our promise</h2>
      <p>
        We aim to deliver great value with honest pricing, reliable delivery,
        and responsive support.
      </p>
    </StaticPage>
  );
}
