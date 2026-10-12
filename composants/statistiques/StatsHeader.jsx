"use client"
import React from 'react'
import { LuChartPie, LuRefreshCw, LuCalendar } from 'react-icons/lu'

/**
 * StatsHeader — En-tête de la page Statistiques
 * Affiche le titre, la description, le sélecteur de période dynamique et le bouton d'actualisation.
 */
export default function StatsHeader({
  selectedPeriod,
  onPeriodChange,
  availablePeriods = [],
  onRefresh,
  isRefreshing,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
      {/* ── Titre et description ──────────────────────────── */}
      <div>
        <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
          <LuChartPie className="text-base" aria-hidden="true" />
          <span>Analyses financières</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Statistiques & Analyses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Analysez vos dépenses, la répartition de votre budget et vos tendances financières réelles.
        </p>
      </div>

      {/* ── Filtre de période & Bouton Actualiser ──────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sélecteur de période */}
        <div className="relative inline-flex items-center">
          <LuCalendar className="absolute left-3.5 text-slate-400 text-sm pointer-events-none" aria-hidden="true" />
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="pl-9 pr-9 py-2 text-xs sm:text-sm font-medium bg-white text-slate-700 border border-slate-200 rounded-xl hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs appearance-none cursor-pointer transition-all"
            aria-label="Sélectionner la période d'analyse"
          >
            <option value="ALL">Toutes les périodes</option>
            {availablePeriods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Bouton d'actualisation */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl hover:border-slate-300 shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          title="Actualiser les statistiques"
          aria-label="Actualiser les statistiques"
        >
          <LuRefreshCw 
            className={`text-sm ${isRefreshing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} 
            aria-hidden="true" 
          />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>
    </div>
  )
}
