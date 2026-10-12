"use client"
import React from 'react'
import { LuTrendingDown, LuReceipt, LuLayers, LuCalculator } from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * TransactionSummary — Indicateurs synthétiques pour la page des transactions
 */
export default function TransactionSummary({ listeTransaction = [], listeBudget = [] }) {
  const totalDepense = SommeTransactions("", listeTransaction, listeBudget, 0)
  const nbTransactions = listeTransaction?.length || 0

  // Budgets uniques concernés par les transactions
  const budgetsImpactes = new Set(
    (listeTransaction || [])
      .map((t) => t?.budgetTrans)
      .filter(Boolean)
  ).size

  const depenseMoyenne = nbTransactions > 0 ? Math.round(totalDepense / nbTransactions) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Dépensé */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total des Dépenses
          </span>
          <div className="p-2 bg-red-50 text-red-600 rounded-xl" aria-hidden="true">
            <LuTrendingDown className="text-lg" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-red-600 tracking-tight">
            {totalDepense.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Somme de toutes les sorties
          </p>
        </div>
      </div>

      {/* 2. Nombre de Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Transactions
          </span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl" aria-hidden="true">
            <LuReceipt className="text-lg" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {nbTransactions} <span className="text-xs font-semibold text-slate-400">opération{nbTransactions > 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enregistrées dans l&apos;historique
          </p>
        </div>
      </div>

      {/* 3. Dépense Moyenne */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Montant Moyen
          </span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl" aria-hidden="true">
            <LuCalculator className="text-lg" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {depenseMoyenne.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Par opération enregistrée
          </p>
        </div>
      </div>

      {/* 4. Budgets Impactés */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Budgets Touchés
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl" aria-hidden="true">
            <LuLayers className="text-lg" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {budgetsImpactes} <span className="text-xs font-semibold text-slate-400">sur {listeBudget?.length || 0}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Catégories actives avec dépenses
          </p>
        </div>
      </div>
    </div>
  )
}
