import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../supabase-client";

export default function Login() {
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const senhaRef = useRef(null);

  async function handleLogin(e) {
    e.preventDefault();

    const email = emailRef.current?.value?.trim();
    const senha = senhaRef.current?.value;

    if (!email || !senha) {
      alert("Preencha email e senha.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert(error.message);
      return;
    }

    
    localStorage.setItem("token", data.session.access_token);

    navigate("/");
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
          
          <div className="rounded-3xl overflow-hidden bg-white/25 backdrop-blur border border-white/40 shadow relative">
            <img
              src="https:"
              alt="zero"
              
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />

            <div className="relative z-10 p-10 md:p-12 min-h-[420px] flex flex-col justify-center text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow text-white">
                Aprenda STEM de forma adaptativa e gamificada
              </h1>

              <p className="mt-5 text-lg text-white/85">
                Conecte teoria e prática através da cultura maker. Aprenda STEM resolvendo
              </p>

              <p className="mt-2 text-lg font-semibold text-white/90">
                problemas reais em makerspaces locais com metodologia adaptativa e gamificada
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

          
          <div className="rounded-3xl bg-white/85 backdrop-blur border border-white/40 shadow p-8 md:p-10">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Login</h2>
              <p className="text-slate-600">
                Digite seus dados para acessar sua conta do AprendeLocal
              </p>
            </div>

            <form className="space-y-6 mt-8" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  E-mail:
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

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                Entrar
              </button>

              <Link to="/cadastrar">
                <button
                  type="button"
                  className="w-full border border-slate-300 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-700 transition bg-white"
                >
                  Cadastrar
                </button>
              </Link>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Clique em "Entrar" para acessar sua conta ou "Cadastrar" para criar uma nova.
              </p>
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
