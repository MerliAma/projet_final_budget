"use client"
import React from 'react'

/**
 * ProfileSkeleton — Skeleton de chargement pour la page Profil
 */
export default function ProfileSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Chargement de votre profil...">
      {/* ── Header skeleton ───────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-200 shrink-0" />
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <div className="h-6 w-48 bg-slate-200 rounded-lg mx-auto sm:mx-0" />
          <div className="h-4 w-64 bg-slate-200 rounded mx-auto sm:mx-0" />
          <div className="h-3 w-40 bg-slate-200 rounded mx-auto sm:mx-0" />
        </div>
      </div>

      {/* ── Onglets skeleton ──────────────────────────────── */}
      <div className="flex gap-2 pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-32 bg-slate-200 rounded-xl" />
        ))}
      </div>

      {/* ── Formulaire card skeleton ──────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
        <div className="h-5 w-48 bg-slate-200 rounded" />
        <div className="space-y-4 max-w-xl">
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
          <div className="h-10 w-44 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
