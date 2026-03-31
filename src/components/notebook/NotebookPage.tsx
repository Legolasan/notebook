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
  const [showHelp, setShowHelp] = useState(false);

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
    <div className="h-full flex flex-col bg-[#fffef8] rounded-r-sm shadow-inner relative">
      {/* Help Toggle Button */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300
                   flex items-center justify-center text-stone-600 text-sm font-bold transition-colors"
        title="Markdown Help"
      >
        ?
      </button>

      {/* Markdown Help Sidebar */}
      {showHelp && (
        <div className="absolute top-14 right-4 z-20 w-56 bg-white rounded-lg shadow-lg border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-3 text-sm">Markdown Shortcuts</h3>
          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span className="font-mono bg-stone-100 px-1 rounded">Ctrl+B</span>
              <span>**Bold**</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono bg-stone-100 px-1 rounded">Ctrl+I</span>
              <span>*Italic*</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono bg-stone-100 px-1 rounded">Ctrl+K</span>
              <span>[Link](url)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono bg-stone-100 px-1 rounded">Ctrl+`</span>
              <span>`Code`</span>
            </div>
            <hr className="my-2 border-stone-200" />
            <p className="text-stone-500 font-medium">Markdown Syntax</p>
            <div className="space-y-1">
              <p><span className="font-mono"># </span>Heading 1</p>
              <p><span className="font-mono">## </span>Heading 2</p>
              <p><span className="font-mono">- </span>Bullet list</p>
              <p><span className="font-mono">1. </span>Numbered list</p>
              <p><span className="font-mono">~~text~~</span> Strikethrough</p>
              <p><span className="font-mono">&gt; </span>Quote</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header - Date */}
      <div className="px-8 pt-6 pb-4 border-b border-stone-200">
        <p className="text-sm text-stone-500 font-serif italic">
          {formatDate(page.date)}
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Page {page.pageNumber}
        </p>
      </div>

      {/* Content Area - Plain (no ruled lines) */}
      <div
        className="flex-1 px-8 py-6 overflow-auto cursor-text"
        onClick={() => !isEditing && setIsEditing(true)}
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
