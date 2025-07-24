"use client"

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const log = (message: string) => {
      console.log(message)
      setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
    }

    try {
      log("Starting debug checks...")
      
      // Test localStorage access
      if (typeof window !== 'undefined') {
        log("✓ Window object available")
        try {
          localStorage.setItem('test', 'value')
          localStorage.removeItem('test')
          log("✓ localStorage working")
        } catch (e) {
          log("✗ localStorage error: " + (e as Error).message)
        }
      }

      // Test imports
      log("Testing module imports...")
      
      // Test analytics engine import
      import('@/lib/analytics-engine').then(() => {
        log("✓ Analytics engine imported successfully")
      }).catch((e) => {
        log("✗ Analytics engine import failed: " + e.message)
        setError("Analytics engine import failed: " + e.message)
      })

      // Test i18n import
      import('@/lib/i18n').then(() => {
        log("✓ i18n system imported successfully")
      }).catch((e) => {
        log("✗ i18n import failed: " + e.message)
        setError("i18n import failed: " + e.message)
      })

      // Test webinar system import
      import('@/lib/webinar-system').then(() => {
        log("✓ Webinar system imported successfully")
      }).catch((e) => {
        log("✗ Webinar system import failed: " + e.message)
        setError("Webinar system import failed: " + e.message)
      })

      // Test hooks
      import('@/lib/hooks/use-i18n').then(() => {
        log("✓ i18n hook imported successfully")
      }).catch((e) => {
        log("✗ i18n hook import failed: " + e.message)
        setError("i18n hook import failed: " + e.message)
      })

      import('@/lib/hooks/use-analytics').then(() => {
        log("✓ Analytics hook imported successfully")
      }).catch((e) => {
        log("✗ Analytics hook import failed: " + e.message)
        setError("Analytics hook import failed: " + e.message)
      })

      log("Debug checks completed")

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e)
      log("✗ Error during debug: " + errorMessage)
      setError(errorMessage)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Debug Page</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Debug Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
            {logs.length === 0 && <div>Initializing debug checks...</div>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">System Info</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
              <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              <p><strong>Local Storage Available:</strong> {typeof window !== 'undefined' && window.localStorage ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Quick Tests</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setLogs(prev => [...prev, `${new Date().toISOString()}: Manual test clicked`])}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
              >
                Test Button Click
              </button>
              <button 
                onClick={() => {
                  try {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('debug_test', new Date().toISOString())
                      setLogs(prev => [...prev, `${new Date().toISOString()}: LocalStorage test successful`])
                    }
                  } catch (e) {
                    setLogs(prev => [...prev, `${new Date().toISOString()}: LocalStorage test failed: ${(e as Error).message}`])
                  }
                }}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm ml-2"
              >
                Test LocalStorage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}