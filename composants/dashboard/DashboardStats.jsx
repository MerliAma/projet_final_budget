"use client"
import React from 'react'
import { 
  LuWallet, 
  LuTrendingDown, 
  LuPiggyBank, 
  LuCircleCheck, 
  LuTriangleAlert,
  LuPercent
} from 'react-icons/lu'

/**
 * DashboardStats — Section des KPIs principaux
 * 
 * Hiérarchie respectée :
 * 1. Montant Disponible (Priorité n°1)
 * 2. Montant Dépensé (Priorité n°2)
 * 3. Budget Total (Priorité n°3)
 * 4. Taux de respect budgétaire (Priorité n°4, calculé dynamiquement — résout le bug 0% de l'ancien code)
 */
export default function DashboardStats({ totalAlloue = 0, totalDepense = 0, nombreBudgets = 0 }) {
  const totalDisponible = totalAlloue - totalDepense

  // Taux de consommation (%)
  const tauxConsommation = totalAlloue > 0 
    ? Math.round((totalDepense / totalAlloue) * 100) 
    : 0

  // Taux restant (%)
  const tauxRestant = totalAlloue > 0 
    ? Math.max(0, Math.round((totalDisponible / totalAlloue) * 100)) 
    : 0

  // Statut de santé budgétaire global
  let healthConfig = {
    label: 'Équilibré',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: LuCircleCheck,
    text: `${tauxRestant}% restant`
  }

  if (totalDisponible < 0) {
    healthConfig = {
      label: 'Dépassement',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      icon: LuTriangleAlert,
      text: `Déficit de ${Math.abs(totalDisponible).toLocaleString('fr-FR')} FCFA`
    }
  } else if (tauxConsommation >= 90) {
    healthConfig = {
      label: 'Seuil critique',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: LuTriangleAlert,
      text: `${tauxRestant}% disponible`
    }
  } else if (tauxConsommation >= 75) {
    healthConfig = {
      label: 'À surveiller',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: LuTriangleAlert,
      text: `${tauxRestant}% disponible`
    }
  }

  const HealthIcon = healthConfig.icon

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      
      {/* ── KPI 1 : Montant Disponible (Priorité n°1) ────────── */}
      <div className={`
        relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md
        ${totalDisponible >= 0 
          ? 'bg-gradient-to-br from-emerald-500/10 via-white to-white border-emerald-200/80' 
          : 'bg-gradient-to-br from-red-500/10 via-white to-white border-red-200/80'
        }
      `}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Montant disponible
          </span>
          <div className={`p-2 rounded-xl text-white ${totalDisponible >= 0 ? 'bg-[#16a34a]' : 'bg-red-600'}`}>
            <LuWallet className="text-base" aria-hidden="true" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${totalDisponible >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            {totalDisponible.toLocaleString('fr-FR')}
          </span>
          <span className="text-xs font-semibold text-slate-400">FCFA</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border ${
            totalDisponible >= 0 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <HealthIcon className="text-xs" aria-hidden="true" />
            {totalDisponible >= 0 ? 'Solde positif' : 'Budget dépassé'}
          </span>
        </div>
      </div>

      {/* ── KPI 2 : Montant Dépensé (Priorité n°2) ───────────── */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total dépensé
          </span>
          <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <LuTrendingDown className="text-base" aria-hidden="true" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalDepense.toLocaleString('fr-FR')}
          </span>
          <span className="text-xs font-semibold text-slate-400">FCFA</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
            {tauxConsommation}% consommé
          </span>
        </div>
      </div>

      {/* ── KPI 3 : Budget Total Alloué (Priorité n°3) ───────── */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Budget total alloué
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <LuPiggyBank className="text-base" aria-hidden="true" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalAlloue.toLocaleString('fr-FR')}
          </span>
          <span className="text-xs font-semibold text-slate-400">FCFA</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
            {nombreBudgets} budget{nombreBudgets > 1 ? 's' : ''} actif{nombreBudgets > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── KPI 4 : Taux de Maîtrise Budgétaire (Priorité n°4) ─ */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Santé budgétaire
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <LuPercent className="text-base" aria-hidden="true" />
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalAlloue > 0 ? `${100 - Math.min(100, tauxConsommation)} %` : '—'}
          </span>
          <span className="text-xs font-semibold text-slate-400">marge</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border ${healthConfig.badgeClass}`}>
            <HealthIcon className="text-xs" aria-hidden="true" />
            {healthConfig.label}
          </span>
        </div>
      </div>

    </div>
  )
}
