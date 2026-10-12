"use client"
import React from 'react'

/**
 * TransactionSkeleton — Placeholders animés pour le chargement des transactions
 */
export default function TransactionSkeleton() {
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
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-7 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-28 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="h-14 bg-white rounded-2xl border border-slate-200" />

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="h-8 bg-slate-100 rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-slate-50 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
