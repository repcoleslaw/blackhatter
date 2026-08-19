/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ORIGIN?: string;
  readonly VITE_SITE_ORIGIN?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
