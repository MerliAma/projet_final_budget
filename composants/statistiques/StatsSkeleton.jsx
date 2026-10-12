"use client"
import React from 'react'

/**
 * StatsSkeleton — Skeleton de chargement pour la page Statistiques
 * Reproduit fidèlement la grille de la page pour éviter tout layout shift.
 */
export default function StatsSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse" aria-busy="true" aria-label="Chargement des statistiques...">
      
      {/* ── En-tête skeleton ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded-md" />
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-96 bg-slate-200 rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-44 bg-slate-200 rounded-xl" />
          <div className="h-10 w-28 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* ── KPIs skeleton ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-8 w-36 bg-slate-200 rounded-lg" />
            <div className="h-3 w-28 bg-slate-200 rounded pt-2 border-t border-slate-100" />
          </div>
        ))}
      </div>

      {/* ── Mini-cartes skeleton ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 h-16" />
        ))}
      </div>

      {/* ── Graphiques skeleton ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 h-80" />
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 h-80" />
      </div>

      {/* ── Analyse budgets skeleton ──────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <div className="h-6 w-52 bg-slate-200 rounded-md" />
        <div className="h-4 w-72 bg-slate-200 rounded" />
        <div className="space-y-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>

    </div>
  )
}
