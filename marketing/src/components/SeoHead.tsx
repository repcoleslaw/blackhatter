import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyHead } from "../lib/seo";

export function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyHead(pathname);
  }, [pathname]);

  return null;
}
