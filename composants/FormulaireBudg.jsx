"use client"
import React, { useEffect, useRef, useState } from 'react'
import MessageOk from './MessageOk'
import MessageErreur from './MessageErreur'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'
import { LuPlus, LuPencil, LuCoins, LuCalendar, LuTag, LuLoader } from 'react-icons/lu'
import axios from 'axios'

/**
 * FormulaireBudg — Formulaire d'ajout et modification de budget
 * Préserve les props existantes { listeBudget, setListeBudget, BudgetM }
 */
function FormulaireBudg({ listeBudget = [], setListeBudget, BudgetM }) {
  const [montantBud, setMontantBud] = useState(BudgetM?.montantBud || '')
  const [descriptionBud, setDescriptionBud] = useState(BudgetM?.descriptionBud || '')
  const [moisBud, setMoisBud] = useState(BudgetM?.moisBud || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rep, setRep] = useState(null) // true (succès) | false (erreur) | null

  const formRef = useRef(null)

  useEffect(() => {
    if (BudgetM) {
      setMontantBud(BudgetM.montantBud || '')
      setMoisBud(BudgetM.moisBud || '')
      setDescriptionBud(BudgetM.descriptionBud || '')
    } else {
      setDescriptionBud('')
      setMontantBud('')
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      setMoisBud(`${year}-${month}`)
    }
  }, [BudgetM])

  const submitForm = async (e) => {
    e.preventDefault()
    if (typeof window === 'undefined') return

    setIsSubmitting(true)
    setRep(null)

    try {
      const idUser = RecupInfosUserConnecte()?.idUser
      const data = { 
        descriptionBud: descriptionBud.trim(), 
        montantBud: Number(montantBud), 
        moisBud, 
        idUser 
      }

      if (!BudgetM) {
        // Ajout budget
        const req = await axios.post('/server/budget/new', data)

        if (req?.data?.id) {
          setRep(true)
          setListeBudget([...listeBudget, { id: req.data.id, ...data }])
          setDescriptionBud('')
          setMontantBud('')
        } else {
          setRep(false)
        }
      } else {
        // Modification budget
        const req = await axios.patch(`/server/budget/updateB/${BudgetM.id}`, data)

        if (req?.data?.message === 'Modification effectuée') {
          const nouveauTableau = listeBudget.map((item) =>
            item.id === BudgetM.id ? { ...item, ...data } : item
          )
          setListeBudget(nouveauTableau)
          setRep(true)
          document.getElementById('closeModalBTN')?.click()
        } else {
          setRep(false)
        }
      }
    } catch (error) {
      console.error('Erreur FormulaireBudg:', error?.message)
      setRep(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEdit = Boolean(BudgetM)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
        <div className={`p-2 rounded-xl ${isEdit ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isEdit ? <LuPencil className="text-lg" /> : <LuPlus className="text-lg" />}
        </div>
        <h3 className="text-base font-bold text-slate-900">
          {isEdit ? 'Modifier le budget' : 'Nouveau budget'}
        </h3>
      </div>

      <form ref={formRef} onSubmit={submitForm} className="space-y-4">
        {/* Champ Description */}
        <div>
          <label htmlFor="form-desc-bud" className="block text-xs font-semibold text-slate-700 mb-1">
            Nom ou Catégorie <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LuTag className="text-sm" />
            </div>
            <input
              id="form-desc-bud"
              type="text"
              value={descriptionBud}
              onChange={(e) => setDescriptionBud(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Ex : Alimentation, Loyer..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Champ Montant */}
        <div>
          <label htmlFor="form-montant-bud" className="block text-xs font-semibold text-slate-700 mb-1">
            Montant Alloué (FCFA) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LuCoins className="text-sm" />
            </div>
            <input
              id="form-montant-bud"
              type="number"
              min="1"
              value={montantBud}
              onChange={(e) => setMontantBud(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Ex : 150000"
              className="w-full pl-9 pr-14 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 pointer-events-none">
              FCFA
            </span>
          </div>
        </div>

        {/* Champ Mois */}
        <div>
          <label htmlFor="form-mois-bud" className="block text-xs font-semibold text-slate-700 mb-1">
            Mois Concerné <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LuCalendar className="text-sm" />
            </div>
            <input
              id="form-mois-bud"
              type="month"
              value={moisBud || ''}
              onChange={(e) => setMoisBud(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <LuLoader className="animate-spin text-sm" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <span>{isEdit ? 'Modifier' : 'Ajouter'} le budget</span>
                <LuPlus className="text-sm" />
              </>
            )}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => document.getElementById('closeModalBTN')?.click()}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Messages de retour */}
      {rep !== null && (
        <div className="mt-4">
          {rep ? (
            <MessageOk message="Budget enregistré avec succès" onClose={() => setRep(null)} />
          ) : (
            <MessageErreur message="Une erreur s'est produite lors de l'enregistrement" onClose={() => setRep(null)} />
          )}
        </div>
      )}

      {/* Élément caché conservé pour rétro-compatibilité */}
      <label htmlFor="my_modal_6" className="btn hidden" id="closeModalBTN" />
    </div>
  )
}

export default FormulaireBudg
