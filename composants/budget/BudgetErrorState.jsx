"use client"
import React from 'react'
import { LuTriangleAlert, LuRefreshCw } from 'react-icons/lu'

/**
 * BudgetErrorState — Affichage d'erreur convivial avec bouton Réessayer
 */
export default function BudgetErrorState({ message, onRetry, isRetrying = false }) {
  return (
    <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-6">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <LuTriangleAlert className="text-3xl" aria-hidden="true" />
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        Impossible de charger vos budgets
      </h2>

      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
        {message || "Une interruption momentanée est survenue lors de la communication avec la base de données."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-all cursor-pointer disabled:opacity-50"
        >
          <LuRefreshCw className={`text-sm ${isRetrying ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>{isRetrying ? 'Tentative en cours...' : 'Réessayer'}</span>
        </button>
      )}
    </div>
  )
}
