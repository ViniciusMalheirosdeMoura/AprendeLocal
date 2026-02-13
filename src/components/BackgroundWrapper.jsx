import ParticlesBackground from "./ParticlesBackground";

export default function BackgroundWrapper({ children, count = 20, className = "" }) {
  return (
    <div className={`min-h-screen relative ${className}`}>
      <ParticlesBackground count={count} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
