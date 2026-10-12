"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LuTrash2, LuTriangleAlert, LuX, LuLoader } from 'react-icons/lu'

/**
 * ConfirmDeleteBudgetModal — Dialogue accessible de confirmation de suppression
 * Prévient des répercussions (suppression en cascade des transactions associées)
 */
export default function ConfirmDeleteBudgetModal({
  isOpen,
  onClose,
  budget,
  onSuccess,
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('')
      setIsDeleting(false)
    }
  }, [isOpen])

  // Fermeture via la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isDeleting, onClose])

  if (!isOpen || !budget) return null

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setErrorMessage('')

    try {
      // 1. Récupération des transactions pour suppression en cascade
      const reqTransactions = await axios.get('/server/transaction/get-all')
      let deletedTransactionIds = []

      if (reqTransactions?.data?.transactions) {
        const transLiees = reqTransactions.data.transactions.filter(
          (t) => String(t.budgetTrans) === String(budget.id)
        )
        deletedTransactionIds = transLiees.map((t) => t.id)

        if (deletedTransactionIds.length > 0) {
          await axios.delete('/server/transaction/delete-many', {
            data: { ids: deletedTransactionIds },
          })
        }
      }

      // 2. Suppression du budget
      const reqBudget = await axios.delete(`/server/budget/deleteB/${budget.id}`)

      if (reqBudget?.data?.message === 'Budget supprimé' || reqBudget?.status === 200) {
        onSuccess(budget.id, deletedTransactionIds)
        onClose()
      } else {
        setErrorMessage(reqBudget?.data?.message || 'Erreur lors de la suppression du budget.')
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message
      setErrorMessage(typeof serverMsg === 'string' ? serverMsg : "Une erreur est survenue lors de la suppression.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-md w-full overflow-hidden transition-all">
        
        {/* ── En-tête de la boîte de dialogue ──────────────── */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl shrink-0" aria-hidden="true">
              <LuTrash2 className="text-xl" />
            </div>
            <div>
              <h2 id="confirm-delete-title" className="text-base sm:text-lg font-bold text-slate-900">
                Supprimer ce budget ?
              </h2>
              <p className="text-xs text-slate-500">
                Cette action est irréversible.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Fermer"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* ── Contenu explicatif ────────────────────────────── */}
        <div className="px-6 py-2 space-y-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">Budget ciblé :</div>
            <div className="text-sm font-bold text-slate-900 capitalize mt-0.5">
              {budget.descriptionBud}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Montant alloué : {Number(budget.montantBud || 0).toLocaleString('fr-FR')} FCFA
            </div>
          </div>

          <div id="confirm-delete-desc" className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
            <LuTriangleAlert className="text-base shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
            <div>
              <strong>Attention :</strong> Toutes les transactions rattachées à ce budget seront également définitivement supprimées de votre historique.
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700" role="alert">
              {errorMessage}
            </div>
          )}
        </div>

        {/* ── Actions ───────────────────────────────────────── */}
        <div className="px-6 py-4 mt-2 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 text-slate-700 hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <LuLoader className="text-base animate-spin" />
                <span>Suppression...</span>
              </>
            ) : (
              <span>Supprimer définitivement</span>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
