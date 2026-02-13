export default function Badge({ curso }) {  
  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Parabéns!</h2>
      <p className="mb-4">Você concluiu o curso {curso} 🎉</p>
      <div className="inline-block p-6 bg-yellow-300 rounded-full text-4xl">🏅</div>
    </div>
  );
}