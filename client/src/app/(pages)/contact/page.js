import StaticPage from "@/app/components/common-components/StaticPage";

export const metadata = {
  title: "Contact Us | Shimanto",
};

export default function Page() {
  return (
    <StaticPage title="Contact Us" subtitle="We’re here to help." backHref="/">
      <p>
        For order support, shipping questions, or product info, reach out
        anytime.
      </p>

      <h2>Support</h2>
      <ul>
        <li>
          Email:{" "}
          <a href="mailto:shimanto.dev.bd@gmail.com">
            shimanto.dev.bd@gmail.com
          </a>
        </li>
        <li>
          Phone: <a href="tel:+8801750658101">+880 1750-658101</a>
        </li>
      </ul>

      <h2>Address</h2>
      <p>549 Oak St. Crystal Lake, IL 60014</p>
    </StaticPage>
  );
}
