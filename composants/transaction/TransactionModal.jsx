"use client"
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { 
  LuX, 
  LuPlus, 
  LuPencil, 
  LuTag, 
  LuCoins, 
  LuReceipt, 
  LuLoader,
  LuTriangleAlert,
  LuInfo 
} from 'react-icons/lu'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'

/**
 * TransactionModal — Modale accessible de création et modification de transaction
 * Valide les plafonds budgétaires et affiche en temps réel les soldes disponibles
 */
export default function TransactionModal({
  isOpen,
  onClose,
  transactionToEdit = null,
  listeBudget = [],
  listeTransaction = [],
  onSuccess,
  fenConcerne = '',
}) {
  const [descriptionTrans, setDescriptionTrans] = useState('')
  const [montantTrans, setMontantTrans] = useState('')
  const [budgetTrans, setBudgetTrans] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const modalRef = useRef(null)
  const firstInputRef = useRef(null)

  const isEditMode = Boolean(transactionToEdit)

  // Initialisation à l'ouverture
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        setDescriptionTrans(transactionToEdit.descriptionTrans || '')
        setMontantTrans(transactionToEdit.montantTrans || '')
        setBudgetTrans(transactionToEdit.budgetTrans || fenConcerne || '')
      } else {
        setDescriptionTrans('')
        setMontantTrans('')
        // Si fenConcerne est renseigné (page détail budget), verrouillé dessus
        if (fenConcerne) {
          setBudgetTrans(fenConcerne)
        } else if (listeBudget && listeBudget.length > 0) {
          setBudgetTrans(listeBudget[0].id)
        } else {
          setBudgetTrans('')
        }
      }
      setErrorMessage('')
      setIsSubmitting(false)

      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, transactionToEdit, fenConcerne, listeBudget])

  // Fermeture au clavier via Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) return null

  // Budget actuellement ciblé
  const budgetActuelId = fenConcerne || budgetTrans
  const budgetSelectionne = listeBudget.find((b) => String(b.id) === String(budgetActuelId))

  // Calcul du solde restant dans ce budget
  let soldeRestant = 0
  if (budgetSelectionne) {
    const calculs = SommeTransactions(
      budgetSelectionne.id,
      listeTransaction,
      listeBudget,
      budgetSelectionne.montantBud
    )
    soldeRestant = calculs?.reste || 0
  }

  // Dépassement prévisionnel
  const montantSaisi = Number(montantTrans || 0)
  const montantInitial = isEditMode ? Number(transactionToEdit?.montantTrans || 0) : 0
  const difference = isEditMode ? montantSaisi - montantInitial : montantSaisi
  const estDepasse = difference > soldeRestant

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const cleanDescription = descriptionTrans.trim()
    const numMontant = Number(montantTrans)

    if (!cleanDescription) {
      setErrorMessage('Veuillez renseigner une description pour la transaction.')
      return
    }
    if (!numMontant || numMontant <= 0) {
      setErrorMessage('Veuillez saisir un montant valide supérieur à zéro.')
      return
    }
    if (!budgetActuelId) {
      setErrorMessage('Veuillez associer cette transaction à un budget.')
      return
    }

    // Règle financière stricte existante : blocage si dépassement
    if (estDepasse) {
      setErrorMessage(
        `Le montant dépasse le reste disponible (${soldeRestant.toLocaleString('fr-FR')} FCFA) pour le budget "${budgetSelectionne?.descriptionBud}".`
      )
      return
    }

    setIsSubmitting(true)

    const payload = {
      descriptionTrans: cleanDescription,
      montantTrans: numMontant,
      budgetTrans: budgetActuelId,
    }

    try {
      if (isEditMode) {
        // Modification
        const res = await axios.patch(`/server/transaction/updateT/${transactionToEdit.id}`, payload)
        if (res?.data?.message === 'Modification effectuée' || res?.status === 200) {
          onSuccess({ ...transactionToEdit, ...payload }, true)
          onClose()
        } else {
          setErrorMessage(res?.data?.message || 'Erreur lors de la mise à jour de la transaction.')
        }
      } else {
        // Ajout
        const res = await axios.post('/server/transaction/new', payload)
        if (res?.data?.id) {
          onSuccess(
            { 
              id: res.data.id, 
              ...payload, 
              dateEnrg: new Date().toISOString() 
            }, 
            false
          )
          onClose()
        } else {
          setErrorMessage("Impossible d'enregistrer la transaction.")
        }
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message
      setErrorMessage(typeof serverMsg === 'string' ? serverMsg : "Une erreur s'est produite lors de l'enregistrement.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-trans-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-lg w-full overflow-hidden transition-all"
      >
        {/* ── En-tête ───────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isEditMode ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isEditMode ? <LuPencil className="text-xl" /> : <LuPlus className="text-xl" />}
            </div>
            <div>
              <h2 id="modal-trans-title" className="text-lg font-bold text-slate-900">
                {isEditMode ? 'Modifier la dépense' : 'Nouvelle dépense'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode 
                  ? 'Ajustez le montant ou la description de cette dépense.'
                  : 'Enregistrez une nouvelle opération financière.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Fermer"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* ── Formulaire ────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Message d'erreur utilisateur */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5" role="alert">
              <LuTriangleAlert className="text-base shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Champ Description */}
          <div>
            <label htmlFor="trans-description" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description de la dépense <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LuReceipt className="text-base" />
              </div>
              <input
                ref={firstInputRef}
                id="trans-description"
                type="text"
                value={descriptionTrans}
                onChange={(e) => setDescriptionTrans(e.target.value)}
                placeholder="Ex : Courses supermarché, Facture électricité..."
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Champ Montant */}
          <div>
            <label htmlFor="trans-montant" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Montant de la dépense (FCFA) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LuCoins className="text-base" />
              </div>
              <input
                id="trans-montant"
                type="number"
                min="1"
                step="any"
                value={montantTrans}
                onChange={(e) => setMontantTrans(e.target.value)}
                placeholder="Ex : 25000"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors disabled:bg-slate-50"
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
                FCFA
              </span>
            </div>
          </div>

          {/* Sélecteur de Budget associé */}
          <div>
            <label htmlFor="trans-budget" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Budget associé <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LuTag className="text-base" />
              </div>
              <select
                id="trans-budget"
                value={budgetActuelId}
                onChange={(e) => setBudgetTrans(e.target.value)}
                required
                disabled={isSubmitting || Boolean(fenConcerne)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors disabled:bg-slate-100 capitalize cursor-pointer"
              >
                {listeBudget.length === 0 && (
                  <option value="" disabled>Aucun budget disponible</option>
                )}
                {listeBudget.map((budget) => {
                  const r = SommeTransactions(budget.id, listeTransaction, listeBudget, budget.montantBud).reste
                  return (
                    <option key={budget.id} value={budget.id} className="capitalize">
                      {budget.descriptionBud} (Disponible : {r.toLocaleString('fr-FR')} FCFA)
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Indicateur de solde disponible dans le budget sélectionné */}
            {budgetSelectionne && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Solde disponible sur <strong>{budgetSelectionne.descriptionBud}</strong> :
                </span>
                <span className={`font-bold ${soldeRestant >= 0 ? 'text-[#16a34a]' : 'text-red-600'}`}>
                  {soldeRestant.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            )}

            {/* Avertissement de dépassement en direct */}
            {estDepasse && montantSaisi > 0 && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <LuTriangleAlert className="text-base shrink-0 text-amber-600" aria-hidden="true" />
                <span>
                  Ce montant dépasse le solde disponible de ce budget !
                </span>
              </div>
            )}
          </div>

          {/* ── Actions ───────────────────────────────────────── */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isSubmitting || estDepasse}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-[0.98] transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="text-base animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Enregistrer les modifications' : 'Ajouter la dépense'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
