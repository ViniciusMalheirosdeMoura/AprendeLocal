
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, TrendingUp } from "lucide-react";
import { Progress } from "../../components/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";

function sortByOrder(a, b) {
  return (a.order_index ?? 0) - (b.order_index ?? 0);
}

async function getActiveCoursesFromSupabase() {
  
  const { data: uData, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  const userId = uData?.user?.id;
  if (!userId) return { courses: [], stats: { total: 0, media: 0 } };

  
  const { data: enrolls, error: enrollErr } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", userId);

  if (enrollErr) throw enrollErr;

  const courseIds = Array.from(
    new Set((enrolls || []).map((r) => Number(r.course_id)).filter(Boolean))
  );

  if (!courseIds.length) {
    return { courses: [], stats: { total: 0, media: 0 } };
  }

  
  const { data: coursesData, error: coursesErr } = await supabase
    .from("courses")
    .select("id,titulo,descricao,categoria,nivel,badge")
    .in("id", courseIds)
    .order("id", { ascending: true });

  if (coursesErr) throw coursesErr;

  
  const { data: modules, error: modsErr } = await supabase
    .from("course_modules")
    .select("id,course_id")
    .in("course_id", courseIds);

  if (modsErr) throw modsErr;

  const moduleToCourse = {};
  const moduleIds = [];
  for (const m of modules || []) {
    const mid = String(m.id);
    moduleIds.push(mid);
    moduleToCourse[mid] = String(m.course_id);
  }

  
  const totalByCourse = {};
  if (moduleIds.length) {
    const { data: mats, error: matsErr } = await supabase
      .from("module_materials")
      .select("id,module_id,order_index")
      .in("module_id", moduleIds);

    if (matsErr) throw matsErr;

    for (const mat of mats || []) {
      const cid = moduleToCourse[String(mat.module_id)];
      if (!cid) continue;
      totalByCourse[cid] = (totalByCourse[cid] || 0) + 1;
    }
  }

 
  const doneByCourse = {}; 
  const { data: doneRows, error: doneErr } = await supabase
    .from("material_progress")
    .select("course_id,material_id")
    .eq("user_id", userId)
    .in("course_id", courseIds);

  if (doneErr) throw doneErr;

  for (const row of doneRows || []) {
    const cid = String(row.course_id);
    if (!doneByCourse[cid]) doneByCourse[cid] = new Set();
    doneByCourse[cid].add(String(row.material_id));
  }

  
  const { data: pointers, error: pErr } = await supabase
    .from("course_progress")
    .select("course_id,current_module_id,current_material_id,completed_at,updated_at")
    .eq("user_id", userId)
    .in("course_id", courseIds);

  if (pErr) throw pErr;

  const pointerByCourse = {};
  for (const p of pointers || []) pointerByCourse[String(p.course_id)] = p;

  
  const courses = (coursesData || []).map((c) => {
    const cid = String(c.id);
    const totalMaterials = totalByCourse[cid] || 0;
    const completedCount = doneByCourse[cid] ? doneByCourse[cid].size : 0;

    const progressPercent = totalMaterials
      ? Math.round((completedCount / totalMaterials) * 100)
      : 0;

    const isCompleted = totalMaterials > 0 && completedCount >= totalMaterials;

    return {
      id: cid,
      title: c.title ?? c.titulo ?? "Curso sem título",
      description: c.description ?? c.descricao ?? "",
      categoria: c.categoria ?? null,
      nivel: c.nivel ?? null,
      badge: c.badge ?? null,

      totalMaterials,
      completedCount,
      progressPercent,
      isCompleted,

      pointer: pointerByCourse[cid] || null,
    };
  });

  const total = courses.length;
  const media = total
    ? Math.round(
        courses.reduce((acc, x) => acc + (Number(x.progressPercent) || 0), 0) /
          total
      )
    : 0;

  return { courses, stats: { total, media } };
}

export function ActiveCourses() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [activeCourses, setActiveCourses] = useState([]);

  useEffect(() => {
    let alive = true;

    async function carregar() {
      setLoading(true);
      setErro("");

      try {
        const { data: sData } = await supabase.auth.getSession();
        if (!sData?.session?.access_token) {
          if (!alive) return;
          setActiveCourses([]);
          return;
        }

        const data = await getActiveCoursesFromSupabase();

        const cursos = (data.courses || []).map((c) => ({
          id: String(c.id),
          title: c.title,
          description: c.description,
          progress: Number(c.progressPercent) || 0,
          timeRemaining: "—",
          icon: "📘",
          color: "from-blue-500 to-cyan-500",
          totalMaterials: c.totalMaterials,
          completedCount: c.completedCount,
          isCompleted: c.isCompleted,
          pointer: c.pointer,
        }));

        if (!alive) return;
        setActiveCourses(cursos);
      } catch (e) {
        if (!alive) return;
        const msg = e?.message || "Erro ao carregar cursos ativos.";
        setErro(msg);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    carregar();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl bg-white/85 backdrop-blur border border-white/40 shadow p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h3 className="text-lg font-bold text-blue-950">Cursos Ativos</h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-700">
          <TrendingUp className="w-4 h-4" />
          <span>Continue de onde parou</span>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-14 rounded-2xl bg-black/5" />
          <div className="h-14 rounded-2xl bg-black/5" />
        </div>
      ) : erro ? (
        <div className="text-sm text-red-600">{erro}</div>
      ) : activeCourses.length === 0 ? (
        <div className="text-sm text-gray-700">
          Você ainda não iniciou nenhum curso.
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {activeCourses.map((course) => (
              <motion.button
                key={course.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full text-left rounded-2xl border border-black/10 bg-white shadow-sm hover:shadow transition p-4"
                onClick={() => navigate(`/curso/${course.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-xl">
                      {course.icon}
                    </div>

                    <div>
                      <div className="font-semibold text-blue-950">
                        {course.title}
                      </div>
                      <div className="text-xs text-gray-700 line-clamp-2">
                        {course.description}
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>{course.timeRemaining}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 font-medium">
                    {course.progress}%
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-1 w-full">
                    <span>Progresso</span>
                    <span className="font-bold">{course.progress}%</span>
                  </div>

                  <Progress value={course.progress} className="h-2 w-full" />
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-95 transition"
            onClick={() => navigate("/cursos")}
          >
            Ver Todos os Cursos
          </motion.button>
        </>
      )}
    </motion.div>
  );
}
