"use client"
import React from 'react'
import Link from 'next/link'
import { LuChartPie, LuPlus, LuPiggyBank, LuArrowRight } from 'react-icons/lu'

/**
 * StatsEmptyState — État vide pédagogique et convivial
 * Informe l'utilisateur sans inventer de fausses données et l'oriente vers l'action requise.
 */
export default function StatsEmptyState({ hasBudgets = false }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs my-8 animate-fade-in">
      
      {/* Icône mise en scène */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
        <LuChartPie className="text-3xl sm:text-4xl" aria-hidden="true" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        {!hasBudgets ? "Pas encore de budget configuré" : "Pas encore de données de dépenses"}
      </h2>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        {!hasBudgets
          ? "Pour générer vos graphiques et statistiques financières, commencez par créer vos premières enveloppes budgétaires."
          : "Vos budgets sont prêts ! Enregistrez vos premières dépenses pour visualiser la répartition, l'évolution et vos indicateurs financiers."}
      </p>

      {/* Boutons d'action contextuels */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {!hasBudgets ? (
          <Link
            href="/Budget"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#16a34a] text-white hover:bg-[#15803d] transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <LuPiggyBank className="text-base" aria-hidden="true" />
            <span>Créer mon premier budget</span>
            <LuArrowRight className="text-sm" aria-hidden="true" />
          </Link>
        ) : (
          <Link
            href="/Transaction"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#16a34a] text-white hover:bg-[#15803d] transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <LuPlus className="text-base" aria-hidden="true" />
            <span>Enregistrer une dépense</span>
            <LuArrowRight className="text-sm" aria-hidden="true" />
          </Link>
        )}
      </div>

    </div>
  )
}
