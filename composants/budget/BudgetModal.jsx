"use client"
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { LuX, LuPlus, LuPencil, LuPiggyBank, LuCalendar, LuCoins, LuLoader } from 'react-icons/lu'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'

/**
 * BudgetModal — Modale accessible de création et modification de budget
 * Gère le focus, la fermeture au clavier (Échap), la validation et les retours API
 */
export default function BudgetModal({
  isOpen,
  onClose,
  budgetToEdit = null,
  onSuccess,
}) {
  const [descriptionBud, setDescriptionBud] = useState('')
  const [montantBud, setMontantBud] = useState('')
  const [moisBud, setMoisBud] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const modalRef = useRef(null)
  const firstInputRef = useRef(null)

  const isEditMode = Boolean(budgetToEdit)

  // Initialisation ou réinitialisation des champs selon le mode
  useEffect(() => {
    if (isOpen) {
      if (budgetToEdit) {
        setDescriptionBud(budgetToEdit.descriptionBud || '')
        setMontantBud(budgetToEdit.montantBud || '')
        setMoisBud(budgetToEdit.moisBud || '')
      } else {
        setDescriptionBud('')
        setMontantBud('')
        // Mois courant par défaut format YYYY-MM
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        setMoisBud(`${year}-${month}`)
      }
      setErrorMessage('')
      setIsSubmitting(false)

      // Focus automatique sur le premier champ après ouverture
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, budgetToEdit])

  // Fermeture via la touche Échap
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

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const cleanDescription = descriptionBud.trim()
    const numMontant = Number(montantBud)

    if (!cleanDescription) {
      setErrorMessage('Veuillez renseigner un libellé pour ce budget.')
      return
    }
    if (!numMontant || numMontant <= 0) {
      setErrorMessage('Veuillez définir un montant alloué supérieur à zéro.')
      return
    }
    if (!moisBud) {
      setErrorMessage('Veuillez sélectionner le mois concerné.')
      return
    }

    const userInfos = RecupInfosUserConnecte()
    const idUser = userInfos?.idUser

    if (!idUser) {
      setErrorMessage('Session expirée ou utilisateur non identifié. Veuillez vous reconnecter.')
      return
    }

    const payload = {
      descriptionBud: cleanDescription,
      montantBud: numMontant,
      moisBud,
      idUser,
    }

    setIsSubmitting(true)

    try {
      if (isEditMode) {
        // Modification
        const res = await axios.patch(`/server/budget/updateB/${budgetToEdit.id}`, payload)
        if (res?.data?.message === 'Modification effectuée') {
          onSuccess({ ...budgetToEdit, ...payload }, true)
          onClose()
        } else {
          setErrorMessage(res?.data?.message || 'Impossible de mettre à jour le budget.')
        }
      } else {
        // Création
        const res = await axios.post('/server/budget/new', payload)
        if (res?.data?.id) {
          onSuccess({ id: res.data.id, ...payload }, false)
          onClose()
        } else {
          setErrorMessage("Impossible d'enregistrer le nouveau budget.")
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
      aria-labelledby="modal-budget-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-lg w-full overflow-hidden transition-all"
      >
        {/* ── En-tête de la modale ──────────────────────────── */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isEditMode ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {isEditMode ? <LuPencil className="text-xl" /> : <LuPlus className="text-xl" />}
            </div>
            <div>
              <h2 id="modal-budget-title" className="text-lg font-bold text-slate-900">
                {isEditMode ? 'Modifier le budget' : 'Nouveau budget'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode 
                  ? 'Ajustez les paramètres de votre enveloppe budgétaire.'
                  : 'Définissez une nouvelle catégorie et son plafond mensuel.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Fermer la boîte de dialogue"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* ── Corps du formulaire ───────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Message d'erreur utilisateur */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5" role="alert">
              <span className="font-bold">•</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Champ : Libellé / Description */}
          <div>
            <label htmlFor="budget-description" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nom ou catégorie du budget <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LuPiggyBank className="text-base" />
              </div>
              <input
                ref={firstInputRef}
                id="budget-description"
                type="text"
                value={descriptionBud}
                onChange={(e) => setDescriptionBud(e.target.value)}
                placeholder="Ex : Alimentation, Logement, Transports..."
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors disabled:bg-slate-50"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Libellé sous lequel seront regroupées vos dépenses.
            </p>
          </div>

          {/* Champ : Montant Alloué */}
          <div>
            <label htmlFor="budget-montant" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Montant alloué (FCFA) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LuCoins className="text-base" />
              </div>
              <input
                id="budget-montant"
                type="number"
                min="1"
                step="any"
                value={montantBud}
                onChange={(e) => setMontantBud(e.target.value)}
                placeholder="Ex : 250000"
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors disabled:bg-slate-50"
              />
              <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
                FCFA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Plafond financier maximum pour la période.
            </p>
          </div>

          {/* Champ : Mois Concerné */}
          <div>
            <label htmlFor="budget-mois" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mois concerné <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LuCalendar className="text-base" />
              </div>
              <input
                id="budget-mois"
                type="month"
                value={moisBud}
                onChange={(e) => setMoisBud(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors disabled:bg-slate-50"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Période mensuelle sur laquelle s&apos;applique cette enveloppe.
            </p>
          </div>

          {/* ── Boutons d'action ────────────────────────────── */}
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
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-[0.98] transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="text-base animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Enregistrer les modifications' : 'Créer le budget'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
