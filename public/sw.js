// Progressive Web App Service Worker
// Provides offline functionality and caching for the engagement platform

const CACHE_NAME = 'galaxy-dream-team-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const TOOL_CACHE = 'tools-v1';
const IMAGE_CACHE = 'images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html',
  // Add critical CSS and JS files
  '/_next/static/css/',
  '/_next/static/js/',
];

// Routes to cache dynamically
const CACHEABLE_ROUTES = [
  '/',
  '/content-library',
  '/webinars',
  '/auth/signin',
  '/auth/register',
  '/membership/dashboard',
  '/success-gap',
  '/change-paradox',
  '/vision-void',
  '/leadership-lever',
  '/decision-door'
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/webinars',
  '/api/content',
  '/api/office-locations',
  '/.netlify/functions/process-assessment'
];

// Assessment tools to cache for offline use (only include existing ones)
const CACHEABLE_TOOLS = [
  // Only include tools that actually exist
  '/tools/potential-quotient-calculator',
  '/tools/habit-strength-analyzer',
  '/tools/leadership-style-profiler',
  '/tools/transformation-readiness-score'
];

// Install event - cache static assets and tools
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('Service Worker: Caching static assets');
          return cache.addAll(STATIC_ASSETS.filter(asset => 
            !asset.includes('_next/static/') || asset.endsWith('/')
          ));
        }),
      
      // Pre-cache tool templates and data (with error handling)
      caches.open(TOOL_CACHE)
        .then((cache) => {
          console.log('Service Worker: Caching assessment tools');
          return Promise.allSettled(
            CACHEABLE_TOOLS.map(url => 
              cache.add(url).catch(error => {
                console.warn(`Service Worker: Failed to cache ${url}:`, error);
                return null;
              })
            )
          );
        })
    ])
    .then(() => {
      console.log('Service Worker: Assets cached');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Service Worker: Failed to cache assets', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, TOOL_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network with specialized handling
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isImageAsset(request.url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (isToolRequest(request.url)) {
    event.respondWith(toolCacheStrategy(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (isCacheableRoute(request.url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache strategies
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

async function networkFirst(request, cacheName = DYNAMIC_CACHE) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || caches.match('/') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName = DYNAMIC_CACHE) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  return cachedResponse || await networkResponsePromise || 
    new Response('Content not available', { status: 503 });
}

// Special strategy for assessment tools to ensure offline functionality
async function toolCacheStrategy(request) {
  try {
    // Check tool cache first
    const toolCache = await caches.open(TOOL_CACHE);
    const cachedResponse = await toolCache.match(request);
    
    if (cachedResponse) {
      // If we have a cached version, use it but update in background
      fetch(request)
        .then(networkResponse => {
          if (networkResponse.ok) {
            toolCache.put(request, networkResponse);
          }
        })
        .catch(err => console.log('Background tool update failed:', err));
      
      return cachedResponse;
    }
    
    // If not in cache, get from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      toolCache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Tool not available');
  } catch (error) {
    console.error('Tool cache strategy failed:', error);
    
    // For tool requests, return a simplified offline version if possible
    const offlineToolResponse = await getOfflineToolVersion(request.url);
    if (offlineToolResponse) {
      return offlineToolResponse;
    }
    
    return new Response(JSON.stringify({
      error: 'This tool is not available offline',
      offlineMode: true,
      message: 'Please reconnect to use this assessment tool'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to provide simplified offline versions of tools
async function getOfflineToolVersion(url) {
  // Extract tool name from URL
  const toolMatch = url.match(/\/api\/tools\/([^\/]+)/);
  if (!toolMatch) return null;
  
  const toolName = toolMatch[1];
  
  // Return basic offline version based on tool type
  const offlineTools = {
    'potential-quotient-calculator': {
      name: 'Potential Quotient Calculator',
      offlineMode: true,
      questions: [
        { id: 'q1', text: 'Rate your growth mindset (1-10)', type: 'scale' },
        { id: 'q2', text: 'How often do you try new approaches?', type: 'multiple-choice' }
      ],
      message: 'Limited offline version available. Your responses will be saved and processed when you reconnect.'
    },
    'success-factor-calculator': {
      name: 'Success Factor Calculator',
      offlineMode: true,
      questions: [
        { id: 'q1', text: 'Do you have a morning routine?', type: 'yes-no' },
        { id: 'q2', text: 'Rate your consistency (1-10)', type: 'scale' }
      ],
      message: 'Limited offline version available. Your responses will be saved and processed when you reconnect.'
    }
    // Add other tools as needed
  };
  
  const offlineTool = offlineTools[toolName];
  if (!offlineTool) return null;
  
  return new Response(JSON.stringify(offlineTool), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Helper functions
function isStaticAsset(url) {
  return url.includes('/_next/static/') || 
         url.includes('/icon-') || 
         url.includes('/manifest.json') ||
         url.endsWith('.css') ||
         url.endsWith('.js');
}

function isImageAsset(url) {
  return url.endsWith('.png') ||
         url.endsWith('.jpg') ||
         url.endsWith('.jpeg') ||
         url.endsWith('.webp') ||
         url.endsWith('.svg') ||
         url.endsWith('.gif') ||
         url.includes('/_next/image');
}

function isToolRequest(url) {
  return url.includes('/api/tools/') || 
         CACHEABLE_TOOLS.some(tool => url.includes(tool));
}

function isAPIRequest(url) {
  return (url.includes('/api/') && !isToolRequest(url)) || 
         url.includes('/.netlify/functions/') ||
         url.includes('supabase.co');
}

function isCacheableRoute(url) {
  return CACHEABLE_ROUTES.some(route => {
    if (route === '/') {
      return url.endsWith('/') || url.split('/').length === 3;
    }
    return url.includes(route);
  });
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'assessment-submission') {
    event.waitUntil(syncAssessmentSubmissions());
  } else if (event.tag === 'user-data-sync') {
    event.waitUntil(syncUserData());
  }
});

async function syncAssessmentSubmissions() {
  try {
    // Get pending submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/.netlify/functions/process-assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data)
        });
        
        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log('Synced assessment submission:', submission.id);
        }
      } catch (error) {
        console.error('Failed to sync submission:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncUserData() {
  try {
    // Sync user progress and engagement data
    const pendingData = await getPendingUserData();
    
    for (const data of pendingData) {
      try {
        const response = await fetch('/.netlify/functions/track-user-journey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.payload)
        });
        
        if (response.ok) {
          await removePendingUserData(data.id);
          console.log('Synced user data:', data.id);
        }
      } catch (error) {
        console.error('Failed to sync user data:', error);
      }
    }
  } catch (error) {
    console.error('User data sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
async function getPendingSubmissions() {
  // Implementation would use IndexedDB to store offline submissions
  return [];
}

async function removePendingSubmission(id) {
  // Implementation would remove from IndexedDB
}

async function getPendingUserData() {
  // Implementation would get pending user data from IndexedDB
  return [];
}

async function removePendingUserData(id) {
  // Implementation would remove from IndexedDB
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

console.log('Service Worker: Loaded');