'use client';

import { useEffect, useState } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  installPrompt: PWAInstallPrompt | null;
}

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    installPrompt: null
  });

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setPWAState(prev => ({ ...prev, isInstalled: isStandalone || isIOSStandalone }));
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e as any
      }));
    };

    // Handle online/offline status
    const handleOnline = () => setPWAState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPWAState(prev => ({ ...prev, isOnline: false }));

    // Handle app installed
    const handleAppInstalled = () => {
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }));
    };

    // Initial checks
    checkInstalled();
    setPWAState(prev => ({ ...prev, isOnline: navigator.onLine }));

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!pwaState.installPrompt) return false;

    try {
      await pwaState.installPrompt.prompt();
      const choiceResult = await pwaState.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setPWAState(prev => ({
          ...prev,
          isInstallable: false,
          installPrompt: null
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  return {
    ...pwaState,
    installApp
  };
};

// Hook for offline storage and sync
export const useOfflineSync = () => {
  const [pendingSync, setPendingSync] = useState<string[]>([]);

  const addToSyncQueue = (data: any, type: 'assessment' | 'user-data') => {
    const id = Date.now().toString();
    
    // Store in localStorage for persistence
    const queueKey = `sync-queue-${type}`;
    const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
    existingQueue.push({ id, data, timestamp: Date.now() });
    localStorage.setItem(queueKey, JSON.stringify(existingQueue));
    
    setPendingSync(prev => [...prev, id]);

    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register(`${type}-submission`);
      }).catch(error => {
        console.error('Background sync registration failed:', error);
      });
    }

    return id;
  };

  const removeSyncItem = (id: string, type: 'assessment' | 'user-data') => {
    const queueKey = `sync-queue-${type}`;
    const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
    const updatedQueue = existingQueue.filter((item: any) => item.id !== id);
    localStorage.setItem(queueKey, JSON.stringify(updatedQueue));
    
    setPendingSync(prev => prev.filter(syncId => syncId !== id));
  };

  const getSyncQueue = (type: 'assessment' | 'user-data') => {
    const queueKey = `sync-queue-${type}`;
    return JSON.parse(localStorage.getItem(queueKey) || '[]');
  };

  return {
    pendingSync,
    addToSyncQueue,
    removeSyncItem,
    getSyncQueue
  };
};