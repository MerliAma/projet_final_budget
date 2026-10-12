"use client"
import React from 'react'
import Link from 'next/link'
import { LuPencil, LuTrash2, LuCalendar, LuTag, LuCoins, LuArrowUpRight } from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * TransactionTable — Tableau moderne pour écran Desktop et Tablette (md+)
 */
export default function TransactionTable({
  transactions = [],
  listeBudget = [],
  allTransactions = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3.5 pl-6 pr-3">N°</th>
              <th scope="col" className="py-3.5 px-3">Date</th>
              <th scope="col" className="py-3.5 px-3">Description</th>
              <th scope="col" className="py-3.5 px-3">Budget Associé</th>
              <th scope="col" className="py-3.5 px-3 text-right">Montant</th>
              <th scope="col" className="py-3.5 px-3 text-right">Reste Budget</th>
              <th scope="col" className="py-3.5 pr-6 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {transactions.map((trans, index) => {
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
                <tr 
                  key={trans.id || `trans-${index}`}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* N° d'ordre */}
                  <td className="py-3.5 pl-6 pr-3 text-xs font-semibold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <LuCalendar className="text-slate-400 text-xs" aria-hidden="true" />
                      <span>{dateFormatee}</span>
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-3 font-semibold text-slate-900 capitalize max-w-xs truncate">
                    {trans.descriptionTrans}
                  </td>

                  {/* Budget associé */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {budgetAssocie ? (
                      <Link
                        href={`/LeBudget/${budgetAssocie.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors capitalize group/link"
                        title="Voir ce budget"
                      >
                        <LuTag className="text-[10px]" />
                        <span>{budgetAssocie.descriptionBud}</span>
                        <LuArrowUpRight className="text-[10px] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs text-slate-400 bg-slate-100">
                        Non associé
                      </span>
                    )}
                  </td>

                  {/* Montant (en rouge négatif) */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap font-black text-red-600">
                    -{montant.toLocaleString('fr-FR')}{' '}
                    <span className="text-[10px] font-semibold text-slate-400">FCFA</span>
                  </td>

                  {/* Reste disponible du budget */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap text-xs font-semibold">
                    {budgetAssocie ? (
                      <span className={resteBudget >= 0 ? 'text-[#16a34a]' : 'text-red-600'}>
                        {resteBudget.toLocaleString('fr-FR')}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">FCFA</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(trans)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Modifier cette transaction"
                        aria-label={`Modifier la dépense ${trans.descriptionTrans}`}
                      >
                        <LuPencil className="text-base" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete && onDelete(trans)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer cette transaction"
                        aria-label={`Supprimer la dépense ${trans.descriptionTrans}`}
                      >
                        <LuTrash2 className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
