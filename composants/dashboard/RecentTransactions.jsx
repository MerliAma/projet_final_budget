"use client"
import React from 'react'
import Link from 'next/link'
import { LuArrowUpRight, LuReceipt, LuCalendar, LuInfo } from 'react-icons/lu'

/**
 * RecentTransactions — 10 dernières transactions de l'utilisateur
 * 
 * Corrections apportées à l'ancien code :
 * 1. Tri chronologique global (et non par sous-ensemble de budget)
 * 2. 10 transactions réelles les plus récentes
 * 3. Tableau optimisé desktop + Cartes compactes sur mobile (supprime le débordement horizontal)
 */
export default function RecentTransactions({ listeBudget = [], listeTransaction = [] }) {
  // Création d'une map des budgets pour un lookup rapide O(1)
  const budgetMap = React.useMemo(() => {
    const map = new Map()
    if (Array.isArray(listeBudget)) {
      listeBudget.forEach((b) => map.set(String(b.id), b))
    }
    return map
  }, [listeBudget])

  // Filtrage des transactions appartenant aux budgets de l'utilisateur
  const userTransactions = React.useMemo(() => {
    if (!Array.isArray(listeTransaction)) return []
    
    return listeTransaction
      .filter((t) => budgetMap.has(String(t.budgetTrans)))
      .map((t) => ({
        ...t,
        budget: budgetMap.get(String(t.budgetTrans))
      }))
      .sort((a, b) => new Date(b.dateEnrg || 0) - new Date(a.dateEnrg || 0))
      .slice(0, 10)
  }, [listeTransaction, budgetMap])

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      
      {/* ── En-tête ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <LuReceipt className="text-emerald-600" aria-hidden="true" />
            <span>Dernières transactions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Historique des 10 opérations les plus récentes
          </p>
        </div>

        <Link
          href="/Transaction"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          <span>Voir tout</span>
          <LuArrowUpRight className="text-sm" aria-hidden="true" />
        </Link>
      </div>

      {/* ── Liste vide ───────────────────────────────────── */}
      {userTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
          <LuInfo className="text-3xl mb-2 text-slate-300" aria-hidden="true" />
          <p className="text-sm font-medium">Aucune transaction trouvée.</p>
          <p className="text-xs text-slate-400 mt-1">Vos dépenses récentes apparaîtront ici.</p>
        </div>
      ) : (
        <>
          {/* ── Version Desktop : Tableau (md et +) ────────── */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Description</th>
                  <th scope="col" className="px-4 py-3">Budget</th>
                  <th scope="col" className="px-4 py-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {userTransactions.map((t, idx) => {
                  const dateStr = t.dateEnrg
                    ? new Date(t.dateEnrg).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'
                  const montant = Number(t.montantTrans || 0)

                  return (
                    <tr key={t.id || `recent-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 capitalize">
                        {t.descriptionTrans || 'Sans description'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
                          {t.budget?.descriptionBud || 'Budget'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-red-600 whitespace-nowrap">
                        - {montant.toLocaleString('fr-FR')} FCFA
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ── Version Mobile : Cartes compactes (< md) ────── */}
          <div className="md:hidden space-y-3">
            {userTransactions.map((t, idx) => {
              const dateStr = t.dateEnrg
                ? new Date(t.dateEnrg).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                : '—'
              const montant = Number(t.montantTrans || 0)

              return (
                <div 
                  key={t.id || `recent-card-${idx}`}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-900 capitalize truncate">
                      {t.descriptionTrans || 'Sans description'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <LuCalendar className="text-[11px]" aria-hidden="true" />
                        {dateStr}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium truncate">
                        {t.budget?.descriptionBud || 'Budget'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-sm text-red-600">
                      - {montant.toLocaleString('fr-FR')}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-medium">FCFA</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

    </div>
  )
}
