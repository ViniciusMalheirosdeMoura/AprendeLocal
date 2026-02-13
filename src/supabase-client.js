import { createClient } from "@supabase/supabase-js";

const config = window.__APP_CONFIG__;

if (!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) {
  throw new Error("Configuração do Supabase não encontrada");
}

export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);
