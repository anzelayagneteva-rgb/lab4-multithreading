import { useState, useCallback } from 'react';
import { Play, Loader2, RotateCcw } from 'lucide-react';
import ResultsTable from './ResultsTable';
import Chart from './Chart';

interface Result {
  threads: number;
  time: number;
  sum: number;
  speedup: number;
}

const ARRAY_SIZE = 10_000_000;

function generateArray(size: number): Float64Array {
  const arr = new Float64Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = Math.floor(Math.random() * 100) + 1;
  }
  return arr;
}

function singleThreadSum(arr: Float64Array): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function runWorkers(arr: Float64Array, numWorkers: number): Promise<number> {
  return new Promise((resolve) => {
    let completedWorkers = 0;
    let totalSum = 0;
    const chunkSize = Math.ceil(arr.length / numWorkers);
    const plainArray = Array.from(arr);

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker('/worker.js');
      const startIndex = i * chunkSize;
      const endIndex = Math.min(startIndex + chunkSize, arr.length);

      worker.onmessage = (e) => {
        totalSum += e.data.sum;
        completedWorkers++;
        worker.terminate();

        if (completedWorkers === numWorkers) {
          resolve(totalSum);
        }
      };

      worker.postMessage({
        array: plainArray,
        startIndex,
        endIndex,
        workerId: i,
      });
    }
  });
}

export default function Experiment() {
  const [results, setResults] = useState<Result[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState('');
  const [arraySize, setArraySize] = useState(ARRAY_SIZE);

  const runExperiment = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    const allResults: Result[] = [];

    setProgress('Генерация массива...');
    await new Promise((r) => setTimeout(r, 100));
    const arr = generateArray(arraySize);

    // 1 поток
    setProgress('Вычисление: 1 поток...');
    await new Promise((r) => setTimeout(r, 50));
    const t1Start = performance.now();
    const sum1 = singleThreadSum(arr);
    const t1 = performance.now() - t1Start;
    allResults.push({ threads: 1, time: t1, sum: sum1, speedup: 1 });
    setResults([...allResults]);

    // 2 потока
    setProgress('Вычисление: 2 потока (Web Workers)...');
    await new Promise((r) => setTimeout(r, 50));
    const t2Start = performance.now();
    const sum2 = await runWorkers(arr, 2);
    const t2 = performance.now() - t2Start;
    allResults.push({ threads: 2, time: t2, sum: sum2, speedup: t1 / t2 });
    setResults([...allResults]);

    // 4 потока
    setProgress('Вычисление: 4 потока (Web Workers)...');
    await new Promise((r) => setTimeout(r, 50));
    const t4Start = performance.now();
    const sum4 = await runWorkers(arr, 4);
    const t4 = performance.now() - t4Start;
    allResults.push({ threads: 4, time: t4, sum: sum4, speedup: t1 / t4 });
    setResults([...allResults]);

    setProgress('Готово!');
    setIsRunning(false);
  }, [arraySize]);

  const reset = () => {
    setResults([]);
    setProgress('');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Размер массива
          </label>
          <select
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isRunning}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:opacity-50"
          >
            <option value={1_000_000}>1 000 000</option>
            <option value={5_000_000}>5 000 000</option>
            <option value={10_000_000}>10 000 000</option>
            <option value={20_000_000}>20 000 000</option>
            <option value={50_000_000}>50 000 000</option>
          </select>
        </div>
        <button
          onClick={runExperiment}
          disabled={isRunning}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Выполняется...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Запустить эксперимент
            </>
          )}
        </button>
        {results.length > 0 && !isRunning && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </button>
        )}
      </div>

      {/* Progress */}
      {progress && (
        <div className={`text-sm px-4 py-2 rounded-lg inline-flex items-center gap-2 ${
          isRunning ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
        }`}>
          {isRunning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {progress}
        </div>
      )}

      {/* Results Table */}
      <ResultsTable results={results} isRunning={isRunning} />

      {/* Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">
          График зависимости времени выполнения от числа потоков
        </h4>
        <Chart data={results.map((r) => ({ threads: r.threads, time: r.time }))} />
      </div>

      {/* Note */}
      {results.length > 0 && !isRunning && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">💡 Примечание</p>
          <p>
            В браузере многопоточность реализована через <strong>Web Workers</strong>. 
            Передача данных между основным потоком и воркерами требует сериализации массива, 
            что добавляет накладные расходы. В нативных приложениях (C++/Python) потоки работают 
            с общей памятью, поэтому ускорение может быть более заметным. Также Python имеет 
            GIL (Global Interpreter Lock), который ограничивает параллельное выполнение потоков 
            для CPU-bound задач — для реального параллелизма в Python лучше использовать{' '}
            <code className="bg-blue-100 px-1 rounded">multiprocessing</code>.
          </p>
        </div>
      )}
    </div>
  );
}
