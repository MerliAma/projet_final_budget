"use client"
import React, { useState } from 'react'
import { LuSlidersHorizontal, LuCoins, LuGlobe, LuCalendar, LuKey, LuCopy, LuCheck } from 'react-icons/lu'

/**
 * ProfilePreferences — Paramètres généraux et préférences de l'application
 * Affiche la devise de référence, la langue, le format des dates et les métadonnées du compte.
 */
export default function ProfilePreferences({ user, onNotify }) {
  const [copiedUid, setCopiedUid] = useState(false)

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid)
      setCopiedUid(true)
      if (onNotify) {
        onNotify('success', 'Identifiant de compte copié dans le presse-papiers.')
      }
      setTimeout(() => setCopiedUid(false), 2500)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* ── Titre de la section ───────────────────────────── */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <LuSlidersHorizontal className="text-emerald-600" aria-hidden="true" />
          <span>Préférences de l'application</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Consultez la configuration monétaire et régionale active pour votre compte.
        </p>
      </div>

      {/* ── Grille des préférences ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        
        {/* Devise */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3.5">
          <div className="p-2.5 bg-white rounded-xl text-emerald-600 border border-slate-200/80 shadow-2xs">
            <LuCoins className="text-lg" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Devise de référence
            </span>
            <strong className="text-sm font-bold text-slate-900 block mt-0.5">
              FCFA (Franc CFA)
            </strong>
            <span className="text-xs text-slate-500">
              Format standard d'Afrique de l'Ouest
            </span>
          </div>
        </div>

        {/* Langue & Région */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3.5">
          <div className="p-2.5 bg-white rounded-xl text-indigo-600 border border-slate-200/80 shadow-2xs">
            <LuGlobe className="text-lg" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Langue & Région
            </span>
            <strong className="text-sm font-bold text-slate-900 block mt-0.5">
              Français (FR)
            </strong>
            <span className="text-xs text-slate-500">
              Interface et libellés francophones
            </span>
          </div>
        </div>

        {/* Format de Date */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3.5">
          <div className="p-2.5 bg-white rounded-xl text-amber-600 border border-slate-200/80 shadow-2xs">
            <LuCalendar className="text-lg" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Format de date
            </span>
            <strong className="text-sm font-bold text-slate-900 block mt-0.5">
              JJ/MM/AAAA
            </strong>
            <span className="text-xs text-slate-500">
              Ex : 06 oct. 2026
            </span>
          </div>
        </div>

        {/* Identifiant Unique de Compte */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3.5">
          <div className="p-2.5 bg-white rounded-xl text-slate-600 border border-slate-200/80 shadow-2xs">
            <LuKey className="text-lg" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Identifiant de compte (UID)
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono font-semibold text-slate-700 truncate max-w-[140px]">
                {user?.uid || '—'}
              </span>
              {user?.uid && (
                <button
                  type="button"
                  onClick={handleCopyUid}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
                  title="Copier l'UID"
                  aria-label="Copier l'identifiant de compte"
                >
                  {copiedUid ? <LuCheck className="text-xs text-emerald-600" /> : <LuCopy className="text-xs" />}
                </button>
              )}
            </div>
            <span className="text-xs text-slate-500">
              Gestionnaire : Firebase Auth
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}
