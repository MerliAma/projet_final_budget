"use client"
import React from 'react'
import Link from 'next/link'
import { LuPencil, LuTrash2, LuCalendar, LuTag } from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * TransactionCard — Carte individuelle pour mobile (< md)
 * Évite tout débordement horizontal et offre de grands points d'interaction
 */
export default function TransactionCard({
  trans,
  listeBudget = [],
  allTransactions = [],
  onEdit,
  onDelete,
}) {
  const budgetAssocie = listeBudget.find(
    (b) => String(b.id) === String(trans.budgetTrans)
  )
  const resteBudget = budgetAssocie 
    ? SommeTransactions(budgetAssocie.id, allTransactions, listeBudget, budgetAssocie.montantBud).reste
    : 0

  const dateFormatee = trans.dateEnrg 
    ? new Date(trans.dateEnrg).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

  const montant = Number(trans.montantTrans || 0)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      {/* ── Ligne 1 : Description & Montant ───────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 text-sm capitalize truncate">
            {trans.descriptionTrans}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <LuCalendar className="text-xs" aria-hidden="true" />
            <span>{dateFormatee}</span>
          </span>
        </div>

        <div className="text-right shrink-0">
          <div className="font-black text-red-600 text-base">
            -{montant.toLocaleString('fr-FR')}{' '}
            <span className="text-[10px] font-semibold text-slate-400">FCFA</span>
          </div>
        </div>
      </div>

      {/* ── Ligne 2 : Budget associé & Solde restant ───────── */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <div>
          {budgetAssocie ? (
            <Link
              href={`/LeBudget/${budgetAssocie.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize"
            >
              <LuTag className="text-[10px]" />
              <span>{budgetAssocie.descriptionBud}</span>
            </Link>
          ) : (
            <span className="text-slate-400">Budget non associé</span>
          )}
        </div>

        {budgetAssocie && (
          <div className="text-right text-xs">
            <span className="text-slate-400">Reste : </span>
            <strong className={resteBudget >= 0 ? 'text-[#16a34a]' : 'text-red-600'}>
              {resteBudget.toLocaleString('fr-FR')} FCFA
            </strong>
          </div>
        )}
      </div>

      {/* ── Ligne 3 : Actions tactiles ────────────────────── */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onEdit && onEdit(trans)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          aria-label={`Modifier la transaction ${trans.descriptionTrans}`}
        >
          <LuPencil className="text-xs" />
          <span>Modifier</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete && onDelete(trans)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
          aria-label={`Supprimer la transaction ${trans.descriptionTrans}`}
        >
          <LuTrash2 className="text-xs" />
          <span>Supprimer</span>
        </button>
      </div>
    </div>
  )
}
