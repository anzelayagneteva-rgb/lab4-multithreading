import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  id?: string;
}

export default function Section({ title, icon, children, id }: SectionProps) {
  return (
    <section id={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        {icon && (
          <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-6 py-5">
        {children}
      </div>
    </section>
  );
}
