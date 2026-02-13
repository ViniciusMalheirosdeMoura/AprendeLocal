import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { supabase } from "../../supabase-client";

export function BadgesSection() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [badges, setBadges] = useState([]);
  const [earnedIds, setEarnedIds] = useState(new Set());

  
  const BADGE_BUCKET = "badge"; 

 
  const normalizeStoragePath = (value) => {
    if (!value) return null;

    
    if (value.startsWith("http")) return value;

    const prefix = `buckets/${BADGE_BUCKET}/`;
    if (value.startsWith(prefix)) {
      return value.replace(prefix, "");
    }

    
    const prefix2 = `${BADGE_BUCKET}/`;
    if (value.startsWith(prefix2)) {
      return value.replace(prefix2, "");
    }

   
    return value;
  };

  const getBadgeImageUrl = (image_url) => {
    if (!image_url) return null;

   
    if (image_url.startsWith("http")) return image_url;

    const cleanPath = normalizeStoragePath(image_url);
    if (!cleanPath) return null;

    const { data } = supabase.storage.from(BADGE_BUCKET).getPublicUrl(cleanPath);
    return data?.publicUrl ?? null;
  };

  useEffect(() => {
    let mounted = true;

    async function carregarBadges() {
      setLoading(true);
      setErro("");

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      const user = userData?.user;

      if (userErr || !user) {
        setBadges([]);
        setEarnedIds(new Set());
        setLoading(false);
        return;
      }

      const { data: badgesData, error: badgesErr } = await supabase
        .from("badges")
        .select("id, name, description, image_url")
        .order("id", { ascending: true });

      if (!mounted) return;

      if (badgesErr) {
        setErro(badgesErr.message);
        setBadges([]);
        setEarnedIds(new Set());
        setLoading(false);
        return;
      }

      const { data: earnedData, error: earnedErr } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id);

      if (!mounted) return;

      if (earnedErr) {
        setErro(earnedErr.message);
        setBadges(badgesData ?? []);
        setEarnedIds(new Set());
        setLoading(false);
        return;
      }

      const earnedSet = new Set((earnedData ?? []).map((x) => x.badge_id));

      setBadges(badgesData ?? []);
      setEarnedIds(earnedSet);
      setLoading(false);
    }

    carregarBadges();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-300 rounded-3xl p-6 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-blue-800" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-black">
          Minhas Conquistas
        </h3>
      </div>

      {erro ? (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {erro}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-gray-600">Carregando badges...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map((badge, index) => {
            const active = earnedIds.has(badge.id);
            const imgSrc = getBadgeImageUrl(badge.image_url);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: active ? 1.1 : 1.05, y: -5 }}
                className="relative group"
              >
                <div
                  className={`
                    relative rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all
                    ${
                      active
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                        : "bg-gray-200 dark:bg-gray-800 opacity-40"
                    }
                  `}
                >
                  {active && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: index * 0.1,
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <Star className="w-3 h-3 text-white fill-current" />
                    </motion.div>
                  )}

                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`Imagem da badge ${badge.name}`}
                      className={`w-40 h-25 object-cover rounded-xl ${
                        active ? "" : "grayscale opacity-60"
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <div className={active ? "text-white" : "text-gray-400"}>
                      <Trophy className="w-10 h-10" />
                    </div>
                  )}

                  <p
                    className={`text-xs text-center font-semibold ${
                      active ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {badge.name}
                  </p>

                  {!active && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl opacity-20">🔒</div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
