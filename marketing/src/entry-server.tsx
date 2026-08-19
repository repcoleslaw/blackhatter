import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppRoutes } from "./App";
import { headHtml, prerenderPaths, sitemapXml } from "./lib/seo";

export { prerenderPaths, sitemapXml };

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  );
  return { html, head: headHtml(url) };
}
