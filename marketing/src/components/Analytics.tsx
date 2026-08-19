import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { appOrigin } from "../lib/appUrl";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

function ensureGtag(id: string) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

export function Analytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!measurementId) return;
    ensureGtag(measurementId);
  }, []);

  useEffect(() => {
    if (!measurementId || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  useEffect(() => {
    if (!measurementId) return;
    const origin = appOrigin();
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a");
      if (!target?.href?.startsWith(origin) || !window.gtag) return;
      window.gtag("event", "click", {
        event_category: "outbound",
        event_label: target.href,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
