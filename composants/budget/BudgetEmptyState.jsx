"use client"
import React from 'react'
import { LuPiggyBank, LuPlus, LuSparkles } from 'react-icons/lu'

/**
 * BudgetEmptyState — Expérience conviviale lorsqu'aucun budget n'a encore été créé
 */
export default function BudgetEmptyState({ onOpenCreate }) {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs my-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
        <LuPiggyBank className="text-3xl sm:text-4xl" aria-hidden="true" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
        <LuSparkles className="text-xs text-emerald-600" aria-hidden="true" />
        <span>Prêt à démarrer</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        Vous n&apos;avez encore aucun budget
      </h2>

      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
        Créez votre premier budget pour allouer des plafonds à vos dépenses 
        (ex : Alimentation, Logement, Loisirs) et suivre votre épargne en temps réel.
      </p>

      <button
        type="button"
        onClick={onOpenCreate}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer"
      >
        <LuPlus className="text-lg" aria-hidden="true" />
        <span>Créer mon premier budget</span>
      </button>
    </div>
  )
}
