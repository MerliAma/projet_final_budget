"use client"
import React, { useEffect, useRef, useState } from 'react'
import MessageOk from './MessageOk'
import MessageErreur from './MessageErreur'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'
import { LuPlus, LuPencil, LuReceipt, LuCoins, LuTag, LuLoader, LuTriangleAlert } from 'react-icons/lu'
import axios from 'axios'

/**
 * FormulaireTrans — Formulaire d'ajout et modification d'une transaction
 * Préserve intégralement les props existantes :
 * { listeTransaction, setListeTransaction, listeBudget, setListeBudget, TransactionM, fenConcerne }
 */
function FormulaireTrans({
  listeTransaction = [],
  setListeTransaction,
  listeBudget = [],
  setListeBudget,
  TransactionM,
  fenConcerne = '',
}) {
  const [descriptionTrans, setDescriptionTrans] = useState(TransactionM?.descriptionTrans || '')
  const [montantTrans, setMontantTrans] = useState(TransactionM?.montantTrans || '')
  const [budgetTrans, setBudgetTrans] = useState(TransactionM?.budgetTrans || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rep, setRep] = useState(null) // true | false | null
  const [errorMessage, setErrorMessage] = useState('')

  const formRefT = useRef(null)

  // Initialisation à la modification ou changement de budget
  useEffect(() => {
    if (TransactionM) {
      setMontantTrans(TransactionM.montantTrans || '')
      setDescriptionTrans(TransactionM.descriptionTrans || '')
      setBudgetTrans(TransactionM.budgetTrans || fenConcerne || '')
    } else {
      setDescriptionTrans('')
      setMontantTrans('')
      if (fenConcerne) {
        setBudgetTrans(fenConcerne)
      } else if (listeBudget && listeBudget.length > 0 && !budgetTrans) {
        setBudgetTrans(listeBudget[0].id)
      }
    }
  }, [TransactionM, fenConcerne, listeBudget])

  const budgetSelectionneId = fenConcerne !== '' ? fenConcerne : budgetTrans
  const budgetActuel = listeBudget.find((b) => String(b.id) === String(budgetSelectionneId))

  // Solde disponible dans le budget sélectionné
  let soldeDisponible = 0
  if (budgetActuel) {
    const calc = SommeTransactions(
      budgetActuel.id,
      listeTransaction,
      listeBudget,
      budgetActuel.montantBud
    )
    soldeDisponible = calc?.reste || 0
  }

  const montantSaisi = Number(montantTrans || 0)
  const ancienMontant = TransactionM ? Number(TransactionM.montantTrans || 0) : 0
  const difference = TransactionM ? montantSaisi - ancienMontant : montantSaisi
  const estDepasse = difference > soldeDisponible

  const submitFormT = async (e) => {
    e.preventDefault()
    if (typeof window === 'undefined') return

    setErrorMessage('')
    setRep(null)

    const cleanDescription = descriptionTrans.trim()
    const numMontant = Number(montantTrans)

    if (!cleanDescription) {
      setErrorMessage('Veuillez renseigner une description.')
      return
    }
    if (!numMontant || numMontant <= 0) {
      setErrorMessage('Veuillez saisir un montant supérieur à zéro.')
      return
    }
    if (!budgetSelectionneId) {
      setErrorMessage('Veuillez sélectionner un budget.')
      return
    }

    // Vérification financière
    if (estDepasse) {
      setErrorMessage(
        `Le montant dépasse le solde disponible (${soldeDisponible.toLocaleString('fr-FR')} FCFA) pour ce budget.`
      )
      return
    }

    setIsSubmitting(true)
    const data = {
      descriptionTrans: cleanDescription,
      montantTrans: numMontant,
      budgetTrans: budgetSelectionneId,
    }

    try {
      if (!TransactionM) {
        // Ajout transaction
        const req = await axios.post('/server/transaction/new', data)

        if (req?.data?.id) {
          setRep(true)
          setListeTransaction([
            ...listeTransaction,
            { id: req.data.id, ...data, dateEnrg: new Date().toISOString() },
          ])
          setDescriptionTrans('')
          setMontantTrans('')
        } else {
          setRep(false)
        }
      } else {
        // Modification transaction
        const req = await axios.patch(`/server/transaction/updateT/${TransactionM.id}`, data)

        if (req?.data?.message === 'Modification effectuée' || req?.status === 200) {
          const nouveauTableau = listeTransaction.map((item) =>
            item.id === TransactionM.id ? { ...item, ...data } : item
          )
          setListeTransaction(nouveauTableau)
          setRep(true)
          document.getElementById('closeModalTrans')?.click()
        } else {
          setRep(false)
        }
      }
    } catch (error) {
      console.error('Erreur FormulaireTrans:', error?.message)
      setRep(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEdit = Boolean(TransactionM)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
        <div className={`p-2 rounded-xl ${isEdit ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isEdit ? <LuPencil className="text-lg" /> : <LuPlus className="text-lg" />}
        </div>
        <h3 className="text-base font-bold text-slate-900">
          {isEdit ? 'Modifier la dépense' : 'Nouvelle dépense'}
        </h3>
      </div>

      <form ref={formRefT} onSubmit={submitFormT} className="space-y-4">
        {/* Alerte d'erreur interne */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2" role="alert">
            <LuTriangleAlert className="text-base shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Champ Description */}
        <div>
          <label htmlFor="form-desc-trans" className="block text-xs font-semibold text-slate-700 mb-1">
            Description / Libellé <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LuReceipt className="text-sm" />
            </div>
            <input
              id="form-desc-trans"
              type="text"
              value={descriptionTrans}
              onChange={(e) => setDescriptionTrans(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Ex : Courses, Facture..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Champ Montant */}
        <div>
          <label htmlFor="form-montant-trans" className="block text-xs font-semibold text-slate-700 mb-1">
            Montant (FCFA) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LuCoins className="text-sm" />
            </div>
            <input
              id="form-montant-trans"
              type="number"
              min="1"
              value={montantTrans}
              onChange={(e) => setMontantTrans(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Ex : 15000"
              className="w-full pl-9 pr-14 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
              FCFA
            </span>
          </div>
        </div>

        {/* Champ Sélecteur de Budget */}
        {fenConcerne === '' && (
          <div>
            <label htmlFor="form-budget-trans" className="block text-xs font-semibold text-slate-700 mb-1">
              Budget rattaché <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LuTag className="text-sm" />
              </div>
              <select
                id="form-budget-trans"
                value={budgetTrans}
                onChange={(e) => setBudgetTrans(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 capitalize cursor-pointer"
              >
                <option value="" disabled>Choisir un budget</option>
                {listeBudget?.map((budget) => {
                  const r = SommeTransactions(budget.id, listeTransaction, listeBudget, budget.montantBud).reste
                  return (
                    <option key={budget.id} value={budget.id} className="capitalize">
                      {budget.descriptionBud} (Dispo : {r.toLocaleString('fr-FR')} FCFA)
                    </option>
                  )
                })}
              </select>
            </div>

            {budgetActuel && (
              <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                <span>Disponible :</span>
                <strong className={soldeDisponible >= 0 ? 'text-[#16a34a]' : 'text-red-600'}>
                  {soldeDisponible.toLocaleString('fr-FR')} FCFA
                </strong>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || estDepasse}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <LuLoader className="animate-spin text-sm" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <span>{isEdit ? 'Modifier' : 'Ajouter'} la dépense</span>
                <LuPlus className="text-sm" />
              </>
            )}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => document.getElementById('closeModalTrans')?.click()}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Messages de retour — toast flottant en position absolue/fixe (aucun défilement requis) */}
      {rep !== null && (
        rep ? (
          <MessageOk message="Transaction enregistrée avec succès" onClose={() => setRep(null)} />
        ) : (
          <MessageErreur message="Une erreur s'est produite lors de l'enregistrement" onClose={() => setRep(null)} />
        )
      )}

      {/* Bouton masqué pour rétro-compatibilité */}
      <label htmlFor="my_modal_6" className="btn hidden" id="closeModalTrans" />
    </div>
  )
}

export default FormulaireTrans
