"use client"
import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { LuPencil, LuTrash2, LuCalendar, LuTag, LuReceipt, LuArrowUpRight } from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'
import TransactionModal from './transaction/TransactionModal'
import ConfirmDeleteTransactionModal from './transaction/ConfirmDeleteTransactionModal'
import ToastNotification from './ui/ToastNotification'

/**
 * TableTrans — Tableau et liste responsive des transactions
 * Utilisé notamment dans la vue de détail /LeBudget/[id].
 * Préserve intégralement les props { listeBudFiltre, listeTransaction, setListeTransaction, listeBudget, setListeBudget, fenConcerne }
 */
function TableTrans({
  listeBudFiltre = [],
  listeTransaction = [],
  setListeTransaction,
  listeBudget = [],
  setListeBudget,
  fenConcerne = '',
}) {
  const [transModif, setTransModif] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [transToDelete, setTransToDelete] = useState(null)
  const [toast, setToast] = useState(null)

  // Filtrage des transactions pour les budgets ciblés
  const budgetsIds = new Set((listeBudFiltre || []).map((b) => String(b.id)))
  const transactionsAffichees = (listeTransaction || []).filter((t) =>
    budgetsIds.has(String(t.budgetTrans))
  )

  // Tri par date décroissante
  transactionsAffichees.sort((a, b) => {
    const dateA = a.dateEnrg ? new Date(a.dateEnrg).getTime() : 0
    const dateB = b.dateEnrg ? new Date(b.dateEnrg).getTime() : 0
    return dateB - dateA
  })

  // Gestionnaires d'actions
  const handleOpenEdit = (trans) => {
    setTransModif(trans)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = (savedTrans) => {
    setListeTransaction((prev) =>
      prev.map((t) => (t.id === savedTrans.id ? savedTrans : t))
    )
    setToast({
      type: 'success',
      message: 'Transaction mise à jour avec succès.',
    })
  }

  const handleDeleteSuccess = (deletedId) => {
    setListeTransaction((prev) => prev.filter((t) => t.id !== deletedId))
    setToast({
      type: 'success',
      message: 'Transaction supprimée avec succès.',
    })
  }

  if (transactionsAffichees.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center shadow-xs">
        <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <LuReceipt className="text-2xl" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">
          Aucune transaction pour ce budget
        </h4>
        <p className="text-xs text-slate-500">
          Enregistrez une nouvelle dépense à gauche pour commencer le suivi.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ── Rendu Desktop & Tablette (md+) : Tableau ───────── */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th scope="col" className="py-3.5 pl-6 pr-3">N°</th>
                <th scope="col" className="py-3.5 px-3">Date</th>
                <th scope="col" className="py-3.5 px-3">Description</th>
                <th scope="col" className="py-3.5 px-3 text-right">Montant</th>
                <th scope="col" className="py-3.5 px-3">Budget</th>
                <th scope="col" className="py-3.5 px-3 text-right">Reste</th>
                <th scope="col" className="py-3.5 pr-6 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="TableTrans" className="divide-y divide-slate-100 text-xs sm:text-sm">
              {transactionsAffichees.map((trans, index) => {
                const leBudget = listeBudget.find((b) => String(b.id) === String(trans.budgetTrans))
                const reste = leBudget 
                  ? SommeTransactions(leBudget.id, listeTransaction, listeBudget, leBudget.montantBud).reste 
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
                  <tr key={trans.id || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-6 pr-3 text-xs font-semibold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600 text-xs">
                      {dateFormatee}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900 capitalize">
                      {trans.descriptionTrans}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-black text-red-600">
                      -{montant.toLocaleString('fr-FR')}{' '}
                      <span className="text-[10px] font-semibold text-slate-400">FCFA</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {leBudget ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                          {leBudget.descriptionBud}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-bold text-xs">
                      <span className={reste >= 0 ? 'text-[#16a34a]' : 'text-red-600'}>
                        {reste.toLocaleString('fr-FR')} FCFA
                      </span>
                    </td>
                    <td className="py-3.5 pr-6 pl-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(trans)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Modifier"
                          aria-label={`Modifier ${trans.descriptionTrans}`}
                        >
                          <LuPencil className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransToDelete(trans)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
                          aria-label={`Supprimer ${trans.descriptionTrans}`}
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

      {/* ── Rendu Mobile (< md) : Cartes d'opérations ──────── */}
      <div className="md:hidden space-y-3">
        {transactionsAffichees.map((trans) => {
          const leBudget = listeBudget.find((b) => String(b.id) === String(trans.budgetTrans))
          const reste = leBudget 
            ? SommeTransactions(leBudget.id, listeTransaction, listeBudget, leBudget.montantBud).reste 
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
            <div key={trans.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm capitalize">{trans.descriptionTrans}</h4>
                  <span className="text-xs text-slate-400">{dateFormatee}</span>
                </div>
                <div className="font-black text-red-600 text-sm">
                  -{montant.toLocaleString('fr-FR')} FCFA
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500">Reste du budget :</span>
                <strong className={reste >= 0 ? 'text-[#16a34a]' : 'text-red-600'}>
                  {reste.toLocaleString('fr-FR')} FCFA
                </strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(trans)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                  aria-label={`Modifier la dépense ${trans.descriptionTrans}`}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => setTransToDelete(trans)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  aria-label={`Supprimer la dépense ${trans.descriptionTrans}`}
                >
                  Supprimer
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modale de modification */}
      <TransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setTransModif(null)
        }}
        transactionToEdit={transModif}
        listeBudget={listeBudget}
        listeTransaction={listeTransaction}
        onSuccess={handleEditSuccess}
        fenConcerne={fenConcerne}
      />

      {/* Boîte de confirmation de suppression */}
      <ConfirmDeleteTransactionModal
        isOpen={Boolean(transToDelete)}
        onClose={() => setTransToDelete(null)}
        transaction={transToDelete}
        onSuccess={handleDeleteSuccess}
      />

      {/* Toast */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default TableTrans
