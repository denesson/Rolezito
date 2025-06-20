export default function RankingPage() {
  // MOCK — pode puxar do banco depois
  const ranking = [
    { nome: "Bar do Zé", pontuacao: 9.7 },
    { nome: "Choperia Central", pontuacao: 9.3 },
    { nome: "Pagodeiro's", pontuacao: 8.9 },
  ]

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
        Ranking de Bares
      </h1>
      <ol className="list-decimal pl-5 space-y-2">
        {ranking.map((b, i) => (
          <li
            key={i}
            className="font-semibold flex justify-between items-center bg-white dark:bg-gray-800 px-4 py-2 rounded shadow"
          >
            <span>{b.nome}</span>
            <span className="text-blue-700 dark:text-blue-400">{b.pontuacao}</span>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
        Quer indicar um bar ou evento? <a href="/contato" className="underline text-blue-600 dark:text-blue-400">Fale com a gente</a>
      </p>
    </main>
  )
}
