"use client"
import React from 'react'
import { LuPiggyBank, LuTrendingDown, LuWallet, LuLayers } from 'react-icons/lu'
import { SommeMontantBud, SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * BudgetSummary — Synthèse financière globale des budgets
 * Affiche 4 indicateurs clés dérivés des données réelles
 */
export default function BudgetSummary({ listeBudget = [], listeTransaction = [] }) {
  const totalAlloue = SommeMontantBud(listeBudget)
  const totalDepense = SommeTransactions("", listeTransaction, listeBudget, 0)
  const totalReste = totalAlloue - totalDepense
  const tauxConso = totalAlloue > 0 ? Math.round((totalDepense / totalAlloue) * 100) : 0
  const nbBudgets = listeBudget?.length || 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Alloué */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Budgété
          </span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl" aria-hidden="true">
            <LuPiggyBank className="text-lg" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {totalAlloue.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enveloppe globale définie
          </p>
        </div>
      </div>

      {/* 2. Total Dépensé */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Dépensé
          </span>
          <div className="p-2 bg-red-50 text-red-600 rounded-xl" aria-hidden="true">
            <LuTrendingDown className="text-lg" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-red-600 tracking-tight">
            {totalDepense.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-slate-500">
              {tauxConso}% consommé
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              {listeTransaction?.length || 0} dépense(s)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Total Restant */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Montant Restant
          </span>
          <div className={`p-2 rounded-xl ${totalReste >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`} aria-hidden="true">
            <LuWallet className="text-lg" />
          </div>
        </div>
        <div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight ${totalReste >= 0 ? 'text-[#16a34a]' : 'text-red-600'}`}>
            {totalReste.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalReste >= 0 ? 'Marge disponible globale' : 'Déficit budgétaire global'}
          </p>
        </div>
      </div>

      {/* 4. Nombre de budgets actifs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Budgets Actifs
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl" aria-hidden="true">
            <LuLayers className="text-lg" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {nbBudgets} <span className="text-xs font-semibold text-slate-400">catégorie(s)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {nbBudgets > 0 ? 'Enveloppes actives' : 'Aucun budget configuré'}
          </p>
        </div>
      </div>
    </div>
  )
}
