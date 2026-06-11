import { Cpu, GitBranch } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
            <GitBranch className="w-7 h-7" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Лабораторная работа №4
        </h1>
        <h2 className="text-xl md:text-2xl font-light text-white/90">
          Исследование многопоточности процессора
        </h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
            Python / C++
          </span>
          <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
            Web Workers
          </span>
          <span className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
            Многопоточность
          </span>
        </div>
      </div>
    </header>
  );
}
