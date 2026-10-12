"use client"
import React, { useEffect } from 'react'
import { LuCircleCheck, LuTriangleAlert, LuX } from 'react-icons/lu'

/**
 * ToastNotification — Notification flottante temporaire et accessible
 */
export default function ToastNotification({
  type = 'success', // 'success' | 'error'
  message,
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose && onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const isSuccess = type === 'success'

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className={`p-4 rounded-2xl shadow-lg border flex items-start gap-3 backdrop-blur-md ${
        isSuccess 
          ? 'bg-emerald-950/90 text-white border-emerald-700/50 shadow-emerald-950/20' 
          : 'bg-red-950/90 text-white border-red-700/50 shadow-red-950/20'
      }`}>
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <LuCircleCheck className="text-xl text-emerald-400" aria-hidden="true" />
          ) : (
            <LuTriangleAlert className="text-xl text-red-400" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {message}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Fermer la notification"
        >
          <LuX className="text-base" />
        </button>
      </div>
    </div>
  )
}
