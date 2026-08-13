import { Link } from "react-router-dom";
import { cx } from "../lib/cx";

export function Wordmark({
  to = "/",
  inverted = false,
}: {
  to?: string;
  inverted?: boolean;
}) {
  return (
    <Link to={to} className="flex items-center gap-2.5">
      <span
        className={cx(
          "inline-flex h-8 w-8 items-end justify-center rounded-md pb-1.5",
          inverted ? "bg-ember/20" : "bg-ink",
        )}
      >
        <span
          className={cx(
            "mb-0.5 h-2.5 w-4 rounded-t-full border-2",
            inverted ? "border-ember" : "border-paper",
          )}
        />
      </span>
      <span
        className={cx(
          "font-serif text-lg tracking-tight",
          inverted ? "text-paper" : "text-ink",
        )}
      >
        Blackhatter
      </span>
    </Link>
  );
}
