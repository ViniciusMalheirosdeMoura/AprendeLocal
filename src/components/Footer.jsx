
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-300 p-6 text-sm text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold">AprendeLocal</h3>
          <p>Educação STEM para todos</p>
        </div>
        <div>
          <h3 className="font-semibold">Sobre</h3>
          <ul>
            <li><a href="#" className="hover:underline">Nossa Missão</a></li>
            <li><a href="#" className="hover:underline">Equipe</a></li>
            <li><a href="#" className="hover:underline">Parceiros</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Suporte</h3>
          <ul>
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Contato</a></li>
            <li><a href="#" className="hover:underline">Termos de Uso</a></li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-6">
        © 2026 AprendeLocal. Plataforma dedicada à educação STEM.
      </p>
    </footer>
  );
}
