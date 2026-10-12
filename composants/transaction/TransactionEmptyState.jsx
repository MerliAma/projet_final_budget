"use client"
import React from 'react'
import Link from 'next/link'
import { LuReceipt, LuPlus, LuPiggyBank, LuSearchX, LuArrowRight } from 'react-icons/lu'

/**
 * TransactionEmptyState — États vides contextuels pour les transactions
 */
export default function TransactionEmptyState({
  hasBudgets = true,
  isFiltered = false,
  onOpenCreate,
  onResetFilters,
}) {
  // Cas 1 : Aucun budget n'existe encore
  if (!hasBudgets) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
          <LuPiggyBank className="text-3xl sm:text-4xl" aria-hidden="true" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Créez d&apos;abord un budget
        </h2>

        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
          Toute transaction doit être affectée à un budget. Vous devez définir 
          au moins une enveloppe budgétaire avant de pouvoir enregistrer vos dépenses.
        </p>

        <Link
          href="/Budget"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <span>Créer mon premier budget</span>
          <LuArrowRight className="text-base" aria-hidden="true" />
        </Link>
      </div>
    )
  }

  // Cas 2 : Recherche ou filtre actif sans aucun résultat
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs my-6">
        <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LuSearchX className="text-2xl" aria-hidden="true" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
          Aucun résultat trouvé
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
          Aucune transaction ne correspond à vos critères de recherche actuels.
        </p>

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <span>Réinitialiser les filtres</span>
        </button>
      </div>
    )
  }

  // Cas 3 : Les budgets existent mais aucune transaction enregistrée
  return (
    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
        <LuReceipt className="text-3xl sm:text-4xl" aria-hidden="true" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        Aucune transaction enregistrée
      </h2>

      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
        Vous n&apos;avez encore enregistré aucune dépense. Ajoutez votre première transaction 
        pour commencer à suivre l&apos;évolution de vos budgets.
      </p>

      <button
        type="button"
        onClick={onOpenCreate}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer"
      >
        <LuPlus className="text-lg" aria-hidden="true" />
        <span>Ajouter une transaction</span>
      </button>
    </div>
  )
}
