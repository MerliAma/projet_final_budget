"use client"
import React from 'react'

/**
 * AuthInput — Champ de formulaire avec label, icône, états focus/erreur/disabled
 * Respecte les standards d'accessibilité (label explicite + aria-describedby)
 */
function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  hint,
  icon: Icon,
  rightElement,
  autoComplete,
  className = "",
}) {
  const hasError = Boolean(error)
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = hasError ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      
      {/* Label */}
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#0f172a]"
      >
        {label}
        {required && (
          <span className="text-[#dc2626] ml-1" aria-hidden="true">*</span>
        )}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        
        {/* Icône gauche */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            <Icon className={`text-lg ${hasError ? 'text-[#dc2626]' : 'text-[#94a3b8]'}`} />
          </div>
        )}

        {/* Champ */}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={describedBy}
          aria-required={required ? "true" : undefined}
          className={`
            w-full h-12 rounded-[10px] border text-sm
            transition-all duration-200
            bg-white text-[#0f172a] placeholder-[#94a3b8]
            ${Icon ? 'pl-10' : 'pl-4'}
            ${rightElement ? 'pr-12' : 'pr-4'}
            ${hasError
              ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626]/20'
              : 'border-[#e2e8f0] focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20'
            }
            ${disabled
              ? 'opacity-50 cursor-not-allowed bg-[#f1f5f9]'
              : ''
            }
            outline-none
            shadow-[0_1px_2px_rgba(0,0,0,0.05)]
          `}
        />

        {/* Élément droit (ex: bouton voir/masquer) */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {/* Message d'aide */}
      {hint && !hasError && (
        <p id={hintId} className="text-xs text-[#94a3b8]">
          {hint}
        </p>
      )}

      {/* Message d'erreur */}
      {hasError && (
        <p id={errorId} role="alert" className="text-xs text-[#dc2626] flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default AuthInput
