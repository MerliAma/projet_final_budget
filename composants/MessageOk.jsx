"use client"
import React, { useEffect } from 'react'
import { LuCircleCheck, LuX } from 'react-icons/lu'

/**
 * MessageOk — Toast de succès flottant en position absolue/fixe
 * Reste toujours visible à l'écran sans nécessiter de défilement (scroll).
 */
function MessageOk({ message, onClose, duration = 3000, position = 'top-right' }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose && onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const positionClass = position === 'bottom-right'
    ? 'fixed bottom-5 right-5 sm:bottom-6 sm:right-6'
    : 'fixed top-5 right-5 sm:top-6 sm:right-6'

  return (
    <div
      className={`${positionClass} z-60 max-w-sm w-[calc(100%-2.5rem)] sm:w-auto animate-fade-in pointer-events-auto`}
      role="status"
      aria-live="polite"
    >
      <div className="alert alert-success bg-emerald-600 text-white border border-emerald-500/30 shadow-xl rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <LuCircleCheck className="text-xl text-white shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-medium">{message}</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer text-sm shrink-0"
            aria-label="Fermer la notification"
          >
            <LuX className="text-base" />
          </button>
        )}
      </div>
    </div>
  )
}

export default MessageOk

