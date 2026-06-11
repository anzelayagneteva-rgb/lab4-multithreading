import { List } from 'lucide-react';

const items = [
  { id: 'goal', label: 'Цель работы' },
  { id: 'equipment', label: 'Оборудование' },
  { id: 'theory', label: 'Теоретическая справка' },
  { id: 'code', label: 'Исходный код программы' },
  { id: 'experiment', label: 'Интерактивный эксперимент' },
  { id: 'sample-results', label: 'Типовые результаты' },
  { id: 'conclusions', label: 'Выводы' },
];

export default function TableOfContents() {
  return (
    <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <List className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">Содержание</h3>
      </div>
      <ol className="space-y-2">
        {items.map((item, idx) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="flex items-center gap-3 text-sm text-gray-600 hover:text-indigo-600 transition-colors group"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 group-hover:bg-indigo-100 text-gray-500 group-hover:text-indigo-600 flex items-center justify-center text-xs font-medium transition-colors">
                {idx + 1}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
