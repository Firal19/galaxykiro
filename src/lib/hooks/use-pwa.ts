'use client';

import { useEffect, useState, useCallback } from 'react';

interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  installPrompt: PWAInstallPrompt | null;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
  cacheStatus: {
    toolsCached: boolean;
    contentCached: boolean;
    imagesCached: number;
  };
}

// Cache names used in service worker
const CACHE_NAMES = {
  STATIC: 'static-v2',
  DYNAMIC: 'dynamic-v2',
  TOOL: 'tools-v1',
  IMAGE: 'images-v1'
};

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    installPrompt: null,
    serviceWorkerRegistration: null,
    cacheStatus: {
      toolsCached: false,
      contentCached: false,
      imagesCached: 0
    }
  });

  // Check cache status to inform user about offline availability
  const checkCacheStatus = useCallback(async () => {
    if (!('caches' in window)) return;
    
    try {
      // Check tool cache
      const toolCache = await caches.open(CACHE_NAMES.TOOL);
      const toolKeys = await toolCache.keys();
      const toolsCached = toolKeys.length > 0;
      
      // Check content cache
      const dynamicCache = await caches.open(CACHE_NAMES.DYNAMIC);
      const contentKeys = await dynamicCache.keys();
      const contentCached = contentKeys.length > 0;
      
      // Check image cache
      const imageCache = await caches.open(CACHE_NAMES.IMAGE);
      const imageKeys = await imageCache.keys();
      
      setPWAState(prev => ({
        ...prev,
        cacheStatus: {
          toolsCached,
          contentCached,
          imagesCached: imageKeys.length
        }
      }));
    } catch (error) {
      console.error('Error checking cache status:', error);
    }
  }, []);

  // Pre-cache essential tools for offline use
  const preCacheTools = useCallback(async () => {
    if (!('caches' in window) || !navigator.onLine) return false;
    
    try {
      const toolUrls = [
        '/api/tools/potential-quotient-calculator',
        '/api/tools/success-factor-calculator',
        '/api/tools/habit-strength-analyzer',
        '/api/tools/leadership-style-identifier'
      ];
      
      const cache = await caches.open(CACHE_NAMES.TOOL);
      await Promise.all(toolUrls.map(url => 
        fetch(url).then(response => {
          if (response.ok) {
            return cache.put(url, response);
          }
          throw new Error(`Failed to fetch ${url}`);
        })
      ));
      
      await checkCacheStatus();
      return true;
    } catch (error) {
      console.error('Error pre-caching tools:', error);
      return false;
    }
  }, [checkCacheStatus]);

  // Register and track service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null;
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      setPWAState(prev => ({
        ...prev,
        serviceWorkerRegistration: registration
      }));
      
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  }, []);

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
    const handleOnline = () => {
      setPWAState(prev => ({ ...prev, isOnline: true }));
      // When coming back online, check cache status
      checkCacheStatus();
    };
    
    const handleOffline = () => {
      setPWAState(prev => ({ ...prev, isOnline: false }));
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }));
      
      // Pre-cache tools when app is installed
      preCacheTools();
    };

    // Initial checks
    checkInstalled();
    setPWAState(prev => ({ ...prev, isOnline: navigator.onLine }));
    
    // Register service worker
    registerServiceWorker();
    
    // Check cache status
    checkCacheStatus();

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
  }, [checkCacheStatus, preCacheTools, registerServiceWorker]);

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
        
        // Pre-cache tools when app is installed
        await preCacheTools();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  };

  // Force update service worker
  const updateServiceWorker = async () => {
    if (!pwaState.serviceWorkerRegistration) return false;
    
    try {
      await pwaState.serviceWorkerRegistration.update();
      return true;
    } catch (error) {
      console.error('Error updating service worker:', error);
      return false;
    }
  };

  // Pre-cache specific content for offline use
  const preCacheContent = async (urls: string[]) => {
    if (!('caches' in window) || !navigator.onLine) return false;
    
    try {
      const cache = await caches.open(CACHE_NAMES.DYNAMIC);
      await Promise.all(urls.map(url => 
        fetch(url).then(response => {
          if (response.ok) {
            return cache.put(url, response);
          }
          throw new Error(`Failed to fetch ${url}`);
        })
      ));
      
      await checkCacheStatus();
      return true;
    } catch (error) {
      console.error('Error pre-caching content:', error);
      return false;
    }
  };

  return {
    ...pwaState,
    installApp,
    updateServiceWorker,
    preCacheTools,
    preCacheContent,
    checkCacheStatus
  };
};

// Hook for offline storage and sync with IndexedDB support
export const useOfflineSync = () => {
  const [pendingSync, setPendingSync] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed' | 'failed'>('idle');
  const [offlineData, setOfflineData] = useState<{
    assessments: number;
    userInteractions: number;
    contentViews: number;
  }>({
    assessments: 0,
    userInteractions: 0,
    contentViews: 0
  });

  // Initialize IndexedDB for more robust offline storage
  useEffect(() => {
    const initIndexedDB = async () => {
      if (!('indexedDB' in window)) {
        console.warn('IndexedDB not supported, falling back to localStorage');
        return;
      }

      try {
        const request = indexedDB.open('GalaxyDreamTeamOfflineDB', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Create object stores for different types of offline data
          if (!db.objectStoreNames.contains('assessments')) {
            db.createObjectStore('assessments', { keyPath: 'id' });
          }
          
          if (!db.objectStoreNames.contains('userInteractions')) {
            db.createObjectStore('userInteractions', { keyPath: 'id' });
          }
          
          if (!db.objectStoreNames.contains('contentViews')) {
            db.createObjectStore('contentViews', { keyPath: 'id' });
          }
        };
        
        request.onsuccess = () => {
          console.log('IndexedDB initialized successfully');
          updateOfflineDataCounts();
        };
        
        request.onerror = (event) => {
          console.error('IndexedDB initialization error:', (event.target as IDBOpenDBRequest).error);
        };
      } catch (error) {
        console.error('Error setting up IndexedDB:', error);
      }
    };
    
    initIndexedDB();
    
    // Listen for sync events from service worker
    const handleSyncMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'sync-status') {
        setSyncStatus(event.data.status);
        if (event.data.status === 'completed') {
          updateOfflineDataCounts();
        }
      }
    };
    
    navigator.serviceWorker.addEventListener('message', handleSyncMessage);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSyncMessage);
    };
  }, []);

  // Update counts of offline data
  const updateOfflineDataCounts = async () => {
    if (!('indexedDB' in window)) {
      // Fallback to localStorage
      const assessments = JSON.parse(localStorage.getItem('sync-queue-assessment') || '[]').length;
      const userInteractions = JSON.parse(localStorage.getItem('sync-queue-user-data') || '[]').length;
      const contentViews = JSON.parse(localStorage.getItem('sync-queue-content-view') || '[]').length;
      
      setOfflineData({
        assessments,
        userInteractions,
        contentViews
      });
      
      setPendingSync([
        ...JSON.parse(localStorage.getItem('sync-queue-assessment') || '[]').map((item: any) => item.id),
        ...JSON.parse(localStorage.getItem('sync-queue-user-data') || '[]').map((item: any) => item.id),
        ...JSON.parse(localStorage.getItem('sync-queue-content-view') || '[]').map((item: any) => item.id)
      ]);
      
      return;
    }
    
    try {
      const db = await openDB();
      
      // Get counts from each object store
      const assessments = await getStoreCount(db, 'assessments');
      const userInteractions = await getStoreCount(db, 'userInteractions');
      const contentViews = await getStoreCount(db, 'contentViews');
      
      setOfflineData({
        assessments,
        userInteractions,
        contentViews
      });
      
      // Update pending sync IDs
      const assessmentIds = await getAllKeys(db, 'assessments');
      const userInteractionIds = await getAllKeys(db, 'userInteractions');
      const contentViewIds = await getAllKeys(db, 'contentViews');
      
      setPendingSync([
        ...assessmentIds,
        ...userInteractionIds,
        ...contentViewIds
      ]);
      
      db.close();
    } catch (error) {
      console.error('Error updating offline data counts:', error);
    }
  };

  // Helper function to open IndexedDB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GalaxyDreamTeamOfflineDB', 1);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  // Helper function to get count from object store
  const getStoreCount = (db: IDBDatabase, storeName: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        resolve(countRequest.result);
      };
      
      countRequest.onerror = () => {
        reject(countRequest.error);
      };
    });
  };

  // Helper function to get all keys from object store
  const getAllKeys = (db: IDBDatabase, storeName: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const keysRequest = store.getAllKeys();
      
      keysRequest.onsuccess = () => {
        resolve(keysRequest.result as string[]);
      };
      
      keysRequest.onerror = () => {
        reject(keysRequest.error);
      };
    });
  };

  // Add data to sync queue using IndexedDB when available
  const addToSyncQueue = async (data: any, type: 'assessment' | 'user-data' | 'content-view') => {
    const id = Date.now().toString();
    const item = { id, data, timestamp: Date.now() };
    
    // Try to use IndexedDB first
    if ('indexedDB' in window) {
      try {
        const db = await openDB();
        const storeName = type === 'assessment' ? 'assessments' : 
                         type === 'user-data' ? 'userInteractions' : 'contentViews';
        
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const addRequest = store.add(item);
        
        await new Promise<void>((resolve, reject) => {
          addRequest.onsuccess = () => resolve();
          addRequest.onerror = () => reject(addRequest.error);
        });
        
        db.close();
      } catch (error) {
        console.error('Error adding to IndexedDB, falling back to localStorage:', error);
        // Fallback to localStorage
        const queueKey = `sync-queue-${type}`;
        const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
        existingQueue.push(item);
        localStorage.setItem(queueKey, JSON.stringify(existingQueue));
      }
    } else {
      // Use localStorage if IndexedDB is not available
      const queueKey = `sync-queue-${type}`;
      const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
      existingQueue.push(item);
      localStorage.setItem(queueKey, JSON.stringify(existingQueue));
    }
    
    // Update UI state
    setPendingSync(prev => [...prev, id]);
    setOfflineData(prev => {
      if (type === 'assessment') {
        return { ...prev, assessments: prev.assessments + 1 };
      } else if (type === 'user-data') {
        return { ...prev, userInteractions: prev.userInteractions + 1 };
      } else {
        return { ...prev, contentViews: prev.contentViews + 1 };
      }
    });

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

  // Remove item from sync queue
  const removeSyncItem = async (id: string, type: 'assessment' | 'user-data' | 'content-view') => {
    // Try to use IndexedDB first
    if ('indexedDB' in window) {
      try {
        const db = await openDB();
        const storeName = type === 'assessment' ? 'assessments' : 
                         type === 'user-data' ? 'userInteractions' : 'contentViews';
        
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const deleteRequest = store.delete(id);
        
        await new Promise<void>((resolve, reject) => {
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(deleteRequest.error);
        });
        
        db.close();
      } catch (error) {
        console.error('Error removing from IndexedDB, falling back to localStorage:', error);
        // Fallback to localStorage
        const queueKey = `sync-queue-${type}`;
        const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
        const updatedQueue = existingQueue.filter((item: any) => item.id !== id);
        localStorage.setItem(queueKey, JSON.stringify(updatedQueue));
      }
    } else {
      // Use localStorage if IndexedDB is not available
      const queueKey = `sync-queue-${type}`;
      const existingQueue = JSON.parse(localStorage.getItem(queueKey) || '[]');
      const updatedQueue = existingQueue.filter((item: any) => item.id !== id);
      localStorage.setItem(queueKey, JSON.stringify(updatedQueue));
    }
    
    // Update UI state
    setPendingSync(prev => prev.filter(syncId => syncId !== id));
    updateOfflineDataCounts();
  };

  // Get sync queue data
  const getSyncQueue = async (type: 'assessment' | 'user-data' | 'content-view') => {
    // Try to use IndexedDB first
    if ('indexedDB' in window) {
      try {
        const db = await openDB();
        const storeName = type === 'assessment' ? 'assessments' : 
                         type === 'user-data' ? 'userInteractions' : 'contentViews';
        
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        
        const getAllRequest = store.getAll();
        
        const result = await new Promise<any[]>((resolve, reject) => {
          getAllRequest.onsuccess = () => resolve(getAllRequest.result);
          getAllRequest.onerror = () => reject(getAllRequest.error);
        });
        
        db.close();
        return result;
      } catch (error) {
        console.error('Error getting from IndexedDB, falling back to localStorage:', error);
        // Fallback to localStorage
        const queueKey = `sync-queue-${type}`;
        return JSON.parse(localStorage.getItem(queueKey) || '[]');
      }
    } else {
      // Use localStorage if IndexedDB is not available
      const queueKey = `sync-queue-${type}`;
      return JSON.parse(localStorage.getItem(queueKey) || '[]');
    }
  };

  // Force sync all pending data
  const forceSyncAll = async () => {
    if (!navigator.onLine) {
      return { success: false, message: 'You are offline. Please connect to the internet and try again.' };
    }
    
    setSyncStatus('syncing');
    
    try {
      // Get all pending data
      const assessments = await getSyncQueue('assessment');
      const userInteractions = await getSyncQueue('user-data');
      const contentViews = await getSyncQueue('content-view');
      
      // Sync assessments
      for (const assessment of assessments) {
        try {
          const response = await fetch('/.netlify/functions/process-assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessment.data)
          });
          
          if (response.ok) {
            await removeSyncItem(assessment.id, 'assessment');
          }
        } catch (error) {
          console.error('Error syncing assessment:', error);
        }
      }
      
      // Sync user interactions
      for (const interaction of userInteractions) {
        try {
          const response = await fetch('/.netlify/functions/track-user-journey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(interaction.data)
          });
          
          if (response.ok) {
            await removeSyncItem(interaction.id, 'user-data');
          }
        } catch (error) {
          console.error('Error syncing user interaction:', error);
        }
      }
      
      // Sync content views
      for (const contentView of contentViews) {
        try {
          const response = await fetch('/.netlify/functions/track-interaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contentView.data)
          });
          
          if (response.ok) {
            await removeSyncItem(contentView.id, 'content-view');
          }
        } catch (error) {
          console.error('Error syncing content view:', error);
        }
      }
      
      setSyncStatus('completed');
      updateOfflineDataCounts();
      
      return { 
        success: true, 
        message: 'Sync completed successfully',
        syncedItems: assessments.length + userInteractions.length + contentViews.length
      };
    } catch (error) {
      console.error('Error during force sync:', error);
      setSyncStatus('failed');
      return { success: false, message: 'Sync failed. Please try again.' };
    }
  };

  return {
    pendingSync,
    syncStatus,
    offlineData,
    addToSyncQueue,
    removeSyncItem,
    getSyncQueue,
    forceSyncAll,
    updateOfflineDataCounts
  };
};