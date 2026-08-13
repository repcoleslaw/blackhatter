const MAX_URL_LENGTH = 2000;

export function isHttpsUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("https://") &&
    value.length > "https://".length &&
    value.length <= MAX_URL_LENGTH
  );
}

export function isAllowedDocLinkUrl(value: string): boolean {
  return value === "" || isHttpsUrl(value);
}
