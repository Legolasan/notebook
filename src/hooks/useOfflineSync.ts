'use client';

import { useEffect, useCallback } from 'react';
import { useNotebookStore } from '@/stores/notebook-store';

export function useOfflineSync() {
  const { pendingChanges, clearPendingChanges, setSyncing } = useNotebookStore();

  const syncChanges = useCallback(async () => {
    if (pendingChanges.size === 0) return;

    setSyncing(true);

    try {
      const entries = Array.from(pendingChanges.entries());

      await Promise.all(
        entries.map(async ([pageId, changes]) => {
          await fetch(`/api/pages/${pageId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(changes),
          });
        })
      );

      clearPendingChanges();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  }, [pendingChanges, clearPendingChanges, setSyncing]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online, syncing changes...');
      syncChanges();
    };

    window.addEventListener('online', handleOnline);

    // Also sync on mount if online
    if (navigator.onLine && pendingChanges.size > 0) {
      syncChanges();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, [syncChanges, pendingChanges.size]);

  return { syncChanges };
}
