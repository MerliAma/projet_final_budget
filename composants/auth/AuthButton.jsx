"use client"
import React from 'react'

/**
 * AuthButton — Bouton principal des formulaires d'authentification.
 * Gère les états : normal, loading, disabled.
 */
function AuthButton({
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  children,
  loadingText = "En cours...",
  variant = "primary",
  fullWidth = true,
  id,
  className = "",
}) {
  const isDisabled = disabled || loading

  const variants = {
    primary: `
      bg-[#16a34a] hover:bg-[#15803d] text-white
      shadow-[0_4px_16px_rgba(22,163,74,0.3)]
      hover:shadow-[0_6px_20px_rgba(22,163,74,0.4)]
    `,
    outline: `
      bg-white border-2 border-[#e2e8f0] hover:border-[#16a34a]
      text-[#0f172a] hover:text-[#16a34a]
      shadow-[0_1px_2px_rgba(0,0,0,0.05)]
    `,
    ghost: `
      bg-transparent hover:bg-[#f1f5f9]
      text-[#475569] hover:text-[#0f172a]
    `,
  }

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled ? "true" : undefined}
      aria-busy={loading ? "true" : undefined}
      className={`
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-2
        h-12 px-6 rounded-[10px]
        font-semibold text-sm
        transition-all duration-200
        cursor-pointer
        active:scale-[0.98]
        ${variants[variant] || variants.primary}
        ${isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none active:scale-100' : 'hover:scale-[1.01]'}
        ${className}
      `}
    >
      {loading ? (
        <>
          {/* Spinner SVG — pas de dépendance externe */}
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default AuthButton
