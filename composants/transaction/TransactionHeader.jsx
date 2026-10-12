"use client"
import React from 'react'
import { LuPlus, LuRefreshCw, LuArrowLeftRight } from 'react-icons/lu'

/**
 * TransactionHeader — En-tête moderne pour la page des transactions
 */
export default function TransactionHeader({ onOpenCreate, onRefresh, isRefreshing = false, hasBudgets = true }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl" aria-hidden="true">
            <LuArrowLeftRight className="text-xl sm:text-2xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Mes Transactions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Consultez l&apos;historique de vos dépenses et affectez-les à vos budgets.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {/* Bouton Rafraîchir */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Actualiser les transactions"
            aria-label="Actualiser les transactions"
          >
            <LuRefreshCw className={`text-base ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        )}

        {/* Bouton Nouvelle Dépense */}
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-[0.98] transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <LuPlus className="text-base" aria-hidden="true" />
          <span>Nouvelle dépense</span>
        </button>
      </div>
    </div>
  )
}
