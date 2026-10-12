"use client"
import React from 'react'
import { LuSearch, LuFilter, LuX, LuSlidersHorizontal } from 'react-icons/lu'

/**
 * TransactionToolbar — Barre de filtrage et recherche des transactions
 * Permet de filtrer par budget et d'effectuer une recherche textuelle en temps réel
 */
export default function TransactionToolbar({
  listeBudget = [],
  selectedBudget = '',
  onChangeBudget,
  searchQuery = '',
  onChangeSearch,
  totalCount = 0,
  filteredCount = 0,
  onResetFilters,
}) {
  const isFiltered = Boolean(selectedBudget || searchQuery)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* ── Gauche : Recherche textuelle ──────────────────── */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <LuSearch className="text-base" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onChangeSearch && onChangeSearch(e.target.value)}
          placeholder="Rechercher par description..."
          className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
          aria-label="Rechercher une transaction par libellé"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onChangeSearch && onChangeSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Effacer la recherche"
          >
            <LuX className="text-sm" />
          </button>
        )}
      </div>

      {/* ── Droite : Sélecteur de budget & Réinitialisation ─── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sélecteur de budget */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-budget" className="text-xs font-semibold text-slate-600 whitespace-nowrap flex items-center gap-1.5">
            <LuFilter className="text-xs text-slate-400" />
            <span>Budget :</span>
          </label>
          <select
            id="filter-budget"
            value={selectedBudget}
            onChange={(e) => onChangeBudget && onChangeBudget(e.target.value)}
            className="py-2 pl-3 pr-8 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 capitalize cursor-pointer"
          >
            <option value="">Tous les budgets ({listeBudget?.length || 0})</option>
            {listeBudget?.map((budget) => (
              <option key={budget.id} value={budget.id} className="capitalize">
                {budget.descriptionBud}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton de réinitialisation si filtre actif */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Réinitialiser tous les filtres"
          >
            <LuX className="text-xs" />
            <span>Effacer les filtres</span>
          </button>
        )}

        {/* Compteur de résultats */}
        <div className="text-xs text-slate-500 font-medium pl-1 hidden sm:block">
          {filteredCount} sur {totalCount} résultat{totalCount > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
