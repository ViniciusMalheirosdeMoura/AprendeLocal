
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase-client";
import GeminiAIChat from "../../components/GeminiAIChat";

import {
  sortByOrder,
  fetchCourseStateFromSupabase,
  completeMaterialFromSupabase,
} from "./p1";

import { BadgeModal, ErrorScreen, LoadingScreen, NotFoundScreen } from "./p3";

export default function TesteCurso() {
  const navigate = useNavigate();
  const { cursoId } = useParams();
  const courseId = Number(cursoId || 1);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materialsByModule, setMaterialsByModule] = useState({});
  const [pointer, setPointer] = useState(null);

  const [completedIds, setCompletedIds] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState([]);

  const [completedCount, setCompletedCount] = useState(0);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const [currentMaterial, setCurrentMaterial] = useState(null);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);


  const [openModuleId, setOpenModuleId] = useState(null);
  const [openMaterialId, setOpenMaterialId] = useState(null);

  
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeCourseName, setBadgeCourseName] = useState("");

  const completedSet = useMemo(() => new Set(completedIds.map(String)), [completedIds]);
  const unlockedSet = useMemo(() => new Set(unlockedIds.map(String)), [unlockedIds]);

  const orderedAllMaterials = useMemo(() => {
    if (!modules?.length) return [];
    const all = [];
    for (const m of [...modules].sort(sortByOrder)) {
      const list = (materialsByModule[String(m.id)] || []).slice().sort(sortByOrder);
      for (const it of list) {
        all.push({ ...it, module_id: String(m.id), module_title: m.title });
      }
    }
    return all;
  }, [modules, materialsByModule]);

  
  useEffect(() => {
    if (!loading && currentMaterial) {
      setOpenModuleId(String(currentMaterial.module_id));
      setOpenMaterialId(String(currentMaterial.id));
    }
  }, [loading, currentMaterial]);

  async function fetchState() {
    const data = await fetchCourseStateFromSupabase(courseId);

    setCourse(data.course || null);
    setModules(data.modules || []);
    setMaterialsByModule(data.materialsByModule || {});
    setPointer(data.pointer || null);

    setCompletedIds(data.completedMaterialIds || []);
    setUnlockedIds(data.unlockedMaterialIds || []);

    setCompletedCount(data.completedCount || 0);
    setTotalMaterials(data.totalMaterials || 0);
    setProgressPercent(data.progressPercent || 0);

    setCurrentMaterial(data.currentMaterial || null);
    setIsCourseCompleted(Boolean(data.isCourseCompleted));

    return data;
  }

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErro("");

      try {
        const { data: sData } = await supabase.auth.getSession();
        if (!sData?.session?.access_token) {
          navigate("/entrar");
          return;
        }

        if (!alive) return;
        await fetchState();
      } catch (e) {
        if (!alive) return;
        const msg = e?.message || "Erro ao carregar estado do curso.";
        if (String(msg).toLowerCase().includes("token")) {
          navigate("/entrar");
          return;
        }
        setErro(msg);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [courseId, navigate]);

  function openMaterial(moduleId, materialId) {
    if (!unlockedSet.has(String(materialId))) return;
    setOpenModuleId(String(moduleId));
    setOpenMaterialId(String(materialId));
  }

  async function markCompleted() {
    if (!openMaterialId) return;
    setErro("");

    try {
      await completeMaterialFromSupabase(courseId, openMaterialId);
      const data = await fetchState();

      
      if (data?.isCourseCompleted) {
        const name =
          data?.course?.titulo ||
          data?.course?.title ||
          data?.course?.name ||
          course?.titulo ||
          course?.title ||
          course?.name ||
          "Curso concluído";

        setBadgeCourseName(name);
        setShowBadgeModal(true);
      }
    } catch (e) {
      setErro(e?.message || "Erro ao concluir material.");
    }
  }

  const openMaterialObj = useMemo(() => {
    if (!openMaterialId) return null;
    return orderedAllMaterials.find((m) => String(m.id) === String(openMaterialId)) || null;
  }, [openMaterialId, orderedAllMaterials]);

  const openMaterialFull = useMemo(() => {
    if (!openMaterialObj) return null;
    const list = materialsByModule[String(openMaterialObj.module_id)] || [];
    return list.find((x) => String(x.id) === String(openMaterialObj.id)) || null;
  }, [openMaterialObj, materialsByModule]);

  if (loading) return <LoadingScreen />;
  if (erro) return <ErrorScreen erro={erro} onBack={() => navigate(-1)} />;
  if (!course) return <NotFoundScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="rounded-3xl bg-white/10 border border-white/15 shadow p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-sm text-white/75">
                {course.categoria} • {course.nivel}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{course.titulo}</h1>
              {course.descricao ? (
                <p className="mt-2 text-white/80 max-w-3xl">{course.descricao}</p>
              ) : null}
            </div>

            <div className="min-w-[240px]">
              <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                <span>Progresso</span>
                <span>
                  {completedCount}/{totalMaterials} • {progressPercent}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/15 overflow-hidden border border-white/15">
                <div
                  className="h-full bg-white/70 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-3 text-xs text-white/70">
                {isCourseCompleted
                  ? "Curso concluído ✅"
                  : currentMaterial
                    ? `Atual: ${currentMaterial.module_title} • ${currentMaterial.title}`
                    : "Carregando..."}
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-white/10 border border-white/15 shadow p-4 md:p-5">
              <div className="text-lg font-semibold mb-3">Conteúdo</div>

              {!modules.length ? (
                <div className="rounded-2xl bg-white/10 border border-white/15 p-4 text-white/85">
                  Nenhum módulo encontrado.
                </div>
              ) : (
                <div className="space-y-3">
                  {modules
                    .slice()
                    .sort(sortByOrder)
                    .map((mod) => {
                      const modId = String(mod.id);
                      const mats = (materialsByModule[modId] || []).slice().sort(sortByOrder);
                      const isOpen = String(openModuleId) === modId;

                      const modTotal = mats.length;
                      const modDone = mats.filter((x) => completedSet.has(String(x.id))).length;

                      return (
                        <div
                          key={modId}
                          className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                        >
                          <button
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center justify-between gap-3"
                            onClick={() => setOpenModuleId(isOpen ? null : modId)}
                          >
                            <div>
                              <div className="font-medium">{mod.title}</div>
                              <div className="text-xs text-white/70">
                                {modDone}/{modTotal} concluídos
                              </div>
                            </div>
                            <div className="text-white/70 text-sm">{isOpen ? "−" : "+"}</div>
                          </button>

                          {isOpen ? (
                            <div className="px-3 pb-3">
                              {!mats.length ? (
                                <div className="px-2 py-3 text-sm text-white/70">
                                  Nenhum material neste módulo.
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {mats.map((mat) => {
                                    const matId = String(mat.id);
                                    const done = completedSet.has(matId);
                                    const unlocked = unlockedSet.has(matId);
                                    const active = String(openMaterialId) === matId;

                                    return (
                                      <button
                                        key={matId}
                                        onClick={() => openMaterial(modId, matId)}
                                        disabled={!unlocked}
                                        className={[
                                          "w-full text-left rounded-xl px-3 py-2 border transition",
                                          active
                                            ? "bg-white/15 border-white/25"
                                            : "bg-white/5 border-white/10",
                                          unlocked
                                            ? "hover:bg-white/10"
                                            : "opacity-50 cursor-not-allowed",
                                        ].join(" ")}
                                      >
                                        <div className="flex items-center justify-between gap-3">
                                          <div className="min-w-0">
                                            <div className="text-sm font-medium truncate">
                                              {mat.title}
                                            </div>
                                            <div className="text-xs text-white/70">
                                              {done
                                                ? "Concluído ✅"
                                                : unlocked
                                                  ? "Disponível"
                                                  : "Bloqueado 🔒"}
                                            </div>
                                          </div>
                                          <div className="text-xs text-white/70">
                                            {mat.type && mat.type !== "EMPTY" ? mat.type : "material"}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </aside>

          
          <main className="lg:col-span-8">
            <div className="rounded-3xl bg-white/10 border border-white/15 shadow p-6 md:p-8">
              {!openMaterialFull ? (
                <div className="text-white/85">Selecione um material liberado para começar.</div>
              ) : (
                <div className="space-y-5">
                  
                  {isCourseCompleted ? (
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                      <div className="font-semibold text-lg">Curso concluído ✅</div>
                      <div className="text-white/80 text-sm mt-1">
                        Você pode continuar lendo os materiais quando quiser.
                      </div>

                      <button
                        className="mt-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 px-4 py-2 transition"
                        onClick={() => navigate("/cursos")}
                      >
                        Voltar para cursos
                      </button>
                    </div>
                  ) : null}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-white/70">{openMaterialObj?.module_title}</div>
                      <h2 className="text-2xl md:text-3xl font-bold">{openMaterialFull.title}</h2>
                      <div className="mt-1 text-sm text-white/70">
                        Tipo:{" "}
                        {openMaterialFull.type && openMaterialFull.type !== "EMPTY"
                          ? openMaterialFull.type
                          : "material"}
                      </div>
                    </div>

                    <div className="text-right text-sm text-white/70">
                      {completedSet.has(String(openMaterialFull.id)) ? "Concluído ✅" : "Em andamento"}
                    </div>
                  </div>

                  <div
                    className="
                      rounded-2xl bg-white/5 border border-white/10 p-6 text-white/90

                      
                      [&>figure]:my-10
                      [&>p]:my-7
                      [&>ul]:my-8
                      [&>ol]:my-8
                      [&>blockquote]:my-10

                      
                      [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold
                      [&>h3]:mt-10 [&>h3]:mb-5 [&>h3]:text-xl  [&>h3]:font-bold
                      [&>h4]:mt-8  [&>h4]:mb-4 [&>h4]:text-lg  [&>h4]:font-semibold

                      
                      [&>ul]:list-disc [&>ul]:pl-7
                      [&>ol]:list-decimal [&>ol]:pl-7
                      [&>ul>li]:my-3
                      [&>ol>li]:my-3

                      
                      [&_p]:leading-8
                      [&_li]:leading-8
                      [&_strong]:text-white [&_strong]:font-semibold

                      
                      [&_img]:rounded-2xl [&_img]:mx-auto

                      
                      [&>blockquote]:pl-6
                      [&>blockquote]:border-l-4
                      [&>blockquote]:border-white/30
                    "
                    dangerouslySetInnerHTML={{
                      __html: openMaterialFull.content || "<p>Conteúdo vazio.</p>",
                    }}
                  />

                 <GeminiAIChat
  moduleTitle={openMaterialObj?.module_title}
  title={openMaterialFull.title}
  content={openMaterialFull.content}
/>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <button
                      className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2 transition"
                      onClick={() => navigate(-1)}
                    >
                      Voltar
                    </button>

                    <button
                      className={[
                        "rounded-xl px-5 py-2 border transition",
                        completedSet.has(String(openMaterialFull.id)) || isCourseCompleted
                          ? "bg-white/10 border-white/15 opacity-70 cursor-not-allowed"
                          : "bg-white/20 hover:bg-white/25 border-white/25",
                      ].join(" ")}
                      onClick={markCompleted}
                      disabled={completedSet.has(String(openMaterialFull.id)) || isCourseCompleted}
                    >
                      {isCourseCompleted ? "Curso concluído" : "Marcar como concluído"}
                    </button>
                  </div>

                  <div className="text-xs text-white/60">
                    Ponteiro:{" "}
                    {pointer?.current_module_id
                      ? `${pointer.current_module_id}/${pointer.current_material_id || "-"}`
                      : "—"}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <BadgeModal
        open={showBadgeModal}
        badgeCourseName={badgeCourseName}
        onClose={() => setShowBadgeModal(false)}
        onContinue={() => {
          setShowBadgeModal(false);
          navigate("/cursos");
        }}
      />
    </div>
  );
}
