/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string;
  readonly VITE_DEFAULT_ANIMAL_ID: string;
  readonly VITE_DEFAULT_ANIMAL_NAME: string;
  readonly VITE_DEFAULT_ANIMAL_EMOJI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
