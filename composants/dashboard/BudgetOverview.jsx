"use client"
import React from 'react'
import Link from 'next/link'
import { 
  LuArrowUpRight, 
  LuCircleCheck, 
  LuInfo, 
  LuTriangleAlert,
  LuPiggyBank
} from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * BudgetOverview — Vue synthétique des budgets
 * Affiche chaque budget avec son nom, mois, montant alloué, dépensé, restant,
 * une jauge de progression et un indicateur multi-critères (couleur + icône + texte).
 */
export default function BudgetOverview({ listeBudget = [], listeTransaction = [] }) {
  if (!listeBudget || listeBudget.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      
      {/* ── En-tête de section ────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <LuPiggyBank className="text-emerald-600" aria-hidden="true" />
            <span>Synthèse des budgets</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Consommation et montants restants par catégorie
          </p>
        </div>

        <Link
          href="/Budget"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          <span>Gérer les budgets</span>
          <LuArrowUpRight className="text-sm" aria-hidden="true" />
        </Link>
      </div>

      {/* ── Liste des budgets ─────────────────────────────── */}
      <div className="space-y-4">
        {listeBudget.map((budget) => {
          // Calcul des montants via la fonction métier existante SommeTransactions
          const calculs = SommeTransactions(budget.id, listeTransaction, listeBudget, budget.montantBud)
          const depense = calculs?.Somme || 0
          const alloue = Number(budget.montantBud || 0)
          const reste = alloue - depense
          const pourcentage = alloue > 0 ? Math.round((depense / alloue) * 100) : 0

          // Détermination de l'état budgétaire multi-critères (Couleur + Icône + Texte)
          let statusConfig = {
            label: 'Sous contrôle',
            colorBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            barColor: 'bg-[#16a34a]',
            icon: LuCircleCheck,
          }

          if (pourcentage > 100) {
            statusConfig = {
              label: 'Dépassé',
              colorBadge: 'bg-red-50 text-red-700 border-red-200',
              barColor: 'bg-red-600',
              icon: LuTriangleAlert,
            }
          } else if (pourcentage >= 90) {
            statusConfig = {
              label: 'Presque épuisé',
              colorBadge: 'bg-orange-50 text-orange-700 border-orange-200',
              barColor: 'bg-orange-500',
              icon: LuTriangleAlert,
            }
          } else if (pourcentage >= 70) {
            statusConfig = {
              label: 'À surveiller',
              colorBadge: 'bg-amber-50 text-amber-700 border-amber-200',
              barColor: 'bg-amber-500',
              icon: LuInfo,
            }
          }

          const StatusIcon = statusConfig.icon
          const moisFormate = budget.moisBud 
            ? new Date(budget.moisBud).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            : ''

          return (
            <div 
              key={budget.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                
                {/* Nom du budget et mois */}
                <div className="flex items-center gap-2 min-w-0">
                  <Link 
                    href={`/LeBudget/${budget.id}`}
                    className="font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 hover:underline capitalize truncate"
                  >
                    {budget.descriptionBud}
                  </Link>
                  {moisFormate && (
                    <span className="text-xs text-slate-400 capitalize shrink-0">
                      • {moisFormate}
                    </span>
                  )}
                </div>

                {/* Badge d'état multi-critères (Icône + Texte + Couleur) */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.colorBadge}`}>
                    <StatusIcon className="text-xs shrink-0" aria-hidden="true" />
                    <span>{statusConfig.label}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {pourcentage} %
                  </span>
                </div>

              </div>

              {/* Barre de progression avec attributs ARIA pour accessibilité */}
              <div 
                className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-2.5"
                role="progressbar"
                aria-valuenow={pourcentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progression du budget ${budget.descriptionBud}`}
              >
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${statusConfig.barColor}`}
                  style={{ width: `${Math.min(100, Math.max(0, pourcentage))}%` }}
                />
              </div>

              {/* Détails financiers : Alloué, Dépensé, Reste */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                <div>
                  <span>Alloué : </span>
                  <strong className="text-slate-700">{alloue.toLocaleString('fr-FR')} FCFA</strong>
                </div>
                <div>
                  <span>Dépensé : </span>
                  <strong className="text-red-600">{depense.toLocaleString('fr-FR')} FCFA</strong>
                </div>
                <div>
                  <span>Reste : </span>
                  <strong className={reste >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                    {reste.toLocaleString('fr-FR')} FCFA
                  </strong>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
