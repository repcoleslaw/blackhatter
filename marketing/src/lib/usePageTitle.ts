import { useEffect } from "react";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Blackhatter` : "Blackhatter";
    return () => {
      document.title = "Blackhatter";
    };
  }, [title]);
}
