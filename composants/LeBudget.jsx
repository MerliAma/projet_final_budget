"use client"
import React from 'react'
import TableTrans from './TableTrans'
import FormulaireTrans from './FormulaireTrans'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'
import { 
  LuCircleCheck, 
  LuInfo, 
  LuTriangleAlert, 
  LuCalendar, 
  LuReceipt,
  LuPiggyBank 
} from 'react-icons/lu'

/**
 * LeBudget — Vue de détail d'un budget spécifique
 * Présente la carte enrichie du budget, le formulaire d'ajout d'une dépense ciblée,
 * et le tableau des dépenses associées.
 */
function LeBudget({
  idBudget,
  listeBud = [],
  setListeBud,
  listeTransaction = [],
  setListeTransaction,
}) {
  const budgetCourant = listeBud && listeBud.length > 0 ? listeBud[0] : null

  if (!budgetCourant) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-pulse" role="status" aria-label="Chargement des détails du budget...">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-3 w-full bg-slate-200 rounded-full" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs">
            <div className="h-5 w-1/2 bg-slate-200 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-xl" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="h-6 w-1/3 bg-slate-200 rounded-lg" />
          <div className="space-y-3 pt-2">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-50 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // Calculs financiers
  const alloue = Number(budgetCourant.montantBud || 0)
  const calculs = SommeTransactions(budgetCourant.id, listeTransaction, listeBud, alloue)
  const depense = calculs?.Somme || 0
  const reste = alloue - depense
  const nbTransactions = calculs?.Nbr || 0
  const pourcentage = alloue > 0 ? Math.round((depense / alloue) * 100) : 0

  // Statut multi-critères
  let statusConfig = {
    label: 'Sous contrôle',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    barColor: 'bg-[#16a34a]',
    icon: LuCircleCheck,
  }

  if (pourcentage > 100) {
    statusConfig = {
      label: 'Dépassé',
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      barColor: 'bg-red-600',
      icon: LuTriangleAlert,
    }
  } else if (pourcentage >= 90) {
    statusConfig = {
      label: 'Presque épuisé',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
      barColor: 'bg-orange-500',
      icon: LuTriangleAlert,
    }
  } else if (pourcentage >= 70) {
    statusConfig = {
      label: 'À surveiller',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      barColor: 'bg-amber-500',
      icon: LuInfo,
    }
  }

  const StatusIcon = statusConfig.icon
  const moisFormate = budgetCourant.moisBud
    ? new Date(budgetCourant.moisBud).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
      {/* ── Colonne Gauche : Carte Budget + Formulaire Dépense ── */}
      <div className="space-y-6">
        
        {/* Carte détaillée du Budget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Budget sélectionné
              </span>
              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {budgetCourant.descriptionBud}
              </h2>
              {moisFormate && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 capitalize mt-0.5">
                  <LuCalendar className="text-xs" aria-hidden="true" />
                  <span>{moisFormate}</span>
                </div>
              )}
            </div>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass}`}>
              <StatusIcon className="text-xs shrink-0" aria-hidden="true" />
              <span>{statusConfig.label}</span>
            </span>
          </div>

          {/* Montant total alloué */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-xs text-slate-500 block mb-1">Plafond mensuel alloué</span>
            <div className="text-2xl font-black text-slate-900">
              {alloue.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-semibold text-slate-400">FCFA</span>
            </div>
          </div>

          {/* Jauge de progression */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Consommation</span>
              <span className="font-bold text-slate-800">{pourcentage} %</span>
            </div>
            <div
              className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden"
              role="progressbar"
              aria-valuenow={pourcentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progression du budget ${budgetCourant.descriptionBud}`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusConfig.barColor}`}
                style={{ width: `${Math.min(100, Math.max(0, pourcentage))}%` }}
              />
            </div>
          </div>

          {/* Dépensé vs Restant */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/70 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Dépensé</span>
              <strong className="text-red-600 font-bold text-sm">
                {depense.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[11px]">Restant</span>
              <strong className={`font-bold text-sm ${reste >= 0 ? 'text-[#16a34a]' : 'text-red-600'}`}>
                {reste.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center pt-1 border-t border-slate-100">
            {nbTransactions} transaction{nbTransactions > 1 ? 's' : ''} associée{nbTransactions > 1 ? 's' : ''}
          </div>
        </div>

        {/* Formulaire d'ajout rapide pour ce budget */}
        <FormulaireTrans
          listeTransaction={listeTransaction}
          setListeTransaction={setListeTransaction}
          listeBudget={listeBud}
          setListeBudget={setListeBud}
          fenConcerne={`${idBudget}`}
        />

      </div>

      {/* ── Colonne Droite : Tableau des transactions de ce budget ── */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <LuReceipt className="text-emerald-600" />
            <span>Historique des dépenses de ce budget</span>
          </h3>
          <span className="text-xs text-slate-400">
            {nbTransactions} opération{nbTransactions > 1 ? 's' : ''}
          </span>
        </div>

        <TableTrans
          listeBudFiltre={listeBud}
          listeBudget={listeBud}
          listeTransaction={listeTransaction}
          setListeBudget={setListeBud}
          setListeTransaction={setListeTransaction}
          fenConcerne={`${idBudget}`}
        />
      </div>
    </div>
  )
}

export default LeBudget
