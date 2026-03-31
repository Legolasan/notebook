'use client';

import type { Notebook } from '@/types';

interface NotebookCoverProps {
  notebook: Notebook;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

const subjectColors: Record<string, string> = {
  'tech training': 'from-blue-600 to-blue-800',
  'ai/llm': 'from-violet-600 to-violet-800',
  'coding': 'from-emerald-600 to-emerald-800',
  'general computer science': 'from-cyan-600 to-cyan-800',
  'good to know': 'from-amber-600 to-amber-800',
  'basics': 'from-teal-600 to-teal-800',
  'interesting notes': 'from-rose-600 to-rose-800',
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

export function NotebookCover({ notebook, onClick, onDelete }: NotebookCoverProps) {
  const gradientColor = getColorForSubject(notebook.subject);
  const hasCoverImage = !!notebook.coverImage;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm(`Delete "${notebook.title}"? This cannot be undone.`)) {
      onDelete(notebook.id);
    }
  };

  return (
    <div className="relative group">
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 z-30 w-7 h-7 rounded-full bg-red-500 text-white
                     flex items-center justify-center opacity-0 group-hover:opacity-100
                     transition-opacity duration-200 hover:bg-red-600 shadow-lg"
          title="Delete notebook"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <button
        onClick={onClick}
        className={`relative w-48 h-64 rounded-r-lg rounded-l-sm shadow-xl
                    ${!hasCoverImage ? `bg-gradient-to-br ${gradientColor}` : ''}
                    transform transition-all duration-300
                    hover:scale-105 hover:shadow-2xl hover:-translate-y-1
                    focus:outline-none focus:ring-4 focus:ring-amber-400
                    overflow-hidden`}
      >
        {/* Cover Image */}
        {hasCoverImage && (
          <>
            <img
              src={notebook.coverImage!}
              alt={notebook.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          </>
        )}

        {/* Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/30 rounded-l-sm z-10" />

        {/* Cover content */}
        <div className="absolute inset-0 p-6 pl-8 flex flex-col items-center justify-center z-10">
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
        <div className="absolute right-0 top-2 bottom-2 w-1 flex flex-col gap-px z-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-1 bg-white/40 rounded-r-sm" />
          ))}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10
                        transition-colors duration-300 rounded-r-lg rounded-l-sm z-10" />
      </button>
    </div>
  );
}
