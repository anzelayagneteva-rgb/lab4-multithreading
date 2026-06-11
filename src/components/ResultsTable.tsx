interface Result {
  threads: number;
  time: number;
  sum: number;
  speedup: number;
}

interface ResultsTableProps {
  results: Result[];
  isRunning: boolean;
}

export default function ResultsTable({ results, isRunning }: ResultsTableProps) {
  if (results.length === 0 && !isRunning) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Нажмите «Запустить эксперимент», чтобы получить результаты</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left font-semibold text-gray-600 rounded-tl-lg">
              Кол-во потоков
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Время (мс)
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Сумма
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600 rounded-tr-lg">
              Ускорение
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr
              key={r.threads}
              className={`border-t border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}
            >
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    r.threads === 1 ? 'bg-indigo-500' : 
                    r.threads === 2 ? 'bg-violet-500' : 'bg-purple-500'
                  }`} />
                  {r.threads} {r.threads === 1 ? 'поток' : r.threads < 5 ? 'потока' : 'потоков'}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-gray-800">
                {r.time.toFixed(2)} мс
              </td>
              <td className="px-4 py-3 font-mono text-gray-600 text-xs">
                {r.sum.toLocaleString('ru-RU')}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  r.speedup >= 1.5 ? 'bg-green-100 text-green-700' :
                  r.speedup >= 1.0 ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  ×{r.speedup.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
