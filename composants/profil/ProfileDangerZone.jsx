"use client"
import React, { useState } from 'react'
import { LuTriangleAlert, LuLogOut, LuX } from 'react-icons/lu'

/**
 * ProfileDangerZone — Zone sensible et déconnexion sécurisée
 * Permet de se déconnecter avec une confirmation claire pour éviter les erreurs de manipulation.
 */
export default function ProfileDangerZone({ onLogout }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="bg-white rounded-3xl border border-red-200/80 p-6 sm:p-8 shadow-xs">
      
      {/* ── En-tête de la zone sensible ───────────────────── */}
      <div className="pb-4 border-b border-red-100 flex items-start gap-3">
        <div className="p-2 bg-red-50 text-red-600 rounded-xl shrink-0 mt-0.5">
          <LuTriangleAlert className="text-lg" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Zone sensible
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestion de votre session active et déconnexion du compte TopBudget.
          </p>
        </div>
      </div>

      {/* ── Action de Déconnexion ─────────────────────────── */}
      <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl">
        <div>
          <strong className="text-sm font-bold text-slate-900 block">
            Fermer la session en cours
          </strong>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Vous serez redirigé vers l'écran de connexion et vos données locales seront sécurisées.
          </p>
        </div>

        <div>
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              <LuLogOut className="text-base" aria-hidden="true" />
              <span>Se déconnecter</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 p-1.5 bg-red-50/80 rounded-2xl border border-red-200 animate-fade-in">
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                aria-label="Annuler la déconnexion"
              >
                <LuX className="text-base" />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
