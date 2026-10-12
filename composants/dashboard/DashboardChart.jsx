"use client"
import React from 'react'
import { LuChartPie, LuInfo } from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * DashboardChart — Visualisation de la répartition des dépenses par budget
 * Répond à la question clé : « Quels budgets consomment le plus ? »
 * Réalisé en pur Tailwind CSS & SVG sans ajouter de bibliothèque externe lourde.
 */
export default function DashboardChart({ listeBudget = [], listeTransaction = [] }) {
  // Calcul de la dépense pour chaque budget
  const budgetDepenses = listeBudget.map((b) => {
    const calcul = SommeTransactions(b.id, listeTransaction, listeBudget, b.montantBud)
    return {
      id: b.id,
      nom: b.descriptionBud,
      depense: calcul?.Somme || 0,
      alloue: Number(b.montantBud || 0)
    }
  })

  // Dépense totale globale
  const totalDepenses = budgetDepenses.reduce((acc, curr) => acc + curr.depense, 0)

  // Tri par dépenses décroissantes pour mettre en valeur les plus gros postes
  const budgetsTries = [...budgetDepenses]
    .sort((a, b) => b.depense - a.depense)
    .slice(0, 5) // Top 5 budgets les plus consommateurs

  // Palette harmonieuse de vert/ambre/bleu/ardoise pour les barres
  const COLORS = [
    'bg-[#16a34a]', // Primaire vert
    'bg-emerald-500',
    'bg-teal-600',
    'bg-amber-500',
    'bg-slate-600'
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      
      {/* ── En-tête du graphique ──────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <LuChartPie className="text-emerald-600" aria-hidden="true" />
          <span>Répartition des dépenses</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Top des budgets les plus consommateurs
        </p>
      </div>

      {/* ── Contenu du graphique ──────────────────────────── */}
      {totalDepenses === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400">
          <LuInfo className="text-3xl mb-2 text-slate-300" aria-hidden="true" />
          <p className="text-sm font-medium">Aucune dépense enregistrée à ce jour.</p>
          <p className="text-xs text-slate-400 mt-1">Vos graphiques apparaîtront dès votre première transaction.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgetsTries.map((item, index) => {
            const partRelative = totalDepenses > 0 
              ? Math.round((item.depense / totalDepenses) * 100) 
              : 0
            const barBg = COLORS[index % COLORS.length]

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${barBg} shrink-0`} aria-hidden="true" />
                    <span className="font-semibold text-slate-800 capitalize truncate">
                      {item.nom}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-slate-900">
                      {item.depense.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-slate-400 font-medium">
                      ({partRelative}%)
                    </span>
                  </div>
                </div>

                {/* Barre comparative proportionnelle */}
                <div 
                  className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={partRelative}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.nom}: ${partRelative}% des dépenses totales`}
                >
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                    style={{ width: `${Math.min(100, Math.max(0, partRelative))}%` }}
                  />
                </div>
              </div>
            )
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total dépensé :</span>
            <strong className="text-slate-900 font-bold">
              {totalDepenses.toLocaleString('fr-FR')} FCFA
            </strong>
          </div>
        </div>
      )}

    </div>
  )
}
