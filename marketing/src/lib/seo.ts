import { faqs } from "./faqs";

export const SITE_NAME = "Blackhatter";

export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_ORIGIN ?? "https://theblackhatter.com"
).replace(/\/$/, "");

export const DEFAULT_DESCRIPTION =
  "Blackhatter helps you pressure-test a meeting before anyone sits down. Build an agenda against real objectives, check coverage, then export a pre-read and a calendar hold.";

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  index?: boolean;
};

export const pages: Record<string, PageSeo> = {
  "/": {
    path: "/",
    title:
      "Meeting agenda builder that pressure-tests objectives · Blackhatter",
    description: DEFAULT_DESCRIPTION,
  },
  "/pricing": {
    path: "/pricing",
    title: "Free early access · Blackhatter meeting planner",
    description:
      "Blackhatter is free during early access. Design meeting agendas against objectives, check coverage, and export a PDF pre-read and calendar hold. No card required.",
  },
  "/about": {
    path: "/about",
    title: "Why meetings fail in the design · Blackhatter",
    description:
      "Blackhatter is a meeting-quality web app, not a security tool. Design the agenda against real objectives before anyone sits down.",
  },
  "/faq": {
    path: "/faq",
    title: "FAQ · Blackhatter meeting agenda software",
    description:
      "Short answers about Blackhatter: who it is for, how meeting objectives work, what you can export, and why it is not a security product.",
  },
  "/privacy": {
    path: "/privacy",
    title: "Privacy · Blackhatter",
    description:
      "How Blackhatter handles account and meeting data during early access.",
    index: false,
  },
  "/terms": {
    path: "/terms",
    title: "Terms · Blackhatter",
    description:
      "Early-access terms for using Blackhatter to design meetings and export pre-reads.",
    index: false,
  },
  "/guides": {
    path: "/guides",
    title: "Guides for better meeting design · Blackhatter",
    description:
      "Practical guides on building a meeting agenda from objectives, writing a pre-read, and choosing how long the hold should be.",
  },
  "/guides/meeting-agenda-from-objectives": {
    path: "/guides/meeting-agenda-from-objectives",
    title: "How to build a meeting agenda from objectives · Blackhatter",
    description:
      "Start with Decide, Align, Inform, and the rest — then build agenda blocks that actually cover those aims before you send the calendar hold.",
  },
  "/guides/meeting-pre-read": {
    path: "/guides/meeting-pre-read",
    title: "Meeting pre-read: what to send before the hold · Blackhatter",
    description:
      "A meeting pre-read tells people the plan, the timing, and the purpose before they sit down. Here is what to include and how to send it.",
  },
  "/guides/meeting-length": {
    path: "/guides/meeting-length",
    title: "How long should this meeting be? · Blackhatter",
    description:
      "Compare agenda duration to the calendar hold. A meeting that is too short cuts objectives; one that is too long wastes the room.",
  },
  "/404": {
    path: "/404",
    title: "Page not found · Blackhatter",
    description: "That page is not on Blackhatter. Try the product, guides, or FAQ.",
    index: false,
  },
};

export const prerenderPaths = Object.keys(pages).filter((path) => path !== "/404");

export function pageSeo(pathname: string): PageSeo {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return pages[normalized] ?? pages["/404"];
}

export function canonicalUrl(pathname: string): string {
  const page = pageSeo(pathname);
  const path = page.path === "/404" ? pathname : page.path;
  if (path === "/" || path === "/404") return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${path}`;
}

export function ogImageUrl(): string {
  return `${SITE_ORIGIN}/og.png`;
}

function escapeAttr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function jsonLdFor(pathname: string): object[] {
  const page = pageSeo(pathname);
  const origin = SITE_ORIGIN;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: origin,
    logo: `${origin}/favicon.svg`,
    description:
      "A meeting-quality workspace for designing agendas against objectives. Not a security or hacking product.",
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: origin,
    description: DEFAULT_DESCRIPTION,
  };
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: origin,
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Facilitators and meeting owners",
    },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  if (page.path === "/") return [organization, website, software];
  if (page.path === "/pricing") return [software];
  if (page.path === "/faq") return [faqPage];
  return [];
}

export function headHtml(pathname: string): string {
  const page = pageSeo(pathname);
  const canonical = canonicalUrl(pathname);
  const image = ogImageUrl();
  const robots = page.index === false ? "noindex, nofollow" : "index, follow";
  const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
  const jsonLd = jsonLdFor(pathname);

  const tags = [
    `<title>${escapeAttr(page.title)}</title>`,
    `<meta name="description" content="${escapeAttr(page.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:alt" content="Blackhatter — meeting quality, by design" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(page.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  ];

  if (verification) {
    tags.push(
      `<meta name="google-site-verification" content="${escapeAttr(verification)}" />`,
    );
  }

  for (const block of jsonLd) {
    tags.push(
      `<script type="application/ld+json" data-seo="true">${JSON.stringify(block)}</script>`,
    );
  }

  return tags.join("\n    ");
}

export function sitemapXml(): string {
  const urls = Object.values(pages)
    .filter((page) => page.index !== false && page.path !== "/404")
    .map((page) => {
      const loc = page.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${page.path}`;
      const priority = page.path === "/" ? "1.0" : page.path.startsWith("/guides") ? "0.8" : "0.7";
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function applyHead(pathname: string) {
  if (typeof document === "undefined") return;
  const page = pageSeo(pathname);
  const canonical = canonicalUrl(pathname);
  const image = ogImageUrl();
  const robots = page.index === false ? "noindex, nofollow" : "index, follow";

  document.title = page.title;
  upsertMeta("name", "description", page.description);
  upsertMeta("name", "robots", robots);
  upsertLink("canonical", canonical);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:title", page.title);
  upsertMeta("property", "og:description", page.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:image", image);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", page.title);
  upsertMeta("name", "twitter:description", page.description);
  upsertMeta("name", "twitter:image", image);

  document
    .querySelectorAll('script[type="application/ld+json"][data-seo="true"]')
    .forEach((node) => node.remove());
  for (const block of jsonLdFor(pathname)) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "true";
    script.textContent = JSON.stringify(block);
    document.head.append(script);
  }
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.append(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.append(el);
  }
  el.setAttribute("href", href);
}
