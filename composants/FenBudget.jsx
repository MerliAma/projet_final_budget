"use client"
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

// Composants modulaires du Lot 5
import BudgetHeader from './budget/BudgetHeader'
import BudgetSummary from './budget/BudgetSummary'
import BudgetCard from './budget/BudgetCard'
import BudgetModal from './budget/BudgetModal'
import ConfirmDeleteBudgetModal from './budget/ConfirmDeleteBudgetModal'
import BudgetEmptyState from './budget/BudgetEmptyState'
import BudgetSkeleton from './budget/BudgetSkeleton'
import BudgetErrorState from './budget/BudgetErrorState'
import ToastNotification from './ui/ToastNotification'

/**
 * FenBudget — Refonte complète de la gestion des budgets (Lot 5)
 * Préserve intégralement les props { listeBudget, setListeBudget, listeTransaction, setListeTransaction }
 * et la logique métier financière.
 */
export default function FenBudget({
  listeBudget = [],
  setListeBudget,
  listeTransaction = [],
  setListeTransaction,
}) {
  const [idUserConnecte, setIdUserConnecte] = useState(() => {
    if (typeof window !== 'undefined') {
      return RecupInfosUserConnecte()?.idUser || ''
    }
    return ''
  })

  // États de chargement et d'erreur
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // États des modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [budgetToEdit, setBudgetToEdit] = useState(null)
  const [budgetToDelete, setBudgetToDelete] = useState(null)

  // Notification Toast
  const [toast, setToast] = useState(null) // { type: 'success' | 'error', message: string }

  // Initialisation de l'utilisateur connecté
  useEffect(() => {
    if (typeof window === 'undefined') return
    const infos = RecupInfosUserConnecte()
    if (infos?.idUser) {
      setIdUserConnecte(String(infos.idUser))
    }
  }, [])

  // Récupération des données depuis l'API backend
  const GetBudgetTrans = useCallback(async (isManualRefresh = false) => {
    const currentId = idUserConnecte || (typeof window !== 'undefined' ? RecupInfosUserConnecte()?.idUser : '')
    if (!currentId) return

    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setHasError(false)
    setErrorMessage('')

    try {
      const [reqBudgets, reqTransactions] = await Promise.all([
        axios.get('/server/budget/get-all'),
        axios.get('/server/transaction/get-all'),
      ])

      if (reqBudgets?.data?.budgets) {
        const tousLesBudgets = reqBudgets.data.budgets
        const budgetsUtilisateur = tousLesBudgets.filter(
          (b) => String(b?.idUser || '').trim() === String(currentId).trim()
        )
        setListeBudget(budgetsUtilisateur)
      } else if (reqBudgets?.data?.error || reqBudgets?.data?.message) {
        setHasError(true)
        setErrorMessage(reqBudgets?.data?.message || 'Erreur lors du chargement des budgets.')
      }

      if (reqTransactions?.data?.transactions) {
        setListeTransaction(reqTransactions.data.transactions)
      }
    } catch (error) {
      const errDetail = error?.response?.data?.message || error?.response?.data?.error || error?.message
      setHasError(true)
      setErrorMessage(
        typeof errDetail === 'string'
          ? errDetail
          : 'Impossible de joindre le serveur. Vérifiez votre connexion.'
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [idUserConnecte, setListeBudget, setListeTransaction])

  // Chargement automatique dès que l'ID utilisateur est prêt
  useEffect(() => {
    if (idUserConnecte) {
      GetBudgetTrans(false)
    }
  }, [idUserConnecte, GetBudgetTrans])

  // Gestionnaires de modales
  const handleOpenCreate = () => {
    setBudgetToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (budget) => {
    setBudgetToEdit(budget)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setBudgetToEdit(null)
  }

  // Succès de création ou modification
  const handleModalSuccess = (savedBudget, isEdit) => {
    if (isEdit) {
      setListeBudget((prev) =>
        prev.map((b) => (b.id === savedBudget.id ? savedBudget : b))
      )
      setToast({
        type: 'success',
        message: `Le budget "${savedBudget.descriptionBud}" a été modifié avec succès.`,
      })
    } else {
      setListeBudget((prev) => [...prev, savedBudget])
      setToast({
        type: 'success',
        message: `Le budget "${savedBudget.descriptionBud}" a été créé avec succès.`,
      })
    }
  }

  // Succès de suppression
  const handleDeleteSuccess = (deletedBudgetId, deletedTransIds = []) => {
    setListeBudget((prev) => prev.filter((b) => b.id !== deletedBudgetId))
    if (deletedTransIds.length > 0) {
      setListeTransaction((prev) =>
        prev.filter((t) => !deletedTransIds.includes(t.id))
      )
    }
    setToast({
      type: 'success',
      message: 'Budget et transactions associées supprimés avec succès.',
    })
  }

  // ── Affichage de l'état de chargement (Skeleton) ──────────
  if (isLoading && (!listeBudget || listeBudget.length === 0)) {
    return (
      <div className="w-full">
        <button className="hidden" onClick={() => GetBudgetTrans(false)} id="RemplirBudTrans" />
        <BudgetSkeleton />
      </div>
    )
  }

  // ── Affichage de l'état d'erreur critique ─────────────────
  if (hasError && (!listeBudget || listeBudget.length === 0)) {
    return (
      <div className="w-full">
        <button className="hidden" onClick={() => GetBudgetTrans(false)} id="RemplirBudTrans" />
        <BudgetErrorState
          message={errorMessage}
          onRetry={() => GetBudgetTrans(false)}
          isRetrying={isLoading}
        />
      </div>
    )
  }

  const hasBudgets = listeBudget && listeBudget.length > 0

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Bouton masqué préservé pour compatibilité éventuelle */}
      <button className="hidden" onClick={() => GetBudgetTrans(false)} id="RemplirBudTrans" />

      {/* 1. En-tête de la page */}
      <BudgetHeader
        onOpenCreate={handleOpenCreate}
        onRefresh={() => GetBudgetTrans(true)}
        isRefreshing={isRefreshing}
      />

      {/* 2. Résumé des KPIs budgétaires */}
      {hasBudgets && (
        <BudgetSummary
          listeBudget={listeBudget}
          listeTransaction={listeTransaction}
        />
      )}

      {/* 3. Grille des cartes de budgets ou État vide */}
      {hasBudgets ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Toutes les enveloppes budgétaires ({listeBudget.length})
            </h2>
            <span className="text-xs text-slate-400">
              Classées par date de création
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {listeBudget.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                listeTransaction={listeTransaction}
                listeBudget={listeBudget}
                onEdit={handleOpenEdit}
                onDelete={(b) => setBudgetToDelete(b)}
              />
            ))}
          </div>
        </div>
      ) : (
        <BudgetEmptyState onOpenCreate={handleOpenCreate} />
      )}

      {/* 4. Modale de création / modification */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        budgetToEdit={budgetToEdit}
        onSuccess={handleModalSuccess}
      />

      {/* 5. Boîte de confirmation de suppression */}
      <ConfirmDeleteBudgetModal
        isOpen={Boolean(budgetToDelete)}
        onClose={() => setBudgetToDelete(null)}
        budget={budgetToDelete}
        onSuccess={handleDeleteSuccess}
      />

      {/* 6. Notifications Toast */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
