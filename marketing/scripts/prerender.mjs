import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(root, "../dist");
const serverEntry = path.resolve(root, "../dist-ssr/entry-server.js");

const { render, prerenderPaths, sitemapXml } = await import(
  pathToFileURL(serverEntry).href
);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const routes = [...prerenderPaths, "/404"];

function apply(templateHtml, url) {
  const { html, head } = render(url);
  return templateHtml
    .replace(/\s*<title>[^<]*<\/title>/, "")
    .replace(/\s*<meta\s+name="description"[^>]*>/i, "")
    .replace("<!--app-head-->", head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

for (const url of routes) {
  const page = apply(template, url);
  const file =
    url === "/"
      ? path.join(dist, "index.html")
      : url === "/404"
        ? path.join(dist, "404.html")
        : path.join(dist, url.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);
  console.log(`prerender ${url} -> ${path.relative(dist, file)}`);
}

fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemapXml());
console.log("wrote sitemap.xml");
