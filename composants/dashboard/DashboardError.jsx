"use client"
import React from 'react'
import { LuTriangleAlert, LuRefreshCw } from 'react-icons/lu'

export default function DashboardError({ onRetry, isRetrying, message }) {
  return (
    <div className="bg-white rounded-3xl border border-red-100 p-8 sm:p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
      
      {/* ── Icône d'alerte ───────────────────────────────── */}
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto mb-5">
        <LuTriangleAlert className="text-3xl" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Impossible de charger vos données
      </h2>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {message ? (
          <>
            Une interruption est survenue lors de l'accès à la base de données :<br />
            <span className="font-semibold text-red-600 mt-1 inline-block">{message}</span>
          </>
        ) : (
          "Une interruption est survenue lors de la récupération de vos informations financières. Vérifiez votre connexion internet puis réessayez."
        )}
      </p>

      {/* ── CTA Réessayer ────────────────────────────────── */}
      <button
        onClick={onRetry}
        disabled={isRetrying}
        type="button"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
      >
        <LuRefreshCw className={`text-sm ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
        <span>{isRetrying ? 'Chargement...' : 'Réessayer'}</span>
      </button>

    </div>
  )
}
