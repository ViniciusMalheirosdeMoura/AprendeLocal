import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function ParticlesBackground({ count = 20 }) {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    function onResize() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * size.w,
      y: Math.random() * size.h,
      scale: Math.random() * 0.6 + 0.4,
      dx: Math.random() * 120 - 60,
      dy: Math.random() * 120 - 60,
      duration: Math.random() * 10 + 10,
    }));
  }, [count, size.w, size.h]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, scale: p.scale, opacity: 0.25 }}
          animate={{
            x: [p.x, p.x + p.dx],
            y: [p.y, p.y - Math.abs(p.dy)],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 rounded-full bg-blue-300 dark:bg-white"
        />
      ))}
    </div>
  );
}
