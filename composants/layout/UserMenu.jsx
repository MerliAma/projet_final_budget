"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { LuUser, LuLogOut, LuChevronDown, LuShieldCheck } from 'react-icons/lu'

export default function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const userName = user?.nomUser || 'Utilisateur'
  const userEmail = user?.emailUser || user?.email || ''
  const userInitial = userName.charAt(0).toUpperCase()

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fermer sur touche Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu utilisateur"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
          {userInitial}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
            {userName}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Connecté
          </span>
        </div>
        <LuChevronDown 
          className={`text-slate-400 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true" 
        />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
          role="menu"
          aria-orientation="vertical"
        >
          {/* En-tête profil */}
          <div className="px-4 py-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                {userName}
              </span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <LuShieldCheck className="text-[10px]" aria-hidden="true" />
                Vérifié
              </span>
            </div>
            {userEmail && (
              <p className="text-[11px] text-slate-500 truncate">
                {userEmail}
              </p>
            )}
          </div>

          {/* Options de navigation */}
          <div className="py-1">
            <Link
              href="/Profil"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
              role="menuitem"
            >
              <LuUser className="text-sm text-slate-400 group-hover:text-emerald-600" aria-hidden="true" />
              <span>Mon Profil</span>
            </Link>
          </div>

          {/* Séparateur */}
          <div className="my-1 border-t border-slate-100" />

          {/* Déconnexion */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                onLogout()
              }}
              type="button"
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer text-left"
              role="menuitem"
            >
              <LuLogOut className="text-sm text-red-500" aria-hidden="true" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
