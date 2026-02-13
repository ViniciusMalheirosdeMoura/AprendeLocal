import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { X } from "lucide-react";

export function AvatarPickerModal({ open, onClose, onSelected }) {
  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!open) return;

    let alive = true;

    async function loadAvatars() {
      setLoading(true);
      setErro("");

      try {
        const { data, error } = await supabase
          .from("avatars")
          .select("id, name, url")
          .eq("is_active", true)
          .order("id", { ascending: true });

        if (error) throw error;
        if (alive) setAvatars(data || []);
      } catch (e) {
        if (alive) setErro(e.message || "Erro ao carregar avatares");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAvatars();

    return () => {
      alive = false;
    };
  }, [open]);

  async function selectAvatar(avatar) {
    setLoading(true);
    setErro("");

    try {
      const { data: userResp, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const user = userResp?.user;
      if (!user) throw new Error("Usuário não logado.");

      const { error: upErr } = await supabase
        .from("profiles")
        .update({ avatar_id: avatar.id })
        .eq("id", user.id);

      if (upErr) throw upErr;

      onSelected?.(avatar); 
      onClose?.();
    } catch (e) {
      setErro(e.message || "Erro ao atualizar avatar");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {}
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-bold">Escolher avatar</h2>
            <p className="text-sm text-gray-500">
              Selecione um avatar do catálogo
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition"
            aria-label="Fechar"
          >
            <X />
          </button>
        </div>

        <div className="p-5">
          {erro && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 border">
              {erro}
            </div>
          )}

          {loading && avatars.length === 0 ? (
            <div className="text-gray-500">Carregando avatares...</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {avatars.map((a) => (
                <button
                  key={a.id}
                  onClick={() => selectAvatar(a)}
                  disabled={loading}
                  className="group rounded-2xl border hover:shadow-md transition p-2 disabled:opacity-50"
                  title={a.name || `Avatar ${a.id}`}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50">
                    <img
                      src={a.url}
                      alt={a.name || "avatar"}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500 truncate">
                    {a.name || `Avatar ${a.id}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
A