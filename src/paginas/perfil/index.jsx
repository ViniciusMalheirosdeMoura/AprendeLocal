

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../supabase-client";
import { UserInfoCard } from "./user-info-card";
import { BadgesSection } from "./badges-section";
import { ActiveCourses } from "./active-courses";
import { CommunitiesSection } from "./communities-section";


function limparCep(cep = "") {
  return String(cep).replace(/\D/g, "").slice(0, 8);
}

function formatarCep(cep = "") {
  const c = limparCep(cep);
  if (c.length !== 8) return cep || "";
  return `${c.slice(0, 5)}-${c.slice(5)}`;
}

async function buscarCidadeUFPorCep(cep) {
  const cepLimpo = limparCep(cep);

  if (cepLimpo.length !== 8) {
    return { ok: false, error: "CEP inválido", data: null };
  }

  const cacheKey = `cep:${cepLimpo}`;

  const cached =
    typeof window !== "undefined"
      ? localStorage.getItem(cacheKey)
      : null;

  if (cached) {
    try {
      return { ok: true, error: null, data: JSON.parse(cached) };
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  const res = await fetch(
    `https://viacep.com.br/ws/${cepLimpo}/json/`
  );

  if (!res.ok) {
    return { ok: false, error: "Falha ao consultar CEP", data: null };
  }

  const json = await res.json();

  if (json?.erro) {
    return { ok: false, error: "CEP não encontrado", data: null };
  }

  const data = {
    cidade: json.localidade || "",
    uf: json.uf || "",
    bairro: json.bairro || "",
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(cacheKey, JSON.stringify(data));
  }

  return { ok: true, error: null, data };
}


export function Perfil() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [userId, setUserId] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    age: null,
    avatarUrl: "",
    cep: "",
  });


  const [locationLoading, setLocationLoading] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [bairro, setBairro] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPerfil() {
      setLoading(true);
      setErro("");

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userErr || !user) {
        navigate("/entrar");
        return;
      }

      if (isMounted) setUserId(user.id);

      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("nome, idade, avatar_url, cep")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted) return;


      if (profErr) {
        const nomeMeta = user.user_metadata?.nome ?? "";
        const avatarMeta = user.user_metadata?.avatar_url ?? "";

        setProfile({
          name: nomeMeta || user.email || "Usuário",
          age: null,
          avatarUrl: avatarMeta || "",
          cep: "",
        });

        setLoading(false);
        return;
      }


      if (!prof) {
        const nomeMeta = user.user_metadata?.nome ?? "";
        const avatarMeta = user.user_metadata?.avatar_url ?? "";

        await supabase.from("profiles").insert([
          {
            id: user.id,
            nome: nomeMeta || (user.email ?? "Usuário"),
            avatar_url: avatarMeta || null,
            cep: null,
          },
        ]);

        setProfile({
          name: nomeMeta || user.email || "Usuário",
          age: null,
          avatarUrl: avatarMeta || "",
          cep: "",
        });

        setLoading(false);
        return;
      }

      setProfile({
        name: prof.nome || user.email || "Usuário",
        age: prof.idade ?? null,
        avatarUrl: prof.avatar_url || "",
        cep: prof.cep || "",
      });

      setLoading(false);
    }

    loadPerfil();

    return () => {
      isMounted = false;
    };
  }, [navigate]);


  useEffect(() => {
    let alive = true;

    async function loadLocalizacao() {
      setLocationText("");
      setBairro("");

      const cep = profile.cep;
      const cepLimpo = limparCep(cep);

      if (!cepLimpo || cepLimpo.length !== 8) return;

      setLocationLoading(true);
      try {
        const result = await buscarCidadeUFPorCep(cepLimpo);
        if (!alive) return;

        if (result.ok) {
          const { cidade, uf, bairro } = result.data || {};
          setLocationText(cidade && uf ? `${cidade}/${uf}` : "");
          setBairro(bairro || "");
        } else {
          setLocationText("");
          setBairro("");
        }
      } catch {
        if (!alive) return;
        setLocationText("");
        setBairro("");
      } finally {
        if (!alive) return;
        setLocationLoading(false);
      }
    }

    loadLocalizacao();

    return () => {
      alive = false;
    };
  }, [profile.cep]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 dark:via-blue-600 dark:to-blue-300 dark:from-blue-950 dark:via-blue-600 dark:to-blue-300 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-8x2 mx-auto"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe seu progresso e conquistas! 🚀
          </p>

          {erro ? (
            <div className="mt-4 mx-auto max-w-xl p-3 rounded bg-red-50 text-red-700 border border-red-200">
              {erro}
            </div>
          ) : null}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserInfoCard
              name={profile.name}
              age={profile.age ?? "Não informado"}
              avatarUrl={profile.avatarUrl}
              locationLoading={locationLoading}
              locationText={locationText}
              cepText={formatarCep(profile.cep) || "Não informado"}
              bairroText={bairro}
            />

            <BadgesSection />
            <CommunitiesSection />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <ActiveCourses userId={userId} />

          </div>
        </div>

        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                x: [null, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute w-2 h-2 bg-blue-300 dark:bg-white-600 rounded-full opacity-30"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
