import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../supabase-client";

export default function Cursos() {
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("Todas");

  const [cursos, setCursos] = useState([]);
  const [matriculadosIds, setMatriculadosIds] = useState(new Set());
  const [concluidosIds, setConcluidosIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const normalize = (text = "") =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  useEffect(() => {
    async function carregarTudo() {
      setLoading(true);
      setErro("");

      
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userErr || !user) {
        navigate("/entrar");
        return;
      }

      
      const { data: progressData, error: progressErr } = await supabase
        .from("course_progress")
        .select("course_id, completed_at")
        .eq("user_id", user.id);

      if (progressErr) {
        setErro(progressErr.message);
        setConcluidosIds(new Set());
      } else {
        const concluidos = new Set(
          (progressData ?? [])
            .filter((p) => p.completed_at)
            .map((p) => p.course_id)
        );
        setConcluidosIds(concluidos);
      }

    
      const { data: coursesData, error: coursesErr } = await supabase
        .from("courses")
        .select("id, titulo, descricao, categoria, nivel, badge, url_img")
        .order("id", { ascending: true });

      if (coursesErr) {
        setErro(coursesErr.message);
        setCursos([]);
        setLoading(false);
        return;
      }

      setCursos(coursesData ?? []);

      
      const { data: enrollData, error: enrollErr } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user.id);

      if (enrollErr) {
        setErro(enrollErr.message);
        setMatriculadosIds(new Set());
        setLoading(false);
        return;
      }

      const ids = new Set((enrollData ?? []).map((e) => e.course_id));
      setMatriculadosIds(ids);

      setLoading(false);
    }

    carregarTudo();
  }, [navigate]);

  async function iniciarOuContinuar(courseId) {
    setErro("");

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userErr || !user) {
      navigate("/entrar");
      return;
    }

    const jaMatriculado = matriculadosIds.has(courseId);

    if (!jaMatriculado) {
      const { error: insertEnrollErr } = await supabase
        .from("enrollments")
        .insert([{ user_id: user.id, course_id: courseId }]);

      if (insertEnrollErr) {
        setErro(insertEnrollErr.message);
        return;
      }

      setMatriculadosIds((prev) => new Set([...prev, courseId]));
    }

    navigate(`/cursos/${courseId}`);
  }

  const categorias = useMemo(() => {
    const cats = cursos.flatMap((c) =>
      (c.categoria || "")
        .split(/[/,]/)
        .map((cat) => cat.trim())
        .filter(Boolean)
    );
    return ["Todas", ...Array.from(new Set(cats))];
  }, [cursos]);

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((curso) => {
      const palavrasBusca = normalize(busca).split(" ").filter(Boolean);

      const textoCurso = `${curso.titulo ?? ""} ${curso.descricao ?? ""} ${curso.categoria ?? ""
        }`;
      const textoNormalizado = normalize(textoCurso);

      const correspondeBusca = palavrasBusca.every((palavra) =>
        textoNormalizado.includes(palavra)
      );

      const filtroNormalizado = normalize(filtro);
      const correspondeFiltro =
        filtro === "Todas" ||
        (curso.categoria || "")
          .split(/[/,]/)
          .some((c) => normalize(c.trim()).includes(filtroNormalizado));

      return correspondeBusca && correspondeFiltro;
    });
  }, [cursos, busca, filtro]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-2">
            Catálogo de Cursos
          </h1>
          <p className="text-white/80">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
       
        <motion.div
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow mb-2">
            Catálogo de Cursos
          </h1>
          <p className="text-white/80 max-w-2xl">
            Explore nossos cursos STEM que conectam teoria e prática através da
            cultura maker. Busque por palavras-chave e filtre por categoria.
          </p>
        </motion.div>

      
        {erro ? (
          <div className="mb-6 p-4 rounded-2xl bg-red-50/90 text-red-700 border border-red-200 shadow">
            {erro}
          </div>
        ) : null}

       
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          
          <label htmlFor="busca-cursos" className="sr-only">
            Buscar cursos
          </label>
          <input
            id="busca-cursos"
            type="text"
            placeholder="Buscar cursos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur border border-white/40 shadow focus:outline-none focus:ring-2 focus:ring-white/60"
          />

         
          <label htmlFor="filtro-categoria" className="sr-only">
            Filtrar cursos por categoria
          </label>
          <select
            id="filtro-categoria"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white/70 backdrop-blur border border-white/40 shadow focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10"
        >
          {cursosFiltrados.length > 0 ? (
            cursosFiltrados.map((curso) => {
              const concluido = concluidosIds.has(curso.id); 
              const jaMatriculado = matriculadosIds.has(curso.id);

              const statusTexto = concluido
                ? "Concluído"
                : jaMatriculado
                  ? "Matriculado"
                  : "Novo";

              const statusClasse = concluido
                ? "bg-blue-100 text-blue-700"
                : jaMatriculado
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700";

              return (
                <div
                  key={curso.id}
                  className="rounded-2xl overflow-hidden bg-white/85 backdrop-blur border border-white/40 shadow hover:shadow-lg transition"
                >
                  <img
                    src={curso.url_img}
                    alt={`Imagem do Curso: ${curso.titulo}`}
                    className="h-44 w-full object-cover"
                  />

                  <div className="p-8 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-lg text-black-900 truncate">
                          {curso.titulo}
                        </h2>

                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-full">
                            {curso.categoria || "Sem categoria"}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-900 px-2 py-1 rounded-full">
                            {curso.nivel || "Nível não informado"}
                          </span>
                          <span className="text-xs bg-green-300 text-slate-900 px-2 py-1 rounded-full">
                            {curso.badge || "Sem Badge"}
                          </span>
                        </div>
                      </div>

                      
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusClasse}`}
                      >
                        {statusTexto}
                      </span>
                    </div>

                    <p className="text-slate-700 text-sm line-clamp-3">
                      {curso.descricao}
                    </p>

                    <button
                      onClick={() => iniciarOuContinuar(curso.id)}
                      className={`w-full mt-2 font-semibold px-4 py-3 rounded-xl shadow transition ${jaMatriculado
                          ? "bg-white text-blue-700 hover:bg-white/90"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      {concluido ? "Rever" : jaMatriculado ? "Continuar" : "Iniciar Curso"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="w-full rounded-2xl bg-white/60 backdrop-blur border border-white/40 flex items-center justify-center shadow p-10">
                <p className="text-slate-900 font-medium">
                  Nenhum curso encontrado.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="mt-2 rounded-3xl bg-white/20 backdrop-blur border border-white/30 p-8 md:p-10 shadow"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-3 text-center">
            Pronto para evoluir com projetos reais?
          </h2>

          <p className="max-w-2xl mx-auto mb-6 text-lg text-white/85 text-center">
            Escolha um curso, pratique e construa seu portfólio com desafios
            maker.
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => {
                const primeiro = cursosFiltrados[0]?.id ?? cursos[0]?.id;
                if (primeiro) iniciarOuContinuar(primeiro);
              }}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/90 transition"
            >
              Começar agora
            </button>
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
