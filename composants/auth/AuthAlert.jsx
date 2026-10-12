"use client"
import React, { useEffect, useRef } from 'react'
import { LuX, LuCircleAlert, LuCircleCheck, LuInfo } from 'react-icons/lu'

/**
 * AuthAlert — Alerte contextuelle (erreur, succès, info) pour les pages d'authentification.
 * Auto-fermeture après `duration` ms. Fermeture manuelle possible.
 * Accessibilité : role="alert" / role="status"
 */
function AuthAlert({
  type = "error",   // "error" | "success" | "info"
  message,
  onClose,
  duration = 5000,  // 5s pour les erreurs, 4s pour les succès (Lot 1)
}) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!message) return
    timerRef.current = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timerRef.current)
  }, [message, duration, onClose])

  if (!message) return null

  const configs = {
    error: {
      role: "alert",
      icon: LuCircleAlert,
      container: "bg-[#fef2f2] border border-[#fecaca] text-[#dc2626]",
      iconClass: "text-[#dc2626]",
    },
    success: {
      role: "status",
      icon: LuCircleCheck,
      container: "bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d]",
      iconClass: "text-[#16a34a]",
    },
    info: {
      role: "status",
      icon: LuInfo,
      container: "bg-[#eff6ff] border border-[#bfdbfe] text-[#1d4ed8]",
      iconClass: "text-[#2563eb]",
    },
  }

  const config = configs[type] || configs.error
  const Icon = config.icon

  return (
    <div
      role={config.role}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`
        flex items-start gap-3 p-4 rounded-[10px] text-sm
        animate-[fadeIn_0.2s_ease-out]
        ${config.container}
      `}
    >
      <Icon className={`text-lg shrink-0 mt-0.5 ${config.iconClass}`} aria-hidden="true" />
      <span className="flex-1 leading-relaxed">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le message"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer rounded"
        >
          <LuX className="text-base" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default AuthAlert
