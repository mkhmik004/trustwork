'use client'

import { ServicesStorage } from '@/lib/services-storage'

export function DebugUtils() {
  const handleClearStorage = () => {
    const storage = ServicesStorage.getInstance()
    storage.forceReloadDefaults()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleClearStorage}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg text-sm"
        title="Clear localStorage and reload with fresh addresses"
      >
        🔄 Reset Storage
      </button>
    </div>
  )
}