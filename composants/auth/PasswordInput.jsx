"use client"
import React, { useState } from 'react'
import { LuEye, LuEyeOff, LuLock } from 'react-icons/lu'
import AuthInput from './AuthInput'

/**
 * PasswordInput — Champ mot de passe avec bouton afficher/masquer accessible.
 * Peut afficher un indicateur de robustesse (strength).
 */
function PasswordInput({
  id,
  label = "Mot de passe",
  placeholder = "Votre mot de passe",
  value = "",
  onChange,
  required = false,
  disabled = false,
  error,
  hint,
  autoComplete = "current-password",
  showStrength = false,
  className = "",
}) {
  const [visible, setVisible] = useState(false)

  // Calcul de la robustesse du mot de passe
  const getStrength = (pwd) => {
    if (!pwd || pwd.length === 0) return null
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    if (score <= 1) return { level: "Faible", color: "bg-[#dc2626]", width: "w-1/3", textColor: "text-[#dc2626]" }
    if (score <= 3) return { level: "Moyen", color: "bg-[#d97706]", width: "w-2/3", textColor: "text-[#d97706]" }
    return { level: "Fort", color: "bg-[#16a34a]", width: "w-full", textColor: "text-[#16a34a]" }
  }

  const strength = showStrength ? getStrength(value) : null

  const toggleButton = (
    <button
      type="button"
      onClick={() => setVisible((v) => !v)}
      disabled={disabled}
      aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      className="
        text-[#94a3b8] hover:text-[#475569]
        transition-colors duration-150
        cursor-pointer disabled:cursor-not-allowed
        focus-visible:outline-2 focus-visible:outline-[#16a34a]
        rounded
      "
    >
      {visible
        ? <LuEye className="text-lg" aria-hidden="true" />
        : <LuEyeOff className="text-lg" aria-hidden="true" />
      }
    </button>
  )

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <AuthInput
        id={id}
        label={label}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        error={error}
        hint={hint}
        icon={LuLock}
        rightElement={toggleButton}
        autoComplete={autoComplete}
        className=""
      />

      {/* Indicateur de robustesse */}
      {showStrength && value && strength && (
        <div className="flex items-center gap-2 mt-0.5" aria-live="polite" aria-label={`Robustesse du mot de passe : ${strength.level}`}>
          <div className="flex-1 h-1 bg-[#e2e8f0] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
            />
          </div>
          <span className={`text-xs font-medium ${strength.textColor}`}>
            {strength.level}
          </span>
        </div>
      )}
    </div>
  )
}

export default PasswordInput
