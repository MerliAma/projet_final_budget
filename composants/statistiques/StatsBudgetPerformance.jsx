"use client"
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  LuCircleCheck, 
  LuInfo, 
  LuTriangleAlert, 
  LuArrowUpRight, 
  LuArrowUpDown,
  LuLayers,
  LuCalendar
} from 'react-icons/lu'

/**
 * StatsBudgetPerformance — Analyse comparative détaillée de chaque budget
 * Réutilise la logique visuelle du Lot 5 et répond aux questions :
 * - Quels budgets consomment le plus ?
 * - Quels sont les moins utilisés ?
 * - Quels budgets sont proches de leur limite ou dépassés ?
 */
export default function StatsBudgetPerformance({
  budgetStats = [], // [{ id, nom, mois, alloue, depense, reste, partPct, transactionsCount, statut }]
}) {
  const [activeFilter, setActiveFilter] = useState('ALL') // 'ALL' | 'CONTROLE' | 'SURVEILLER' | 'CRITIQUE' | 'DEPASSE'
  const [sortOrder, setSortOrder] = useState('DEPENSE_DESC') // 'DEPENSE_DESC' | 'DEPENSE_ASC' | 'PCT_DESC'

  // Filtrage selon le statut
  const filteredBudgets = useMemo(() => {
    return budgetStats.filter((b) => {
      const pct = b.alloue > 0 ? (b.depense / b.alloue) * 100 : 0
      if (activeFilter === 'CONTROLE') return pct < 70
      if (activeFilter === 'SURVEILLER') return pct >= 70 && pct < 90
      if (activeFilter === 'CRITIQUE') return pct >= 90 && pct <= 100
      if (activeFilter === 'DEPASSE') return pct > 100
      return true
    })
  }, [budgetStats, activeFilter])

  // Tri
  const sortedBudgets = useMemo(() => {
    const list = [...filteredBudgets]
    if (sortOrder === 'DEPENSE_DESC') {
      return list.sort((a, b) => b.depense - a.depense)
    }
    if (sortOrder === 'DEPENSE_ASC') {
      return list.sort((a, b) => a.depense - b.depense)
    }
    if (sortOrder === 'PCT_DESC') {
      return list.sort((a, b) => {
        const pctA = a.alloue > 0 ? a.depense / a.alloue : 0
        const pctB = b.alloue > 0 ? b.depense / b.alloue : 0
        return pctB - pctA
      })
    }
    return list
  }, [filteredBudgets, sortOrder])

  // Comptage des statuts pour les badges d'onglets
  const counts = useMemo(() => {
    return {
      all: budgetStats.length,
      controle: budgetStats.filter((b) => (b.alloue > 0 ? b.depense / b.alloue : 0) < 0.7).length,
      surveiller: budgetStats.filter((b) => {
        const p = b.alloue > 0 ? b.depense / b.alloue : 0
        return p >= 0.7 && p < 0.9
      }).length,
      critique: budgetStats.filter((b) => {
        const p = b.alloue > 0 ? b.depense / b.alloue : 0
        return p >= 0.9 && p <= 1
      }).length,
      depasse: budgetStats.filter((b) => (b.alloue > 0 ? b.depense / b.alloue : 0) > 1).length,
    }
  }, [budgetStats])

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* ── En-tête de section ────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <LuLayers className="text-emerald-600" aria-hidden="true" />
            <span>Performance et saturation par budget</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Suivi du taux de consommation et identification des dépassements
          </p>
        </div>

        {/* Sélecteur de tri */}
        <div className="flex items-center gap-2 text-xs">
          <LuArrowUpDown className="text-slate-400" aria-hidden="true" />
          <span className="text-slate-500 font-medium hidden sm:inline">Trier par :</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer transition-all"
            aria-label="Trier la liste des budgets"
          >
            <option value="DEPENSE_DESC">Plus dépensés en premier</option>
            <option value="DEPENSE_ASC">Moins dépensés en premier</option>
            <option value="PCT_DESC">Taux de consommation (%)</option>
          </select>
        </div>
      </div>

      {/* ── Filtres de statut par onglets ─────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tous ({counts.all})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('CONTROLE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'CONTROLE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Sous contrôle ({counts.controle})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('SURVEILLER')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'SURVEILLER'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          À surveiller ({counts.surveiller})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('CRITIQUE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'CRITIQUE'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
          }`}
        >
          Presque épuisés ({counts.critique})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('DEPASSE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'DEPASSE'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-red-50 text-red-800 hover:bg-red-100'
          }`}
        >
          Dépassés ({counts.depasse})
        </button>
      </div>

      {/* ── Liste des Budgets avec jauges de consommation ──── */}
      {sortedBudgets.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Aucun budget ne correspond au filtre sélectionné.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBudgets.map((b) => {
            const pct = b.alloue > 0 ? Math.round((b.depense / b.alloue) * 100) : 0
            const reste = b.alloue - b.depense

            // Configuration multi-critères
            let status = {
              label: 'Sous contrôle',
              badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              barClass: 'bg-[#16a34a]',
              icon: LuCircleCheck,
            }

            if (pct > 100) {
              status = {
                label: 'Dépassé',
                badgeClass: 'bg-red-50 text-red-700 border-red-200',
                barClass: 'bg-red-600',
                icon: LuTriangleAlert,
              }
            } else if (pct >= 90) {
              status = {
                label: 'Presque épuisé',
                badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
                barClass: 'bg-orange-500',
                icon: LuTriangleAlert,
              }
            } else if (pct >= 70) {
              status = {
                label: 'À surveiller',
                badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
                barClass: 'bg-amber-500',
                icon: LuInfo,
              }
            }

            const StatusIcon = status.icon
            const moisLabel = b.mois
              ? new Date(b.mois).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
              : null

            return (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between gap-3"
              >
                {/* Ligne 1 : Nom, Mois, Statut et Lien */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Link
                      href={`/LeBudget/${b.id}`}
                      className="font-bold text-slate-900 hover:text-emerald-700 text-sm sm:text-base capitalize truncate flex items-center gap-1 group"
                    >
                      <span>{b.nom}</span>
                      <LuArrowUpRight className="text-xs text-slate-400 group-hover:text-emerald-700 transition-colors" />
                    </Link>

                    {moisLabel && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 capitalize px-2 py-0.5 bg-slate-50 rounded-md">
                        <LuCalendar className="text-[10px]" />
                        <span>{moisLabel}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.badgeClass}`}>
                      <StatusIcon className="text-xs" />
                      <span>{status.label}</span>
                    </span>
                  </div>
                </div>

                {/* Ligne 2 : Montants et Pourcentage */}
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-500 font-medium">Consommé :</span>
                    <strong className="text-sm font-black text-slate-900">
                      {b.depense.toLocaleString('fr-FR')}{' '}
                      <span className="text-[11px] font-normal text-slate-400">/ {b.alloue.toLocaleString('fr-FR')} FCFA</span>
                    </strong>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      Solde :{' '}
                      <strong className={reste >= 0 ? 'text-emerald-700 font-bold' : 'text-red-600 font-bold'}>
                        {reste.toLocaleString('fr-FR')} FCFA
                      </strong>
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {pct} %
                    </span>
                  </div>
                </div>

                {/* Ligne 3 : Jauge de progression */}
                <div
                  className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Saturation du budget ${b.nom} : ${pct}%`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${status.barClass}`}
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  />
                </div>

                {/* Ligne 4 : Métadonnées complémentaires */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    {b.transactionsCount} opération{b.transactionsCount > 1 ? 's' : ''} enregistrée{b.transactionsCount > 1 ? 's' : ''}
                  </span>
                  <span>
                    Représente {b.partPct || 0}% de vos dépenses totales
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
