"use client"
import React from 'react'
import Link from 'next/link'
import { 
  LuCircleCheck, 
  LuInfo, 
  LuTriangleAlert, 
  LuEye, 
  LuPencil, 
  LuTrash2, 
  LuCalendar,
  LuArrowUpRight 
} from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * BudgetCard — Carte individuelle d'un budget
 * Présente le statut multi-critères, les montants, la progression ARIA et les actions
 */
export default function BudgetCard({ 
  budget, 
  listeTransaction = [], 
  listeBudget = [], 
  onEdit, 
  onDelete 
}) {
  if (!budget) return null

  // Calculs via la fonction métier SommeTransactions
  const calculs = SommeTransactions(budget.id, listeTransaction, listeBudget, budget.montantBud)
  const depense = calculs?.Somme || 0
  const alloue = Number(budget.montantBud || 0)
  const reste = alloue - depense
  const nbTransactions = calculs?.Nbr || 0
  const pourcentage = alloue > 0 ? Math.round((depense / alloue) * 100) : 0

  // Statut multi-critères (Couleur + Icône + Texte explicite)
  let statusConfig = {
    label: 'Sous contrôle',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'bg-[#16a34a]',
    icon: LuCircleCheck,
    description: 'Dépenses maîtrisées',
  }

  if (pourcentage > 100) {
    statusConfig = {
      label: 'Dépassé',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      barColor: 'bg-red-600',
      icon: LuTriangleAlert,
      description: `Dépassement de ${(depense - alloue).toLocaleString('fr-FR')} FCFA`,
    }
  } else if (pourcentage >= 90) {
    statusConfig = {
      label: 'Presque épuisé',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      barColor: 'bg-orange-500',
      icon: LuTriangleAlert,
      description: 'Moins de 10% restants',
    }
  } else if (pourcentage >= 70) {
    statusConfig = {
      label: 'À surveiller',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      barColor: 'bg-amber-500',
      icon: LuInfo,
      description: 'Rythme élevé',
    }
  }

  const StatusIcon = statusConfig.icon
  const moisFormate = budget.moisBud 
    ? new Date(budget.moisBud).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group">
      <div>
        {/* ── En-tête de la carte : Titre, Mois et Badge Statut ──── */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <Link 
              href={`/LeBudget/${budget.id}`}
              className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors capitalize truncate block"
              title={`Voir le détail de ${budget.descriptionBud}`}
            >
              {budget.descriptionBud}
            </Link>
            {moisFormate && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 capitalize mt-0.5">
                <LuCalendar className="text-xs" aria-hidden="true" />
                <span>{moisFormate}</span>
              </span>
            )}
          </div>

          {/* Badge multi-critères */}
          <div className="shrink-0">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}>
              <StatusIcon className="text-xs shrink-0" aria-hidden="true" />
              <span>{statusConfig.label}</span>
            </span>
          </div>
        </div>

        {/* ── Bloc Chiffré Principal ────────────────────────── */}
        <div className="bg-slate-50 rounded-xl p-3.5 mb-4 border border-slate-100">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">Budget alloué</span>
            <span className="text-xs font-medium text-slate-500">
              {nbTransactions} opération{nbTransactions > 1 ? 's' : ''}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {alloue.toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-semibold text-slate-400">FCFA</span>
          </div>
        </div>

        {/* ── Progression et Pourcentage ────────────────────── */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Consommation</span>
            <span className="font-bold text-slate-800">{pourcentage} %</span>
          </div>

          <div 
            className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden"
            role="progressbar"
            aria-valuenow={pourcentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Utilisation du budget ${budget.descriptionBud} : ${pourcentage}%`}
          >
            <div 
              className={`h-full rounded-full transition-all duration-500 ${statusConfig.barColor}`}
              style={{ width: `${Math.min(100, Math.max(0, pourcentage))}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400 text-right">
            {statusConfig.description}
          </div>
        </div>

        {/* ── Détails Dépensé vs Restant ────────────────────── */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/70 rounded-xl text-xs mb-4">
          <div>
            <span className="text-slate-500 block text-[11px]">Dépensé</span>
            <strong className="text-red-600 font-bold text-sm">
              {depense.toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-slate-400">FCFA</span>
            </strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block text-[11px]">Restant</span>
            <strong className={`font-bold text-sm ${reste >= 0 ? 'text-[#16a34a]' : 'text-red-600'}`}>
              {reste.toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-slate-400">FCFA</span>
            </strong>
          </div>
        </div>
      </div>

      {/* ── Actions de la Carte ────────────────────────────── */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link 
          href={`/LeBudget/${budget.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline py-1.5 px-2 rounded-lg hover:bg-emerald-50 transition-colors"
          title="Consulter les détails et dépenses"
        >
          <LuEye className="text-sm" aria-hidden="true" />
          <span>Détails</span>
          <LuArrowUpRight className="text-xs" aria-hidden="true" />
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit && onEdit(budget)}
            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Modifier ce budget"
            aria-label={`Modifier le budget ${budget.descriptionBud}`}
          >
            <LuPencil className="text-sm" />
          </button>

          <button
            type="button"
            onClick={() => onDelete && onDelete(budget)}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Supprimer ce budget"
            aria-label={`Supprimer le budget ${budget.descriptionBud}`}
          >
            <LuTrash2 className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}
