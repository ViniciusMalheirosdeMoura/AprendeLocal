

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabase-client";
import { useNavigate } from "react-router-dom";

export default function Comunidades() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [user, setUser] = useState(null);

  const [tab, setTab] = useState("todas"); 
  const [busca, setBusca] = useState("");

  const [communities, setCommunities] = useState([]); 
  const [myCommunityIds, setMyCommunityIds] = useState(new Set());

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", image_url: "" });

  const normalize = (text = "") =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  async function loadUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    setUser(data.user ?? null);
    return data.user ?? null;
  }

  async function loadCommunities() {
    const { data, error } = await supabase
      .from("communities_with_counts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setCommunities(data ?? []);
  }

  async function loadMyMemberships(u) {
    if (!u?.id) {
      setMyCommunityIds(new Set());
      return;
    }

    const { data, error } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", u.id);

    if (error) throw error;
    setMyCommunityIds(new Set((data ?? []).map((r) => r.community_id)));
  }

  async function refreshAll() {
    setLoading(true);
    setErro("");

    try {
      const u = await loadUser();
      await Promise.all([loadCommunities(), loadMyMemberships(u)]);
    } catch (e) {
      setErro(e?.message || "Erro ao carregar comunidades.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refreshAll();
    });

    return () => sub?.subscription?.unsubscribe?.();
    
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(busca.trim());
    const base =
      tab === "minhas"
        ? communities.filter((c) => myCommunityIds.has(c.id))
        : communities;

    if (!q) return base;

    return base.filter((c) => {
      const name = normalize(c.name || "");
      const desc = normalize(c.description || "");
      return name.includes(q) || desc.includes(q);
    });
  }, [communities, myCommunityIds, tab, busca]);

  async function handleCreate(e) {
    e.preventDefault();
    setErro("");

    if (!user?.id) {
      setErro("Você precisa estar logado para criar uma comunidade.");
      return;
    }

    const name = form.name.trim();
    const description = form.description.trim();
    const image_url = form.image_url.trim();

    if (!name) {
      setErro("Informe o nome da comunidade.");
      return;
    }

    setCreating(true);
    try {
      const { data: created, error: err1 } = await supabase
        .from("communities")
        .insert([
          {
            owner_id: user.id,
            name,
            description: description || null,
            image_url: image_url || null,
          },
        ])
        .select("id")
        .single();

      if (err1) throw err1;

      const { error: err2 } = await supabase.from("community_members").insert([
        { community_id: created.id, user_id: user.id, role: "admin" },
      ]);
      if (err2) throw err2;

      setForm({ name: "", description: "", image_url: "" });
      await refreshAll();
      setTab("minhas");
    } catch (e2) {
      setErro(e2?.message || "Erro ao criar comunidade.");
    } finally {
      setCreating(false);
    }
  }

  async function joinCommunity(communityId) {
    setErro("");
    if (!user?.id) {
      setErro("Você precisa estar logado para entrar em uma comunidade.");
      return;
    }

    try {
      const { error } = await supabase.from("community_members").insert([
        { community_id: communityId, user_id: user.id, role: "member" },
      ]);
      if (error) throw error;

      setMyCommunityIds((prev) => new Set(prev).add(communityId));
      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, members_count: (c.members_count ?? 0) + 1 }
            : c
        )
      );
    } catch (e) {
      setErro(e?.message || "Erro ao entrar na comunidade.");
    }
  }

  async function leaveCommunity(communityId) {
    setErro("");
    if (!user?.id) {
      setErro("Você precisa estar logado.");
      return;
    }

    try {
      const comm = communities.find((c) => c.id === communityId);
      if (comm?.owner_id === user.id) {
        setErro("Você é o dono dessa comunidade e não pode sair (no MVP).");
        return;
      }

      const { error } = await supabase
        .from("community_members")
        .delete()
        .eq("community_id", communityId)
        .eq("user_id", user.id);

      if (error) throw error;

      setMyCommunityIds((prev) => {
        const n = new Set(prev);
        n.delete(communityId);
        return n;
      });

      setCommunities((prev) =>
        prev.map((c) =>
          c.id === communityId
            ? { ...c, members_count: Math.max((c.members_count ?? 1) - 1, 0) }
            : c
        )
      );
    } catch (e) {
      setErro(e?.message || "Erro ao sair da comunidade.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 dark:via-blue-600 dark:to-blue-300 dark:from-blue-950 dark:via-blue-600 dark:to-blue-300 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Comunidades
            </h1>
            <p className="text-gray-700 dark:text-white/70">
              Crie comunidades e participe de grupos com outros usuários.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("todas")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "todas"
                  ? "bg-blue-600 text-white"
                  : "bg-white/70 text-gray-900 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              }`}
            >
              Todas
            </button>

            <button
              onClick={() => setTab("minhas")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "minhas"
                  ? "bg-blue-600 text-white"
                  : "bg-white/70 text-gray-900 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              }`}
            >
              Minhas
            </button>
          </div>
        </div>

       
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar comunidades..."
              className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-white/20"
            />
          </div>

          <div className="text-sm text-gray-700 dark:text-white/70">
            {user ? "Logado" : "Faça login para criar/entrar"}
          </div>
        </div>

       
        <div className="mt-6 rounded-3xl border border-black/10 bg-white/80 p-5 shadow-lg dark:border-white/10 dark:bg-white/10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Criar comunidade
          </h2>

          <form
            onSubmit={handleCreate}
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm text-gray-700 dark:text-white/70">
                Nome
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-white/20"
                placeholder="Ex: Futebol RS"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm text-gray-700 dark:text-white/70">
                Imagem (URL)
              </label>
              <input
                value={form.image_url}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image_url: e.target.value }))
                }
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-white/20"
                placeholder="https:"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1 block text-sm text-gray-700 dark:text-white/70">
                Descrição
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50 dark:focus:border-white/20"
                placeholder="Sobre o que é a comunidade?"
              />
            </div>
            

            <div className="sm:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={!user || creating}
                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  !user || creating
                    ? "bg-black/10 text-gray-500 dark:bg-white/10 dark:text-white/50"
                    : "bg-blue-600 text-white hover:opacity-90"
                }`}
              >
                {creating ? "Criando..." : "Criar"}
              </button>

              <span className="text-sm text-gray-600 dark:text-white/60">
                Ao criar, você entra automaticamente como admin.
              </span>
            </div>
          </form>
        </div>

        {erro ? (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
            {erro}
          </div>
        ) : null}

        
        <div className="mt-6">
          {loading ? (
            <div className="rounded-3xl border border-black/10 bg-white/80 p-6 text-gray-700 shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white/70">
              Carregando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white/80 p-6 text-gray-700 shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white/70">
              Nenhuma comunidade encontrada.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => {
                const joined = myCommunityIds.has(c.id);
                const isOwner = user?.id && c.owner_id === user.id;

                return (
                  <div
                    key={c.id}
                    className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-lg dark:border-white/10 dark:bg-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/10">
                        {c.image_url ? (
                          <img
                            src={c.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                          {c.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-700 dark:text-white/70">
                          {c.description || "Sem descrição."}
                        </p>

                        <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-white/60">
                          <span>{c.members_count ?? 0} membros</span>
                          {isOwner ? (
                            <span className="rounded-full bg-blue-600/15 px-2 py-1 text-blue-700 dark:bg-white/10 dark:text-white">
                              Dono
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {!joined ? (
                        <button
                          onClick={() => joinCommunity(c.id)}
                          disabled={!user}
                          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                            !user
                              ? "bg-black/10 text-gray-500 dark:bg-white/10 dark:text-white/50"
                              : "bg-blue-600 text-white hover:opacity-90"
                          }`}
                        >
                          Entrar
                        </button>
                      ) : (
                        <button
                          onClick={() => leaveCommunity(c.id)}
                          disabled={!user || isOwner}
                          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                            !user || isOwner
                              ? "bg-black/10 text-gray-500 dark:bg-white/10 dark:text-white/50"
                              : "bg-black/5 text-gray-900 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                          }`}
                        >
                          Sair
                        </button>
                      )}

                      <button
                        type="button"
                        className="rounded-2xl bg-black/5 px-4 py-3 text-sm font-bold text-gray-900 hover:bg-black/10 transition dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                        onClick={() => {
                         
                          alert("Em breve: página da comunidade.");
                        }}
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/perfil")}
            className="rounded-2xl bg-black/5 px-6 py-3 font-bold text-gray-900 hover:bg-black/10 transition dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            Voltar ao Perfil
          </button>
        </div>
      </div>
    </div>
  );
}
