

import React from "react";
import { motion } from "framer-motion";
import { User, Cake, MapPin } from "lucide-react";

export function UserInfoCard({
  name,
  age,
  avatarUrl,

  locationLoading = false,
  locationText = "",
  cepText = "",
  bairroText = "",
}) {
  const idadeText =
    age === null || age === undefined || age === "" || age === "Não informado"
      ? "Não informado"
      : `${age} anos`;

  const cidadeText = locationLoading
    ? "Carregando..."
    : locationText || "Não informado";

  const cepFinal = cepText || "Não informado";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 p-1"
    >
      <div className="bg-white dark:bg-gray-300 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-500 flex items-center justify-center ring-4 ring-purple-00">
                <User className="w-10 h-10 text-white" />
              </div>
            )}

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white"
            />
          </motion.div>

          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-900 bg-clip-text text-transparent"
            >
              {name}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-900"
            >
              <Cake className="w-4 h-4" />
              <span className="text-sm">{idadeText}</span>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 }}
              className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-900"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-semibold">{cidadeText}</span>
              <span className="text-sm opacity-70">
                • CEP: {cepFinal}
                {bairroText ? ` • ${bairroText}` : ""}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
