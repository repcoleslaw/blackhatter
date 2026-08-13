export function appOrigin() {
  return (import.meta.env.VITE_APP_ORIGIN ?? "http://localhost:5173").replace(
    /\/$/,
    "",
  );
}

export function appHref(path: string) {
  const origin = appOrigin();
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
