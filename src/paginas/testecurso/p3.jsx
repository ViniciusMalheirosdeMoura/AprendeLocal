
import { Trophy, Sparkles, X } from "lucide-react";

const BG = "min-h-screen bg-gradient-to-br from-blue-950 via-blue-700 to-blue-400 p-6 text-white";

export function LoadingScreen() {
  return (
    <div className={BG}>
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse rounded-2xl bg-white/10 p-6">
          <div className="h-8 w-64 bg-white/10 rounded mb-4" />
          <div className="h-4 w-full bg-white/10 rounded mb-2" />
          <div className="h-4 w-3/4 bg-white/10 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ErrorScreen({ erro, onBack }) {
  return (
    <div className={BG}>
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-white/10 border border-white/15 p-6">
          <div className="text-xl font-semibold mb-2">Erro</div>
          <div className="text-white/85">{erro}</div>
          <button
            className="mt-4 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 px-4 py-2 transition"
            onClick={onBack}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotFoundScreen() {
  return (
    <div className={BG}>
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-white/10 border border-white/15 p-6">
          Curso não encontrado.
        </div>
      </div>
    </div>
  );
}

export function BadgeModal({ open, badgeCourseName, onClose, onContinue }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-32 h-32 text-yellow-200 animate-pulse" />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Parabéns! 🎉</h2>
          <p className="text-gray-600 mb-6">Você completou o curso com sucesso!</p>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Badge Conquistado</div>
            <div className="text-xl font-bold text-gray-800">{badgeCourseName}</div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Todos os módulos concluídos</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Exercícios práticos finalizados</span>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
          >
            Continuar Aprendendo
          </button>
        </div>
      </div>
    </div>
  );
}
