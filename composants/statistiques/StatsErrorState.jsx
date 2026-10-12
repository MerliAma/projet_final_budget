"use client"
import React from 'react'
import { LuTriangleAlert, LuRefreshCw } from 'react-icons/lu'

/**
 * StatsErrorState — État d'erreur convivial pour la page Statistiques
 */
export default function StatsErrorState({ onRetry, isRetrying, message }) {
  return (
    <div className="bg-white rounded-3xl border border-red-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-8 animate-fade-in">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
        <LuTriangleAlert className="text-3xl" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Impossible de charger vos statistiques
      </h2>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {message || "Une interruption momentanée est survenue lors de la communication avec la base de données. Veuillez réessayer dans un instant."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
        >
          <LuRefreshCw className={`text-sm ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>{isRetrying ? "Nouvelle tentative..." : "Réessayer"}</span>
        </button>
      )}
    </div>
  )
}
