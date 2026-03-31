'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { NotebookCover } from '@/components/notebook/NotebookCover';
import { CreateNotebookModal } from '@/components/notebook/CreateNotebookModal';
import { SearchBar } from '@/components/notebook/SearchBar';
import { Button } from '@/components/ui/Button';
import type { NotebookWithPages } from '@/types';

export default function NotebooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<NotebookWithPages[]>([]);
  const [filteredNotebooks, setFilteredNotebooks] = useState<NotebookWithPages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchNotebooks();
    }
  }, [session]);

  const fetchNotebooks = async () => {
    try {
      const res = await fetch('/api/notebooks');
      const data = await res.json();
      setNotebooks(data);
      setFilteredNotebooks(data);
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotebook = async (title: string, subject: string) => {
    const res = await fetch('/api/notebooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject }),
    });

    if (res.ok) {
      const newNotebook = await res.json();
      setNotebooks((prev) => [newNotebook, ...prev]);
      setFilteredNotebooks((prev) => [newNotebook, ...prev]);
    }
  };

  const handleSearch = useCallback((query: string, scope: 'all' | 'current') => {
    if (!query.trim()) {
      setFilteredNotebooks(notebooks);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = notebooks.filter((notebook) => {
      const matchesTitle = notebook.title.toLowerCase().includes(lowercaseQuery);
      const matchesSubject = notebook.subject.toLowerCase().includes(lowercaseQuery);
      const matchesContent = notebook.pages?.some((page) =>
        page.content.toLowerCase().includes(lowercaseQuery)
      );

      return matchesTitle || matchesSubject || matchesContent;
    });

    setFilteredNotebooks(filtered);
  }, [notebooks]);

  const handleNotebookClick = (notebookId: string) => {
    router.push(`/notebooks/${notebookId}`);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50
                      flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-800">My Notebooks</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-stone-500">
              {session?.user?.name || session?.user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            + New Notebook
          </Button>
        </div>

        {/* Notebooks grid */}
        {filteredNotebooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredNotebooks.map((notebook) => (
              <NotebookCover
                key={notebook.id}
                notebook={notebook}
                onClick={() => handleNotebookClick(notebook.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20
                            bg-stone-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-semibold text-stone-700 mb-2">
              No notebooks yet
            </h2>
            <p className="text-stone-500 mb-6">
              Create your first notebook to start taking notes
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              Create Notebook
            </Button>
          </div>
        )}
      </main>

      {/* Create notebook modal */}
      <CreateNotebookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateNotebook}
      />
    </div>
  );
}
