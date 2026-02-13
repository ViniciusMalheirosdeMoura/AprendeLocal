import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../supabase-client";

export default function Cadastro() {
  const navigate = useNavigate();

  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const cepRef = useRef(null);

  const [idade, setIdade] = useState(18);
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();

    if (loading) return;

    const nome = nomeRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const senha = senhaRef.current?.value;
    const cep = cepRef.current?.value?.trim();

    if (!nome || !email || !senha) {
      alert("Preencha nome, email e senha.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: { nome, cep, idade: String(idade) },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      
      const userId = data?.user?.id;

      if (userId) {
        await supabase
          .from("profiles")
          .upsert(
            { id: userId, nome, cep, age: idade },
            { onConflict: "id" }
          );
      }

      alert(
        "Cadastro criado! Faça o login. "
      );

      navigate("/entrar");
    } catch (err) {
      alert(err?.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
  min-h-screen
  bg-gradient-to-br
  from-blue-950 via-blue-600 to-blue-300
  dark:from-blue-950 dark:via-blue-600 dark:to-blue-300
  relative overflow-hidden
">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 min-h-screen flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          
          <div className="rounded-3xl bg-white/85 backdrop-blur border border-white/40 shadow p-8 md:p-10">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Criar Conta</h2>

              <p className="text-slate-600">
                Preencha os campos abaixo para se cadastrar no AprendeLocal
              </p>
            </div>

            <form className="space-y-6 mt-8" onSubmit={handleCadastro}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Nome:
                </label>
                <input
                  ref={nomeRef}
                  type="text"
                  placeholder="Seu nome completo"
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email:
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Senha:
                </label>
                <input
                  ref={senhaRef}
                  type="password"
                  placeholder="********"
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Cep:
                </label>
                <input
                  ref={cepRef}
                  type="text"
                  placeholder="00000-000"
                  className="w-full px-5 py-3 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition bg-white"
                />
              </div>

              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Idade:{" "}
                  <span className="font-semibold text-blue-700">{idade}</span>
                </label>

                <input
                  type="range"
                  min={1}
                  max={100}
                  value={idade}
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />

                <p className="text-sm text-slate-600"></p>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/entrar" className="text-sm text-slate-600">
                Já possui conta?{" "}
                <span className="font-semibold text-blue-700 hover:underline">
                  Faça login para continuar.
                </span>
              </Link>
            </div>
          </div>

         
          <div className="rounded-3xl overflow-hidden bg-white/25 backdrop-blur border border-white/40 shadow relative">
            <img
              src="https:
              alt="
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />

            <div className="relative z-10 p-10 md:p-12 min-h-[420px] flex flex-col justify-center text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow text-white">
                Junte-se ao <br /> AprendeLocal
              </h1>

              <p className="mt-5 text-lg text-white/85">
                Cadastre-se para começar sua jornada <br />
                de inovação e criatividade.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Link to="/">
                  <button className="px-6 py-3 rounded-lg font-semibold shadow bg-white text-blue-700 hover:bg-white/90 transition">
                    Voltar para o início
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
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
            className="absolute w-2 h-2 bg-blue-300 dark:bg-white rounded-full opacity-30"
          />
        ))}
      </div>
    </div>
  );
}
