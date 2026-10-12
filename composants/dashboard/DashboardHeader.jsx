"use client"
import React from 'react'
import Link from 'next/link'
import { LuPlus, LuRefreshCw, LuPiggyBank, LuArrowLeftRight } from 'react-icons/lu'

export default function DashboardHeader({ userName, onRefresh, isRefreshing }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      {/* ── Salutation & Sous-titre ──────────────────────── */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Bonjour{userName ? `, ${userName}` : ''}
          </h1>
          <span className="text-2xl sm:text-3xl" role="img" aria-label="Salutation">👋</span>
        </div>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Voici l'état actuel de votre situation financière et de vos budgets.
        </p>
      </div>

      {/* ── Actions rapides ──────────────────────────────── */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Bouton rafraîchir */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          type="button"
          className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          title="Actualiser les données"
          aria-label="Actualiser les données"
        >
          <LuRefreshCw className={`text-base ${isRefreshing ? 'animate-spin text-[#16a34a]' : ''}`} aria-hidden="true" />
        </button>

        {/* Bouton : Nouveau budget */}
        <Link
          href="/Budget"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 transition-all shadow-xs"
        >
          <LuPiggyBank className="text-base text-emerald-600" aria-hidden="true" />
          <span>Nouveau budget</span>
        </Link>

        {/* Bouton : Ajouter une dépense */}
        <Link
          href="/Transaction"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white transition-all shadow-sm hover:shadow-md"
        >
          <LuPlus className="text-base" aria-hidden="true" />
          <span>Ajouter une dépense</span>
        </Link>
      </div>
    </div>
  )
}
