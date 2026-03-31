'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Page, Summary } from '@/types';

interface SummarySidebarProps {
  page: Page;
  onSummarize: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export function SummarySidebar({ page, onSummarize, isOpen, onClose }: SummarySidebarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    setIsLoading(true);
    try {
      await onSummarize();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50
                    transform transition-transform duration-300 ease-out">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200">
        <h2 className="font-serif text-lg font-semibold text-stone-800">
          Page Summary
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-auto h-[calc(100%-120px)]">
        {page.summary?.bullets && page.summary.bullets.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-stone-500 uppercase tracking-wide font-medium">
              Key Points
            </p>
            <ul className="space-y-2">
              {page.summary.bullets.map((bullet, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-stone-700 leading-relaxed"
                >
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-stone-400 mt-4">
              Last updated: {new Date(page.summary.updatedAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 mx-auto text-stone-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-stone-500 text-sm">
              No summary yet
            </p>
            <p className="text-stone-400 text-xs mt-1">
              Click the button below to generate one
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-200 bg-stone-50">
        <Button
          onClick={handleSummarize}
          disabled={isLoading || !page.content}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Summarizing...
            </span>
          ) : page.summary ? (
            'Regenerate Summary'
          ) : (
            'Summarize Page'
          )}
        </Button>
      </div>
    </div>
  );
}
