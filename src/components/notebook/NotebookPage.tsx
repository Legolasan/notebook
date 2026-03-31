'use client';

import { useState, useEffect } from 'react';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { MarkdownPreview } from '@/components/editor/MarkdownPreview';
import { getRandomQuote } from '@/lib/quotes';
import type { Page } from '@/types';

interface NotebookPageProps {
  page: Page;
  onChange: (content: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export function NotebookPage({ page, onChange, isEditing, setIsEditing }: NotebookPageProps) {
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    setQuote(getRandomQuote());
  }, [page.id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="h-full flex flex-col bg-[#fffef8] rounded-r-sm shadow-inner">
      {/* Page Header - Date */}
      <div className="px-8 pt-6 pb-4 border-b border-stone-200">
        <p className="text-sm text-stone-500 font-serif italic">
          {formatDate(page.date)}
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Page {page.pageNumber}
        </p>
      </div>

      {/* Content Area */}
      <div
        className="flex-1 px-8 py-6 overflow-auto cursor-text"
        onClick={() => !isEditing && setIsEditing(true)}
        style={{
          backgroundImage: 'linear-gradient(transparent 1.7rem, #e8e8e8 1.7rem)',
          backgroundSize: '100% 1.8rem',
        }}
      >
        {isEditing ? (
          <MarkdownEditor
            value={page.content}
            onChange={onChange}
            placeholder="Start writing..."
          />
        ) : (
          <div className="min-h-[200px]">
            {page.content ? (
              <MarkdownPreview content={page.content} />
            ) : (
              <p className="text-stone-400 italic">Click to start writing...</p>
            )}
          </div>
        )}
      </div>

      {/* Page Footer - Quote */}
      <div className="px-8 py-4 border-t border-stone-200 bg-stone-50/50">
        <p className="text-xs text-stone-500 italic text-center">
          &ldquo;{quote.text}&rdquo;
        </p>
        {quote.author && (
          <p className="text-xs text-stone-400 text-center mt-1">
            — {quote.author}
          </p>
        )}
      </div>
    </div>
  );
}
