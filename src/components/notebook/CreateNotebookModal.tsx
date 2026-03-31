'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, subject: string) => Promise<void>;
}

const subjects = [
  'Science',
  'Mathematics',
  'History',
  'English',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'Art',
  'Music',
  'Other',
];

export function CreateNotebookModal({ isOpen, onClose, onCreate }: CreateNotebookModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const finalSubject = subject === 'Other' ? customSubject : subject;

    try {
      await onCreate(title, finalSubject);
      setTitle('');
      setSubject('');
      setCustomSubject('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-serif font-semibold text-stone-800 mb-4">
          Create New Notebook
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Notebook Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My awesome notes..."
            required
          />

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {subject === 'Other' && (
            <Input
              label="Custom Subject"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title || (!subject || (subject === 'Other' && !customSubject))}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Notebook'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
