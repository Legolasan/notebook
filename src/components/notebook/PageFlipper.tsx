'use client';

import { useState, useCallback } from 'react';
import { NotebookPage } from './NotebookPage';
import type { Page } from '@/types';

interface PageFlipperProps {
  pages: Page[];
  currentIndex: number;
  onPageChange: (index: number) => void;
  onContentChange: (pageId: string, content: string) => void;
}

export function PageFlipper({
  pages,
  currentIndex,
  onPageChange,
  onContentChange,
}: PageFlipperProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const currentPage = pages[currentIndex];
  const canGoNext = currentIndex < pages.length - 1;
  const canGoPrev = currentIndex > 0;

  const flipPage = useCallback((direction: 'next' | 'prev') => {
    if (isFlipping) return;
    if (direction === 'next' && !canGoNext) return;
    if (direction === 'prev' && !canGoPrev) return;

    setIsEditing(false);
    setIsFlipping(true);
    setFlipDirection(direction);

    setTimeout(() => {
      onPageChange(direction === 'next' ? currentIndex + 1 : currentIndex - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  }, [isFlipping, canGoNext, canGoPrev, currentIndex, onPageChange]);

  const handleContentChange = useCallback((content: string) => {
    onContentChange(currentPage.id, content);
  }, [currentPage.id, onContentChange]);

  return (
    <div className="relative w-full h-full" style={{ perspective: '2000px' }}>
      {/* Book spine shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-stone-400 to-transparent z-10 rounded-l-md" />

      {/* Page container */}
      <div className="relative w-full h-full flex">
        {/* Left page (previous) - static */}
        <div className="w-1/2 h-full bg-[#f5f3eb] rounded-l-md shadow-inner overflow-hidden">
          {canGoPrev && pages[currentIndex - 1] && (
            <div className="h-full p-6 opacity-50">
              <p className="text-sm text-stone-500 font-serif">
                Page {pages[currentIndex - 1].pageNumber}
              </p>
            </div>
          )}
        </div>

        {/* Right page (current) - flipping */}
        <div
          className={`w-1/2 h-full origin-left transition-transform duration-500 ease-in-out
            ${isFlipping && flipDirection === 'next' ? 'animate-flip-next' : ''}
            ${isFlipping && flipDirection === 'prev' ? 'animate-flip-prev' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front of page */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <NotebookPage
              page={currentPage}
              onChange={handleContentChange}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </div>

          {/* Back of page (shown during flip) */}
          <div
            className="absolute inset-0 bg-[#f0ece0] rounded-r-sm"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => flipPage('prev')}
        disabled={!canGoPrev || isFlipping}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full
          bg-white/80 backdrop-blur shadow-lg flex items-center justify-center
          transition-all hover:bg-white hover:scale-110
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100`}
      >
        <svg className="w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => flipPage('next')}
        disabled={!canGoNext || isFlipping}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full
          bg-white/80 backdrop-blur shadow-lg flex items-center justify-center
          transition-all hover:bg-white hover:scale-110
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100`}
      >
        <svg className="w-6 h-6 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Page indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur
                      px-4 py-2 rounded-full shadow-lg text-sm text-stone-600">
        Page {currentIndex + 1} of {pages.length}
      </div>
    </div>
  );
}
