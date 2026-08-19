import { Link } from "react-router-dom";
import { PageIntro, PageWidth } from "../components/Page";

export function NotFoundPage() {
  return (
    <PageWidth>
      <PageIntro kicker="404" title="That page is not here.">
        <p>The meeting might still be worth designing. Try one of these instead.</p>
      </PageIntro>
      <ul className="mt-10 max-w-md space-y-3 text-sm">
        <li>
          <Link to="/" className="font-medium text-ink underline-offset-2 hover:underline">
            Product
          </Link>
        </li>
        <li>
          <Link
            to="/guides"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            Guides
          </Link>
        </li>
        <li>
          <Link
            to="/faq"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            FAQ
          </Link>
        </li>
      </ul>
    </PageWidth>
  );
}
