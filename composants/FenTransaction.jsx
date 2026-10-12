"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'

// Composants modulaires du Lot 6
import TransactionHeader from './transaction/TransactionHeader'
import TransactionSummary from './transaction/TransactionSummary'
import TransactionToolbar from './transaction/TransactionToolbar'
import TransactionTable from './transaction/TransactionTable'
import TransactionCard from './transaction/TransactionCard'
import TransactionModal from './transaction/TransactionModal'
import ConfirmDeleteTransactionModal from './transaction/ConfirmDeleteTransactionModal'
import TransactionEmptyState from './transaction/TransactionEmptyState'
import TransactionSkeleton from './transaction/TransactionSkeleton'
import TransactionErrorState from './transaction/TransactionErrorState'
import ToastNotification from './ui/ToastNotification'

/**
 * FenTransaction — Refonte complète de la gestion des transactions (Lot 6)
 * Préserve intégralement les props { listeTransaction, setListeTransaction, listeBudget, setListeBudget }
 * et assure un double rendu responsive fluide (table desktop, cartes mobile).
 */
export default function FenTransaction({
  listeTransaction = [],
  setListeTransaction,
  listeBudget = [],
  setListeBudget,
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

  // Filtre et recherche
  const [selectedBudget, setSelectedBudget] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState(null)
  const [transactionToDelete, setTransactionToDelete] = useState(null)

  // Notification Toast
  const [toast, setToast] = useState(null)

  // Initialisation utilisateur
  useEffect(() => {
    if (typeof window === 'undefined') return
    const infos = RecupInfosUserConnecte()
    if (infos?.idUser) {
      setIdUserConnecte(String(infos.idUser))
    }
  }, [])

  // Récupération des données API
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
          : 'Impossible de récupérer vos données. Veuillez réessayer.'
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [idUserConnecte, setListeBudget, setListeTransaction])

  // Déclenchement automatique au chargement
  useEffect(() => {
    if (idUserConnecte) {
      GetBudgetTrans(false)
    }
  }, [idUserConnecte, GetBudgetTrans])

  // Filtrage des transactions appartenant uniquement aux budgets de l'utilisateur connecté
  const userBudgetIdSet = useMemo(() => {
    return new Set((listeBudget || []).map((b) => String(b.id)))
  }, [listeBudget])

  const userTransactions = useMemo(() => {
    return (listeTransaction || []).filter((t) =>
      userBudgetIdSet.has(String(t?.budgetTrans))
    )
  }, [listeTransaction, userBudgetIdSet])

  // Application des filtres (budget + recherche texte) et tri chronologique descendant
  const filteredTransactions = useMemo(() => {
    let result = [...userTransactions]

    // Filtre par budget
    if (selectedBudget) {
      result = result.filter((t) => String(t.budgetTrans) === String(selectedBudget))
    }

    // Filtre par texte
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter((t) =>
        (t.descriptionTrans || '').toLowerCase().includes(query)
      )
    }

    // Tri par date décroissante
    result.sort((a, b) => {
      const dateA = a.dateEnrg ? new Date(a.dateEnrg).getTime() : 0
      const dateB = b.dateEnrg ? new Date(b.dateEnrg).getTime() : 0
      return dateB - dateA
    })

    return result
  }, [userTransactions, selectedBudget, searchQuery])

  // Gestionnaires des modales
  const handleOpenCreate = () => {
    setTransactionToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (trans) => {
    setTransactionToEdit(trans)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTransactionToEdit(null)
  }

  // Succès de création ou modification
  const handleModalSuccess = (savedTrans, isEdit) => {
    if (isEdit) {
      setListeTransaction((prev) =>
        prev.map((t) => (t.id === savedTrans.id ? savedTrans : t))
      )
      setToast({
        type: 'success',
        message: `La dépense "${savedTrans.descriptionTrans}" a été modifiée avec succès.`,
      })
    } else {
      setListeTransaction((prev) => [savedTrans, ...prev])
      setToast({
        type: 'success',
        message: `La dépense "${savedTrans.descriptionTrans}" a été enregistrée avec succès.`,
      })
    }
  }

  // Succès de suppression
  const handleDeleteSuccess = (deletedTransId) => {
    setListeTransaction((prev) => prev.filter((t) => t.id !== deletedTransId))
    setToast({
      type: 'success',
      message: 'Transaction supprimée avec succès.',
    })
  }

  // Réinitialisation des filtres
  const handleResetFilters = () => {
    setSelectedBudget('')
    setSearchQuery('')
  }

  // ── Affichage de l'état de chargement (Skeleton) ──────────
  if (isLoading && (!listeTransaction || listeTransaction.length === 0)) {
    return (
      <div className="w-full">
        <TransactionSkeleton />
      </div>
    )
  }

  // ── Affichage de l'état d'erreur critique ─────────────────
  if (hasError && userTransactions.length === 0) {
    return (
      <div className="w-full">
        <TransactionErrorState
          message={errorMessage}
          onRetry={() => GetBudgetTrans(false)}
          isRetrying={isLoading}
        />
      </div>
    )
  }

  const hasBudgets = listeBudget && listeBudget.length > 0
  const hasTransactions = userTransactions && userTransactions.length > 0
  const isFiltered = Boolean(selectedBudget || searchQuery)

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* 1. En-tête de la page */}
      <TransactionHeader
        onOpenCreate={handleOpenCreate}
        onRefresh={() => GetBudgetTrans(true)}
        isRefreshing={isRefreshing}
        hasBudgets={hasBudgets}
      />

      {/* 2. Résumé des KPIs transactions */}
      {hasTransactions && (
        <TransactionSummary
          listeTransaction={userTransactions}
          listeBudget={listeBudget}
        />
      )}

      {/* 3. Barre d'outils (Filtre par budget & Recherche textuelle) */}
      {hasBudgets && (hasTransactions || isFiltered) && (
        <TransactionToolbar
          listeBudget={listeBudget}
          selectedBudget={selectedBudget}
          onChangeBudget={setSelectedBudget}
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
          totalCount={userTransactions.length}
          filteredCount={filteredTransactions.length}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* 4. Liste / Tableau des transactions ou États vides */}
      {!hasBudgets ? (
        <TransactionEmptyState
          hasBudgets={false}
          onOpenCreate={handleOpenCreate}
        />
      ) : !hasTransactions ? (
        <TransactionEmptyState
          hasBudgets={true}
          isFiltered={false}
          onOpenCreate={handleOpenCreate}
        />
      ) : filteredTransactions.length === 0 ? (
        <TransactionEmptyState
          hasBudgets={true}
          isFiltered={true}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Historique des dépenses ({filteredTransactions.length})
            </h2>
            <span className="text-xs text-slate-400">
              Trié par date décroissante
            </span>
          </div>

          {/* Rendu Desktop et Tablette (md+) : Tableau complet */}
          <div className="hidden md:block">
            <TransactionTable
              transactions={filteredTransactions}
              listeBudget={listeBudget}
              allTransactions={listeTransaction}
              onEdit={handleOpenEdit}
              onDelete={(t) => setTransactionToDelete(t)}
            />
          </div>

          {/* Rendu Mobile (< md) : Cartes d'opérations individuelles sans overflow */}
          <div className="md:hidden space-y-3">
            {filteredTransactions.map((trans) => (
              <TransactionCard
                key={trans.id}
                trans={trans}
                listeBudget={listeBudget}
                allTransactions={listeTransaction}
                onEdit={handleOpenEdit}
                onDelete={(t) => setTransactionToDelete(t)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Modale d'ajout / modification */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transactionToEdit={transactionToEdit}
        listeBudget={listeBudget}
        listeTransaction={listeTransaction}
        onSuccess={handleModalSuccess}
      />

      {/* 6. Boîte de confirmation de suppression */}
      <ConfirmDeleteTransactionModal
        isOpen={Boolean(transactionToDelete)}
        onClose={() => setTransactionToDelete(null)}
        transaction={transactionToDelete}
        onSuccess={handleDeleteSuccess}
      />

      {/* 7. Notifications Toast */}
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
