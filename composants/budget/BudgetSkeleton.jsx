"use client"
import React from 'react'

/**
 * BudgetSkeleton — État de chargement animé pour la page des budgets
 * Reproduit la grille d'en-tête, les KPIs et les cartes de budget
 */
export default function BudgetSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* Summary KPI skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-7 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Grid cartes budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-5 w-24 bg-slate-200 rounded-full" />
            </div>
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-3 bg-slate-200 rounded-full" />
            <div className="grid grid-cols-2 gap-2 h-12 bg-slate-100 rounded-xl" />
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <div className="h-4 w-16 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
