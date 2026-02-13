
export function limparCep(cep = "") {
  return String(cep).replace(/\D/g, "").slice(0, 8);
}

export async function buscarCidadeUFPorCep(cep) {
  const cepLimpo = limparCep(cep);

  if (cepLimpo.length !== 8) {
    return { ok: false, error: "CEP inválido", data: null };
  }

  const cacheKey = `cep:${cepLimpo}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return { ok: true, error: null, data: JSON.parse(cached) };
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  const res = await fetch(`https:
  if (!res.ok) return { ok: false, error: "Falha ao consultar CEP", data: null };

  const json = await res.json();
  if (json?.erro) return { ok: false, error: "CEP não encontrado", data: null };

  const data = {
    cidade: json.localidade || "",
    uf: json.uf || "",
  };

  localStorage.setItem(cacheKey, JSON.stringify(data));
  return { ok: true, error: null, data };
}
