"use client"
import React from 'react'
import { 
  LuTrendingDown, 
  LuPiggyBank, 
  LuWallet, 
  LuShieldCheck, 
  LuReceipt,
  LuArrowDownRight,
  LuTriangleAlert,
  LuCircleCheck,
  LuInfo
} from 'react-icons/lu'

/**
 * StatsKPIs — Cartes de synthèse financière pour la page Statistiques
 * Affiche les 4 indicateurs fondamentaux ainsi que des métriques d'activité clés.
 */
export default function StatsKPIs({
  totalAlloue = 0,
  totalDepense = 0,
  nombreBudgets = 0,
  nombreTransactions = 0,
  depenseMoyenne = 0,
  budgetLePlusDepense = null,
}) {
  const soldeRestant = totalAlloue - totalDepense
  const tauxConsommation = totalAlloue > 0 
    ? Math.round((totalDepense / totalAlloue) * 100) 
    : 0
  const tauxMarge = totalAlloue > 0
    ? Math.round((soldeRestant / totalAlloue) * 100)
    : 0

  // Statut qualitatif de santé budgétaire
  let santeConfig = {
    label: 'Budget équilibré',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: LuCircleCheck,
    colorClass: 'text-emerald-700',
    barColor: 'bg-[#16a34a]',
    description: 'Vos dépenses sont parfaitement maîtrisées',
  }

  if (soldeRestant < 0) {
    santeConfig = {
      label: 'Déficit budgétaire',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      icon: LuTriangleAlert,
      colorClass: 'text-red-700',
      barColor: 'bg-red-600',
      description: 'Dépassement de votre enveloppe globale',
    }
  } else if (tauxConsommation >= 90) {
    santeConfig = {
      label: 'Seuil critique',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: LuTriangleAlert,
      colorClass: 'text-orange-700',
      barColor: 'bg-orange-500',
      description: 'Moins de 10% de marge financière restante',
    }
  } else if (tauxConsommation >= 70) {
    santeConfig = {
      label: 'Sous surveillance',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: LuInfo,
      colorClass: 'text-amber-700',
      barColor: 'bg-amber-500',
      description: 'Rythme de dépense soutenu',
    }
  }

  const SanteIcon = santeConfig.icon

  return (
    <div className="space-y-4">
      {/* ── 4 Cartes KPI Principales ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1 : Dépenses Totales */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Dépenses totales
              </span>
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <LuTrendingDown className="text-lg" aria-hidden="true" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {totalDepense.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-semibold text-slate-400">FCFA</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Part consommée :</span>
            <span className="font-bold text-slate-800">
              {tauxConsommation} %
            </span>
          </div>
        </div>

        {/* KPI 2 : Budget Total Alloué */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Budget alloué
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <LuPiggyBank className="text-lg" aria-hidden="true" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {totalAlloue.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-semibold text-slate-400">FCFA</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Enveloppes actives :</span>
            <span className="font-bold text-slate-800">
              {nombreBudgets} budget{nombreBudgets > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* KPI 3 : Solde Restant Net */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Solde restant
              </span>
              <div className={`p-2 rounded-xl ${soldeRestant >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <LuWallet className="text-lg" aria-hidden="true" />
              </div>
            </div>

            <div className={`text-2xl sm:text-3xl font-black tracking-tight ${soldeRestant >= 0 ? 'text-[#16a34a]' : 'text-red-600'}`}>
              {soldeRestant.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-semibold text-slate-400">FCFA</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Marge disponible :</span>
            <span className={`font-bold ${soldeRestant >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
              {tauxMarge > 0 ? `+${tauxMarge}` : tauxMarge} %
            </span>
          </div>
        </div>

        {/* KPI 4 : Santé & Taux de Maîtrise */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Santé budgétaire
              </span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <LuShieldCheck className="text-lg" aria-hidden="true" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${santeConfig.badgeClass}`}>
                <SanteIcon className="text-xs" aria-hidden="true" />
                <span>{santeConfig.label}</span>
              </span>
            </div>

            {/* Barre de santé */}
            <div className="mt-3">
              <div 
                className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.min(100, Math.max(0, tauxConsommation))}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Consommation budgétaire : ${tauxConsommation}%`}
              >
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${santeConfig.barColor}`}
                  style={{ width: `${Math.min(100, Math.max(0, tauxConsommation))}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 truncate">
            {santeConfig.description}
          </div>
        </div>

      </div>

      {/* ── Cartes d'activité secondaires ──────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Opérations totales */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-200/60 text-slate-600">
              <LuReceipt className="text-base" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total opérations</span>
              <strong className="text-base font-bold text-slate-900">
                {nombreTransactions} transaction{nombreTransactions > 1 ? 's' : ''}
              </strong>
            </div>
          </div>
        </div>

        {/* Dépense moyenne */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-slate-200/60 text-slate-600">
              <LuArrowDownRight className="text-base" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Dépense moyenne</span>
              <strong className="text-base font-bold text-slate-900">
                {Math.round(depenseMoyenne).toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-400">FCFA</span>
              </strong>
            </div>
          </div>
        </div>

        {/* Budget le plus dépensé */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-white rounded-lg border border-slate-200/60 text-emerald-600 shrink-0">
              <LuPiggyBank className="text-base" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-slate-500 font-medium block">Poste principal</span>
              <strong className="text-base font-bold text-slate-900 truncate block capitalize" title={budgetLePlusDepense?.nom || 'Aucun'}>
                {budgetLePlusDepense ? budgetLePlusDepense.nom : '—'}
              </strong>
            </div>
          </div>
          {budgetLePlusDepense && (
            <span className="text-xs font-bold text-red-600 shrink-0">
              {budgetLePlusDepense.depense.toLocaleString('fr-FR')} FCFA
            </span>
          )}
        </div>

      </div>
    </div>
  )
}
