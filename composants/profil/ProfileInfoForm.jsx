"use client"
import React, { useState, useEffect } from 'react'
import { updateProfile } from 'firebase/auth'
import { LuUser, LuPenLine, LuSave, LuCheck, LuTriangleAlert } from 'react-icons/lu'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'

/**
 * ProfileInfoForm — Modification simple et directe des informations personnelles
 * Résout le problème historique : permet de modifier son nom SANS devoir saisir son mot de passe.
 */
export default function ProfileInfoForm({ user, infosUser, onUpdateSuccess, onNotify }) {
  const [nom, setNom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Synchronisation avec l'utilisateur actuel
  useEffect(() => {
    const nomActuel = infosUser?.nomUser || user?.displayName || ''
    setNom(nomActuel)
  }, [user, infosUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setIsSuccess(false)

    const nomNettoye = nom.trim()
    if (!nomNettoye) {
      setErrorMsg('Veuillez renseigner votre nom complet.')
      return
    }

    if (nomNettoye.length < 2) {
      setErrorMsg('Le nom doit comporter au moins 2 caractères.')
      return
    }

    if (!user) {
      setErrorMsg("Session expirée. Veuillez vous reconnecter.")
      return
    }

    try {
      setIsLoading(true)

      // 1. Mise à jour du profil Firebase Auth
      await updateProfile(user, {
        displayName: nomNettoye,
      })

      // 2. Synchronisation dans le localStorage
      const infosExistantes = RecupInfosUserConnecte() || {}
      const idUser = infosExistantes.idUser || user.uid
      const updatedInfos = { ...infosExistantes, idUser, nomUser: nomNettoye }
      localStorage.setItem('InfosUser', JSON.stringify(updatedInfos))

      // 3. Callback vers le parent pour mettre à jour le contexte global
      if (onUpdateSuccess) {
        onUpdateSuccess(updatedInfos)
      }

      setIsSuccess(true)
      if (onNotify) {
        onNotify('success', 'Votre nom a été mis à jour avec succès.')
      }

      // Réinitialisation de l'indicateur de succès après 3 secondes
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)

    } catch (error) {
      console.error('Erreur mise à jour profil :', error)
      const msg = error?.message || "Une erreur est survenue lors de la mise à jour."
      setErrorMsg(msg)
      if (onNotify) {
        onNotify('error', "Impossible de mettre à jour vos informations.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
      
      {/* ── Titre de la section ───────────────────────────── */}
      <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <LuUser className="text-emerald-600" aria-hidden="true" />
            <span>Informations personnelles</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mettez à jour votre nom d'affichage public et professionnel.
          </p>
        </div>
      </div>

      {/* ── Formulaire ────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        
        {/* Champ Nom Complet */}
        <div>
          <label 
            htmlFor="nom-profil" 
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Nom complet <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LuPenLine className="text-base" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="nom-profil"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value)
                setErrorMsg('')
                setIsSuccess(false)
              }}
              required
              minLength={2}
              maxLength={60}
              placeholder="Ex : Jean Dupont"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              disabled={isLoading}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Ce nom est utilisé pour personnaliser votre espace et saluer vos sessions.
          </p>
        </div>

        {/* Message d'erreur inline */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2 animate-fade-in" role="alert">
            <LuTriangleAlert className="text-base shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || !nom.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                <span>Enregistrement en cours...</span>
              </>
            ) : isSuccess ? (
              <>
                <LuCheck className="text-base" aria-hidden="true" />
                <span>Enregistré !</span>
              </>
            ) : (
              <>
                <LuSave className="text-base" aria-hidden="true" />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
