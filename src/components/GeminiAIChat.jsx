
import React, { useMemo, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function stripHtml(html = "") {

  const text = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function truncate(str = "", max = 12000) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function GeminiAIChat({ title, content, moduleTitle }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const genAI = useMemo(() => {
    if (!API_KEY) return null;
    return new GoogleGenerativeAI(API_KEY);
  }, [API_KEY]);

  const canUseAI = Boolean(API_KEY && genAI);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAnswer("");

    if (!canUseAI) {
      setAnswer(
        "Configuração ausente: defina VITE_GEMINI_API_KEY no seu .env e reinicie o dev server."
      );
      return;
    }

    const q = question.trim();
    if (!q) return;

    setLoading(true);

    try {
  
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const safeTextContent = truncate(stripHtml(content || ""), 14000);

      const prompt = `
Você é um tutor. Responda usando APENAS o material fornecido.
Se a resposta não estiver no material, responda exatamente: "Não é possivel responder sua pergunta.
seja tutor especial para o AprendeLocal, curso de material interdisciplinar com conteudo STEM. "

TÍTULO DO MÓDULO:
${moduleTitle || "Sem módulo"}

TÍTULO DO MATERIAL:
${title || "Sem título"}

MATERIAL (texto extraído do HTML):
${safeTextContent || "Conteúdo vazio."}

PERGUNTA:
${q}
`.trim();

      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.() ?? "";
      setAnswer(text || "Não consegui gerar uma resposta (resposta vazia).");
    } catch (error) {
      console.error("Gemini error:", error);

      const msg =
        error?.message ||
        "Falha ao chamar a IA. Verifique a API key, permissões e o console do navegador.";
      setAnswer(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-3xl bg-black/20 backdrop-blur border border-white/30 p-8 md:p-10 shadow">
      <h3 className="text-center text-white text-2xl font-semibold mb-4">
        Pergunte para o tutor IA do AprendeLocal. 
      </h3>

      {!canUseAI ? (
        <div className="mb-5 rounded-2xl border border-white/25 bg-white/10 p-4 text-white/85 text-sm">
          <div className="font-semibold mb-1">IA desativada</div>
          <div>
            Falta configurar <code className="text-white">VITE_GEMINI_API_KEY</code>.
            Depois de ajustar o <code className="text-white">.env</code>, reinicie o servidor.
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Digite sua pergunta sobre o material aqui..."
          rows={4}
          className="w-full p-2.5 rounded bg-white/10 border border-white/30 text-white placeholder-white/70 mb-4 focus:ring-2 focus:ring-white/50 focus:outline-none transition"
        />

        <button
          type="submit"
          disabled={loading || !question.trim() || !canUseAI}
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Pensando..." : "Perguntar"}
        </button>
      </form>

      {answer ? (
        <div className="mt-5 p-4 border border-white/30 rounded bg-black/20">
          <h4 className="font-bold mb-2 text-white">Resposta:</h4>
          <p className="whitespace-pre-wrap text-white/90">{answer}</p>
        </div>
      ) : null}
    </div>
  );
}
