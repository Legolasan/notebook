'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PageFlipper } from '@/components/notebook/PageFlipper';
import { SummarySidebar } from '@/components/notebook/SummarySidebar';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { useNotebookStore } from '@/stores/notebook-store';
import type { NotebookWithPages } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotebookViewPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notebook, setNotebook] = useState<NotebookWithPages | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { addPendingChange } = useNotebookStore();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && id) {
      fetchNotebook();
    }
  }, [session, id]);

  const fetchNotebook = async () => {
    try {
      const res = await fetch(`/api/notebooks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setNotebook(data);
      } else {
        router.push('/notebooks');
      }
    } catch (error) {
      console.error('Error fetching notebook:', error);
      router.push('/notebooks');
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = useCallback(async (pageId: string, content: string) => {
    setIsSaving(true);
    try {
      if (navigator.onLine) {
        await fetch(`/api/pages/${pageId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
      } else {
        addPendingChange(pageId, { content });
      }
    } catch (error) {
      console.error('Error saving:', error);
      addPendingChange(pageId, { content });
    } finally {
      setIsSaving(false);
    }
  }, [addPendingChange]);

  const debouncedSave = useDebounce(saveContent, 1000);

  const handleContentChange = useCallback((pageId: string, content: string) => {
    if (!notebook) return;

    // Update local state immediately
    setNotebook({
      ...notebook,
      pages: notebook.pages.map((page) =>
        page.id === pageId ? { ...page, content } : page
      ),
    });

    // Debounced save
    debouncedSave(pageId, content);
  }, [notebook, debouncedSave]);

  const handleSummarize = async () => {
    if (!notebook) return;

    const currentPage = notebook.pages[currentPageIndex];

    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageId: currentPage.id,
        content: currentPage.content,
      }),
    });

    if (res.ok) {
      const summary = await res.json();
      setNotebook({
        ...notebook,
        pages: notebook.pages.map((page) =>
          page.id === currentPage.id ? { ...page, summary } : page
        ),
      });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50
                      flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!notebook) {
    return null;
  }

  const currentPage = notebook.pages[currentPageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-200 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/notebooks')}>
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>
            <div>
              <h1 className="font-serif font-semibold text-stone-800">{notebook.title}</h1>
              <p className="text-xs text-stone-500">{notebook.subject}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Saving...
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Summary
            </Button>
          </div>
        </div>
      </header>

      {/* Notebook view */}
      <main className="flex items-center justify-center p-8" style={{ height: 'calc(100vh - 60px)' }}>
        <div
          className="w-full max-w-5xl bg-[#f0ece0] rounded-lg shadow-2xl overflow-hidden"
          style={{ height: '80vh' }}
        >
          <PageFlipper
            pages={notebook.pages}
            currentIndex={currentPageIndex}
            onPageChange={setCurrentPageIndex}
            onContentChange={handleContentChange}
          />
        </div>
      </main>

      {/* Summary sidebar */}
      <SummarySidebar
        page={currentPage}
        onSummarize={handleSummarize}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
