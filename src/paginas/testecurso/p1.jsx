
import { supabase } from "../../supabase-client";


export function sortByOrder(a, b) {
  return (a.order_index ?? 0) - (b.order_index ?? 0);
}

export function buildOrderedAllMaterials(modules, materialsByModule) {
  const all = [];
  for (const m of [...(modules || [])].sort(sortByOrder)) {
    const list = (materialsByModule[String(m.id)] || []).slice().sort(sortByOrder);
    for (const it of list) {
      all.push({ ...it, module_id: String(m.id), module_title: m.title });
    }
  }
  return all;
}

export function computeState(modules, materialsByModule, completedIdsSet) {
  const orderedAllMaterials = buildOrderedAllMaterials(modules, materialsByModule);
  const totalMaterials = orderedAllMaterials.length;
  const completedCount = completedIdsSet.size;

  const progressPercent = totalMaterials
    ? Math.round((completedCount / totalMaterials) * 100)
    : 0;

  let firstNotCompleted = null;
  for (const mat of orderedAllMaterials) {
    if (!completedIdsSet.has(String(mat.id))) {
      firstNotCompleted = mat;
      break;
    }
  }

  const unlockedSet = new Set();
  for (const id of completedIdsSet) unlockedSet.add(String(id));
  if (firstNotCompleted) unlockedSet.add(String(firstNotCompleted.id));

  const isCourseCompleted = !firstNotCompleted && totalMaterials > 0;

  return {
    orderedAllMaterials,
    totalMaterials,
    completedCount,
    progressPercent,
    currentMaterial: firstNotCompleted,
    unlockedMaterialIds: Array.from(unlockedSet),
    completedMaterialIds: Array.from(completedIdsSet),
    isCourseCompleted,
  };
}

export async function ensureEnrollment(userId, courseId) {
  const { data: enroll, error: eErr } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (eErr) throw eErr;

  if (!enroll) {
    const { error: insEnrollErr } = await supabase.from("enrollments").insert({
      user_id: userId,
      course_id: courseId,
    });
    if (insEnrollErr) throw insEnrollErr;
  }
}

export async function awardBadgeIfCompleted(userId, courseId, courseRow, isCourseCompleted) {
  if (!isCourseCompleted) return;

  const badgeName = courseRow?.badge;
  if (!badgeName) return;

  
  const { data: badgeRow, error: badgeErr } = await supabase
    .from("badges")
    .select("id")
    .eq("name", badgeName)
    .maybeSingle();

  if (badgeErr) throw badgeErr;
  if (!badgeRow?.id) return; 

  const badgeId = badgeRow.id;

 
  const { data: already, error: alreadyErr } = await supabase
    .from("user_badges")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("badge_id", badgeId)
    .maybeSingle();

  if (alreadyErr) throw alreadyErr;

  if (!already) {
    const { error: insBadgeErr } = await supabase.from("user_badges").insert({
      user_id: userId,
      course_id: courseId,
      badge_id: badgeId,
      earned_at: new Date().toISOString(),
    });

    
    if (insBadgeErr && insBadgeErr.code !== "23505") throw insBadgeErr;
  }
}

export async function fetchCourseStateFromSupabase(courseId) {
  const { data: uData, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  const userId = uData?.user?.id;
  if (!userId) throw new Error("Sessão inválida. Faça login novamente.");

  
  const { data: course, error: cErr } = await supabase
    .from("courses")
    .select("id,titulo,descricao,categoria,nivel,badge")
    .eq("id", courseId)
    .single();
  if (cErr) throw cErr;

  
  const { data: modules, error: mErr } = await supabase
    .from("course_modules")
    .select("id,course_id,title,description,order_index")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });
  if (mErr) throw mErr;

  
  const moduleIds = (modules || []).map((m) => String(m.id));
  const materialsByModule = {};
  if (moduleIds.length) {
    const { data: mats, error: mmErr } = await supabase
      .from("module_materials")
      .select("id,module_id,title,content,type,order_index")
      .in("module_id", moduleIds)
      .order("order_index", { ascending: true });
    if (mmErr) throw mmErr;

    for (const item of mats || []) {
      const mid = String(item.module_id);
      if (!materialsByModule[mid]) materialsByModule[mid] = [];
      materialsByModule[mid].push(item);
    }
  }

  
  await ensureEnrollment(userId, courseId);

  
  const { data: mp, error: mpErr } = await supabase
    .from("material_progress")
    .select("material_id")
    .eq("user_id", userId)
    .eq("course_id", courseId);
  if (mpErr) throw mpErr;
  const completedSet = new Set((mp || []).map((x) => String(x.material_id)));

 
  const { data: pointer, error: pErr } = await supabase
    .from("course_progress")
    .select("id,user_id,course_id,current_module_id,current_material_id,updated_at,completed_at")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (pErr) throw pErr;

  const state = computeState(modules || [], materialsByModule, completedSet);

  
  await awardBadgeIfCompleted(userId, courseId, course, state.isCourseCompleted);

  return {
    course,
    modules: modules || [],
    materialsByModule,
    pointer: pointer || null,
    ...state,
  };
}

export async function completeMaterialFromSupabase(courseId, materialId) {
  const { data: uData, error: uErr } = await supabase.auth.getUser();
  if (uErr) throw uErr;
  const userId = uData?.user?.id;
  if (!userId) throw new Error("Sessão inválida. Faça login novamente.");

  
  const { data: modIds, error: modErr } = await supabase
    .from("course_modules")
    .select("id")
    .eq("course_id", courseId);
  if (modErr) throw modErr;

  const moduleIds = (modIds || []).map((m) => String(m.id));
  if (!moduleIds.length) throw new Error("Curso sem módulos");

  const { data: mat, error: matErr } = await supabase
    .from("module_materials")
    .select("id,module_id")
    .eq("id", materialId)
    .in("module_id", moduleIds)
    .maybeSingle();
  if (matErr) throw matErr;
  if (!mat) throw new Error("Material não pertence ao curso");

  const { error: insErr } = await supabase.from("material_progress").insert({
    user_id: userId,
    course_id: courseId,
    module_id: String(mat.module_id),
    material_id: String(materialId),
  });

  if (insErr && insErr.code !== "23505") throw insErr;
  return { ok: true };
}
