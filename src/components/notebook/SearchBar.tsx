'use client';

import { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string, scope: 'all' | 'current') => void;
  currentNotebookId?: string;
}

export function SearchBar({ onSearch, currentNotebookId }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<'all' | 'current'>('all');

  const debouncedSearch = useDebounce((q: string) => {
    onSearch(q, scope);
  }, 300);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleScopeChange = useCallback((newScope: 'all' | 'current') => {
    setScope(newScope);
    if (query) {
      onSearch(query, newScope);
    }
  }, [query, onSearch]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-10 pr-4 py-2 bg-stone-100 border border-transparent
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500
                     focus:bg-white focus:border-stone-200 transition-all"
        />
      </div>

      {currentNotebookId && (
        <select
          value={scope}
          onChange={(e) => handleScopeChange(e.target.value as 'all' | 'current')}
          className="px-3 py-2 bg-stone-100 border border-transparent rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        >
          <option value="all">All notebooks</option>
          <option value="current">Current notebook</option>
        </select>
      )}
    </div>
  );
}
