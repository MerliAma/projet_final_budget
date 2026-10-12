"use client"
import React from 'react'

export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" role="status" aria-label="Chargement du tableau de bord">
      
      {/* ── Header skeleton ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-xl" />
          <div className="h-4 w-96 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-200 rounded-xl" />
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
          <div className="h-10 w-40 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* ── 4 KPI cards skeleton ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 rounded-md" />
              <div className="h-8 w-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-7 w-36 bg-slate-200 rounded-lg" />
            <div className="h-4 w-24 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>

      {/* ── 2 colonnes skeleton (Budgets + Graphique) ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budgets overview skeleton */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-24 bg-slate-200 rounded-md" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-slate-200 rounded-md" />
                <div className="h-4 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full" />
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-slate-200 rounded-md" />
                <div className="h-3 w-20 bg-slate-200 rounded-md" />
                <div className="h-3 w-20 bg-slate-200 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Graphique skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="h-5 w-44 bg-slate-200 rounded-lg mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-slate-200 rounded-md" />
                <div className="h-3 w-16 bg-slate-200 rounded-md" />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Transactions skeleton ───────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-44 bg-slate-200 rounded-lg" />
          <div className="h-4 w-20 bg-slate-200 rounded-md" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-full bg-slate-50 rounded-lg" />
        ))}
      </div>

    </div>
  )
}
