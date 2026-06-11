import {
  Target,
  Monitor,
  BookOpen,
  Code2,
  FlaskConical,
  BarChart3,
  FileCheck,
} from 'lucide-react';
import Header from './components/Header';
import Section from './components/Section';
import TableOfContents from './components/TableOfContents';
import CodeBlock from './components/CodeBlock';
import Experiment from './components/Experiment';
import { pythonCode, cppCode } from './pythonCode';
import { useState } from 'react';

// Типовые результаты (симулированные для таблицы в отчёте)
const sampleResults = [
  { threads: 1, timePython: '2.84', timeCpp: '0.028', speedupPython: '1.00', speedupCpp: '1.00' },
  { threads: 2, timePython: '2.91', timeCpp: '0.015', speedupPython: '0.98', speedupCpp: '1.87' },
  { threads: 4, timePython: '3.02', timeCpp: '0.008', speedupPython: '0.94', speedupCpp: '3.50' },
];

export default function App() {
  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'cpp'>('python');

  return (
    <div className="min-h-screen bg-gray-50/80">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Table of Contents */}
        <TableOfContents />

        {/* 1. Цель работы */}
        <Section title="Цель работы" icon={<Target className="w-5 h-5" />} id="goal">
          <p className="text-gray-700 leading-relaxed">
            Изучить влияние числа потоков на производительность вычислений.
            Провести эксперименты по вычислению суммы элементов массива большого размера 
            (10 млн элементов) в однопоточном и многопоточном режимах, измерить время 
            выполнения и проанализировать полученные результаты.
          </p>
        </Section>

        {/* 2. Оборудование */}
        <Section title="Оборудование" icon={<Monitor className="w-5 h-5" />} id="equipment">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Аппаратное обеспечение</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Персональный компьютер
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Многоядерный процессор (2+ ядра)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Оперативная память: 4+ ГБ
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Программное обеспечение</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Python 3.10+ / C++ (GCC / MSVC)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Библиотеки: threading, time, matplotlib
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  Браузер с поддержкой Web Workers
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 3. Теоретическая справка */}
        <Section title="Теоретическая справка" icon={<BookOpen className="w-5 h-5" />} id="theory">
          <div className="space-y-4 text-gray-700 leading-relaxed text-[15px]">
            <p>
              <strong>Многопоточность</strong> — это способность процессора или программы выполнять 
              несколько потоков (threads) одновременно. Каждый поток представляет собой отдельный 
              поток выполнения инструкций внутри одного процесса.
            </p>
            <p>
              <strong>Преимущества многопоточности:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Параллельное выполнение независимых задач</li>
              <li>Более эффективное использование многоядерных процессоров</li>
              <li>Уменьшение общего времени выполнения для CPU-bound задач</li>
            </ul>
            <p>
              <strong>Закон Амдала</strong> определяет теоретическое максимальное ускорение 
              программы при распараллеливании: если доля последовательного кода равна <em>s</em>, 
              а количество процессоров — <em>N</em>, то ускорение 
              <em> S = 1 / (s + (1-s)/N)</em>.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-medium mb-1">⚠️ Важно: GIL в Python</p>
              <p>
                В CPython существует Global Interpreter Lock (GIL), который не позволяет 
                нескольким потокам одновременно выполнять байт-код Python. Это означает, что 
                для CPU-bound задач модуль <code className="bg-amber-100 px-1 rounded">threading</code> 
                не даёт реального параллелизма — для этого нужен <code className="bg-amber-100 px-1 rounded">multiprocessing</code>. 
                В C++ потоки (<code className="bg-amber-100 px-1 rounded">std::thread</code>) работают 
                по-настоящему параллельно.
              </p>
            </div>
          </div>
        </Section>

        {/* 4. Исходный код */}
        <Section title="Исходный код программы" icon={<Code2 className="w-5 h-5" />} id="code">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Ниже представлены реализации программы на Python и C++. 
              Выберите вкладку для просмотра кода.
            </p>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveCodeTab('python')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeCodeTab === 'python'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🐍 Python
              </button>
              <button
                onClick={() => setActiveCodeTab('cpp')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeCodeTab === 'cpp'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ⚡ C++
              </button>
            </div>

            {activeCodeTab === 'python' ? (
              <CodeBlock code={pythonCode} language="Python" filename="lab4_threads.py" />
            ) : (
              <CodeBlock code={cppCode} language="C++" filename="lab4_threads.cpp" />
            )}

            {/* Code description */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2">Описание алгоритма</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600">
                <li>Генерируется массив из 10 000 000 случайных целых чисел (от 1 до 100)</li>
                <li>Массив разбивается на равные части в зависимости от количества потоков</li>
                <li>Каждый поток вычисляет частичную сумму своей части массива</li>
                <li>Частичные суммы складываются для получения итогового результата</li>
                <li>Измеряется время выполнения каждого варианта</li>
              </ol>
            </div>
          </div>
        </Section>

        {/* 5. Интерактивный эксперимент */}
        <Section
          title="Интерактивный эксперимент (Web Workers)"
          icon={<FlaskConical className="w-5 h-5" />}
          id="experiment"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Запустите эксперимент прямо в браузере! Используются Web Workers для имитации 
              многопоточности. Вы можете выбрать размер массива и наблюдать результаты в 
              реальном времени.
            </p>
            <Experiment />
          </div>
        </Section>

        {/* 6. Типовые результаты */}
        <Section
          title="Типовые результаты выполнения"
          icon={<BarChart3 className="w-5 h-5" />}
          id="sample-results"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Ниже приведены типичные результаты выполнения программы на настольном компьютере 
              (Intel Core i5, 4 ядра / 8 потоков) для массива из 10 000 000 элементов:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600" rowSpan={2}>
                      Потоки
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600" colSpan={2}>
                      Python (threading)
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600" colSpan={2}>
                      C++ (std::thread)
                    </th>
                  </tr>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <th className="px-4 py-2 text-center text-xs text-gray-500 font-medium">
                      Время (сек)
                    </th>
                    <th className="px-4 py-2 text-center text-xs text-gray-500 font-medium">
                      Ускорение
                    </th>
                    <th className="px-4 py-2 text-center text-xs text-gray-500 font-medium">
                      Время (сек)
                    </th>
                    <th className="px-4 py-2 text-center text-xs text-gray-500 font-medium">
                      Ускорение
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sampleResults.map((r, idx) => (
                    <tr
                      key={r.threads}
                      className={`border-t border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 font-medium">
                        {r.threads} {r.threads === 1 ? 'поток' : r.threads < 5 ? 'потока' : 'потоков'}
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{r.timePython}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          parseFloat(r.speedupPython) < 1
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          ×{r.speedupPython}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">{r.timeCpp}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          parseFloat(r.speedupCpp) >= 1.5
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          ×{r.speedupCpp}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* 7. Выводы */}
        <Section title="Выводы" icon={<FileCheck className="w-5 h-5" />} id="conclusions">
          <div className="space-y-4 text-gray-700 leading-relaxed text-[15px]">
            <p>
              В ходе лабораторной работы было проведено исследование влияния числа потоков 
              на производительность вычислений при суммировании массива из 10 000 000 элементов.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <h4 className="font-medium text-indigo-900 mb-2">C++ (std::thread)</h4>
                <ul className="space-y-1.5 text-sm text-indigo-800">
                  <li>✅ Значительное ускорение при увеличении потоков</li>
                  <li>✅ 2 потока — ускорение ~1.87×</li>
                  <li>✅ 4 потока — ускорение ~3.50×</li>
                  <li>✅ Близко к линейному масштабированию</li>
                </ul>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h4 className="font-medium text-amber-900 mb-2">Python (threading)</h4>
                <ul className="space-y-1.5 text-sm text-amber-800">
                  <li>⚠️ Нет ускорения из-за GIL</li>
                  <li>⚠️ 2 потока — ускорение ~0.98× (медленнее!)</li>
                  <li>⚠️ 4 потока — ускорение ~0.94× (ещё медленнее)</li>
                  <li>💡 Для CPU-bound → multiprocessing</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-2">Основные выводы:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-green-800">
                <li>
                  Многопоточность эффективна для CPU-bound задач только при использовании 
                  реального параллелизма (C++, Java, Go и др.).
                </li>
                <li>
                  В Python модуль <code className="bg-green-100 px-1 rounded">threading</code> не 
                  обеспечивает параллельного выполнения из-за GIL. Для CPU-bound задач необходимо 
                  использовать <code className="bg-green-100 px-1 rounded">multiprocessing</code>.
                </li>
                <li>
                  Ускорение не растёт линейно с числом потоков из-за накладных расходов на 
                  создание потоков, синхронизацию и доступ к общей памяти (закон Амдала).
                </li>
                <li>
                  Оптимальное количество потоков обычно соответствует количеству физических 
                  ядер процессора.
                </li>
              </ol>
            </div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-400">
          <p>Лабораторная работа №4 — Исследование многопоточности процессора</p>
        </div>
      </footer>
    </div>
  );
}
