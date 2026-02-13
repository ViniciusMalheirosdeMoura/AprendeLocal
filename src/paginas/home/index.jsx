import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../supabase-client";

function HeroSection({ onStart, onExplore }) {
  return (
    <section className="relative text-center py-20 px-6">
      <div className="max-w-5xl mx-auto rounded-3xl bg-white/35 backdrop-blur border border-white/40 shadow p-10 md:p-14">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow">
          Aprenda STEM de forma adaptativa e gamificada
        </h1>

        <p className="max-w-3xl mx-auto text-base md:text-lg text-white/85 mb-10">
          Conecte teoria e prática através da cultura maker. Aprenda STEM resolvendo problemas reais em makerspaces
          locais com metodologia adaptativa e gamificada.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            aria-label="Começar agora"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-white/90 transition"
            onClick={onStart}
          >
            Começar Agora
          </button>

          <button
            aria-label="Explorar Makerspaces"
            className="bg-white/25 text-blue px-6 py-3 rounded-lg font-semibold backdrop-blur border border-white/40 hover:bg-white/30 transition"
            onClick={onExplore}
          >
            Explorar Makerspaces
          </button>
        </div>
      </div>
    </section>
  );
}


function FeaturesSection() {
  const features = [
    {
      icon: "📚",
      title: "Aprendizagem Adaptativa",
      description: "Conteúdo personalizado que se ajusta ao seu ritmo e nível de conhecimento.",
    },
    {
      icon: "🕹️",
      title: "Gamificação Completa",
      description: "Ganhe pontos, badges e conquiste desafios enquanto aprende.",
    },
    {
      icon: "🔬",
      title: "Teoria e Prática",
      description: "Ponte entre conteúdo teórico e problemas práticos reais da cultura maker.",
    },
    {
      icon: "🧰",
      title: "Makerspaces",
      description: "Conecte-se com espaços makers locais para praticar o que aprendeu.",
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow mb-3">
            Por que escolher o AprendeLocal?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Conectamos teoria e prática com cultura maker para transformar sua jornada STEM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/85 backdrop-blur border border-white/40 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="mb-3 text-4xl" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function CourseCard({ course }) {
  return (
    <div className="w-full bg-white/85 backdrop-blur border border-white/40 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{course.titulo}</h3>

      <div className="text-sm text-slate-700 space-y-1">
        <p>
          <span className="font-semibold">Categoria:</span> {course.categoria}
        </p>
        <p>
          <span className="font-semibold">Nível:</span> {course.nivel}
        </p>

        
      </div>
    </div>
  );
}


function CoursesSection({ courses, loading, error }) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow">Cursos Populares</h2>
          <p className="text-white/80 mt-2">Comece sua jornada de aprendizado</p>
        </div>

        {loading ? (
          <div className="text-center text-white/80">Carregando cursos...</div>
        ) : error ? (
          <div className="text-center text-red-100 bg-red-500/20 border border-red-200/30 rounded-xl p-4">
            Erro ao carregar cursos: {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-white/80">Nenhum curso encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/cursos"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-block bg-white/25 text-black px-6 py-3 rounded-lg font-semibold backdrop-blur border border-white/40 hover:bg-white/30 transition"
          >
            Todos os Cursos
          </Link>
        </div>
      </div>
    </section>
  );
}


function CallToAction({ onStart }) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white/35 backdrop-blur border border-white/40 p-10 md:p-12 shadow text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow mb-4">
            Pronto para transformar seu aprendizado?
          </h2>

          <p className="max-w-2xl mx-auto mb-8 text-white/85 text-lg">
            Junte-se a milhares de estudantes aplicando STEM em projetos reais através da cultura maker
          </p>

          <button
            aria-label="Começar Jornada Maker"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/90 transition"
            onClick={onStart}
          >
            Começar Jornada Maker
          </button>
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState("");

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPopularCourses() {
      setLoadingCourses(true);
      setErrorCourses("");

      
      const { data, error } = await supabase
        .from("courses")
        .select("id, titulo, categoria, nivel")
        .order("id", { ascending: true })
        .limit(3);

      if (!mounted) return;

      if (error) {
        setErrorCourses(error.message);
        setCourses([]);
      } else {
        setCourses(data ?? []);
      }

      setLoadingCourses(false);
    }

    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsLogged(!!data?.session);
    }

    loadPopularCourses();
    checkAuth();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsLogged(!!session);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const goStart = () => navigate(isLogged ? "/cursos" : "/entrar");

  return (
    <div className="
  min-h-screen
  bg-gradient-to-br
  from-blue-950 via-blue-600 to-blue-300
  dark:from-blue-950 dark:via-blue-600 dark:to-blue-300
  relative overflow-hidden
">

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <HeroSection onStart={goStart} onExplore={() => navigate("/makerspaces")} />

        <FeaturesSection />

        <CoursesSection courses={courses} loading={loadingCourses} error={errorCourses} />

        <CallToAction onStart={goStart} />
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
