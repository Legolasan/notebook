'use client';

import type { Notebook } from '@/types';

interface NotebookCoverProps {
  notebook: Notebook;
  onClick: () => void;
}

const subjectColors: Record<string, string> = {
  science: 'from-emerald-600 to-emerald-800',
  mathematics: 'from-blue-600 to-blue-800',
  history: 'from-amber-600 to-amber-800',
  english: 'from-rose-600 to-rose-800',
  geography: 'from-teal-600 to-teal-800',
  physics: 'from-violet-600 to-violet-800',
  chemistry: 'from-orange-600 to-orange-800',
  biology: 'from-green-600 to-green-800',
  literature: 'from-pink-600 to-pink-800',
  art: 'from-purple-600 to-purple-800',
  music: 'from-indigo-600 to-indigo-800',
  default: 'from-stone-600 to-stone-800',
};

function getColorForSubject(subject: string): string {
  const normalizedSubject = subject.toLowerCase().trim();
  for (const [key, value] of Object.entries(subjectColors)) {
    if (normalizedSubject.includes(key)) {
      return value;
    }
  }
  return subjectColors.default;
}

export function NotebookCover({ notebook, onClick }: NotebookCoverProps) {
  const gradientColor = getColorForSubject(notebook.subject);

  return (
    <button
      onClick={onClick}
      className={`group relative w-48 h-64 rounded-r-lg rounded-l-sm shadow-xl
                  bg-gradient-to-br ${gradientColor}
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-2xl hover:-translate-y-1
                  focus:outline-none focus:ring-4 focus:ring-amber-400`}
    >
      {/* Spine */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20 rounded-l-sm" />

      {/* Cover content */}
      <div className="absolute inset-0 p-6 pl-8 flex flex-col items-center justify-center">
        {/* Subject label */}
        <div className="bg-white/90 px-4 py-1 rounded-sm mb-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            {notebook.subject}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-serif text-lg text-center font-semibold
                       drop-shadow-lg line-clamp-3">
          {notebook.title}
        </h3>
      </div>

      {/* Page edges effect */}
      <div className="absolute right-0 top-2 bottom-2 w-1 flex flex-col gap-px">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1 bg-white/40 rounded-r-sm" />
        ))}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10
                      transition-colors duration-300 rounded-r-lg rounded-l-sm" />
    </button>
  );
}
