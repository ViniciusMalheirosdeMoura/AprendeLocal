import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Makerspaces() {
  const [activeTab, setActiveTab] = useState("locais");

  const makerspaces = [
   {
  id: 1,
  name: "Centro de Inovação – Inova USP",
  rating: 4.7,
  description: "Espaço de inovação e fabricação digital da Universidade de São Paulo com equipamentos como impressoras 3D, CNC e corte a laser para criação e prototipagem.",
  location: "Cidade Universitária – São Paulo, SP",
  hours: "Seg–Sex: 08h–22h (aproximado, sujeito a confirmação)",
  image: "https:"
},
    {
      id: 2,
      name: "Maker Space Rio",
      rating: 4.6,
      description: "Centro de inovação com foco em robótica e IoT",
      location: "Rio de Janeiro, RJ",
      hours: "Ter–Sáb: 10h–19h",
      image: "https:"
    },
  ];

  return (
    <div className="
  min-h-screen
  bg-gradient-to-br
  from-blue-950 via-blue-600 to-blue-300
  dark:from-blue-950 dark:via-blue-600 dark:to-blue-300
  relative overflow-hidden
">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-2">
            Makerspaces
          </h1>
          <p className="text-white/80 max-w-2xl">
            Conecte-se com espaços makers locais para aplicar o conhecimento
            aprendido nos cursos. Acesse equipamentos, participe de eventos e
            colabore com outros makers.
          </p>
        </motion.div>

        
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("locais")}
            className={`px-4 py-2 rounded-full font-medium transition
              ${
                activeTab === "locais"
                  ? "bg-white/80 text-slate-900 shadow backdrop-blur"
                  : "bg-white/30 text-white hover:bg-white/40 backdrop-blur"
              }`}
          >
            Locais de Encontro
          </button>

        </div>

        
        {activeTab === "locais" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10"
          >
            {makerspaces.map((space) => (
              <div
                key={space.id}
                className="rounded-2xl overflow-hidden bg-white/85 backdrop-blur border border-white/40 shadow hover:shadow-lg transition"
              >
                <img
                  src={space.image}
                  alt={space.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-lg text-slate-900">
                      {space.name}
                    </h3>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                      ⭐ {space.rating}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm">{space.description}</p>

                  <div className="text-sm text-slate-600 space-y-1">
                    <div>📍 {space.location}</div>
                    <div>🕒 {space.hours}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "mapa" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full h-96 rounded-2xl bg-white/60 backdrop-blur border border-white/40 flex items-center justify-center shadow"
          >
            <p className="text-slate-800">
              Mapa interativo ainda não implementado
            </p>
          </motion.div>
        )}

       
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mt-10 rounded-3xl bg-white/35 backdrop-blur border border-white/40 p-8 md:p-10 shadow"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-3 text-center">
            Pronto para transformar seu aprendizado?
          </h2>

          <p className="max-w-2xl mx-auto mb-6 text-lg text-white/85 text-center">
            Junte-se a milhares de estudantes aplicando STEM em projetos reais
            através da cultura maker!
          </p>

          <div className="flex justify-center">
            
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
