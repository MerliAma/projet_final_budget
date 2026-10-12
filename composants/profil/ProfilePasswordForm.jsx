"use client"
import React, { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { LuLock, LuEye, LuEyeOff, LuShieldCheck, LuTriangleAlert, LuCheck } from 'react-icons/lu'

/**
 * ProfilePasswordForm — Modification sécurisée du mot de passe
 * Prise en charge de la réauthentification Firebase, validation des contraintes et masquage/affichage.
 */
export default function ProfilePasswordForm({ user, onNotify }) {
  const [ancienPassword, setAncienPassword] = useState('')
  const [nouveauPassword, setNouveauPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [voirAncien, setVoirAncien] = useState(false)
  const [voirNouveau, setVoirNouveau] = useState(false)
  const [voirConfirm, setVoirConfirm] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!ancienPassword) {
      setErrorMsg("Veuillez renseigner votre mot de passe actuel.")
      return
    }

    if (nouveauPassword.length < 6) {
      setErrorMsg("Le nouveau mot de passe doit comporter au moins 6 caractères.")
      return
    }

    if (nouveauPassword === ancienPassword) {
      setErrorMsg("Le nouveau mot de passe doit être différent de l'ancien.")
      return
    }

    if (nouveauPassword !== confirmPassword) {
      setErrorMsg("La confirmation ne correspond pas au nouveau mot de passe.")
      return
    }

    if (!user || !user.email) {
      setErrorMsg("Session expirée. Veuillez vous reconnecter.")
      return
    }

    try {
      setIsLoading(true)

      // 1. Réauthentification obligatoire
      const credential = EmailAuthProvider.credential(user.email, ancienPassword)
      await reauthenticateWithCredential(user, credential)

      // 2. Mise à jour du mot de passe
      await updatePassword(user, nouveauPassword)

      // 3. Réinitialisation des champs
      setAncienPassword('')
      setNouveauPassword('')
      setConfirmPassword('')
      setSuccessMsg("Votre mot de passe a été modifié avec succès.")

      if (onNotify) {
        onNotify('success', 'Votre mot de passe a été modifié avec succès.')
      }

    } catch (error) {
      console.error('Erreur changement mot de passe :', error)
      const code = error?.code || ''
      const msg = error?.message || ''

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || msg.includes('invalid-credential')) {
        setErrorMsg("L'ancien mot de passe saisi est incorrect.")
      } else if (code === 'auth/requires-recent-login') {
        setErrorMsg("Pour des raisons de sécurité, veuillez vous déconnecter puis vous reconnecter avant de modifier votre mot de passe.")
      } else if (code === 'auth/weak-password') {
        setErrorMsg("Le nouveau mot de passe est trop faible. Choisissez au moins 6 caractères.")
      } else {
        setErrorMsg("Une erreur inattendue s'est produite lors de la modification du mot de passe.")
      }

      if (onNotify) {
        onNotify('error', "Échec de la modification du mot de passe.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
      
      {/* ── Titre de la section ───────────────────────────── */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <LuLock className="text-emerald-600" aria-hidden="true" />
          <span>Sécurité & Mot de passe</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Modifiez votre mot de passe de connexion. Exige la saisie de votre ancien mot de passe.
        </p>
      </div>

      {/* ── Formulaire ────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        
        {/* Champ Ancien Mot de passe */}
        <div>
          <label 
            htmlFor="ancien-password" 
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Ancien mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LuLock className="text-base" aria-hidden="true" />
            </div>
            <input
              type={voirAncien ? "text" : "password"}
              id="ancien-password"
              value={ancienPassword}
              onChange={(e) => {
                setAncienPassword(e.target.value)
                setErrorMsg('')
                setSuccessMsg('')
              }}
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setVoirAncien(!voirAncien)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label={voirAncien ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {voirAncien ? <LuEye className="text-base" /> : <LuEyeOff className="text-base" />}
            </button>
          </div>
        </div>

        {/* Champ Nouveau Mot de passe */}
        <div>
          <label 
            htmlFor="nouveau-password" 
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Nouveau mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LuLock className="text-base" aria-hidden="true" />
            </div>
            <input
              type={voirNouveau ? "text" : "password"}
              id="nouveau-password"
              value={nouveauPassword}
              onChange={(e) => {
                setNouveauPassword(e.target.value)
                setErrorMsg('')
                setSuccessMsg('')
              }}
              required
              minLength={6}
              placeholder="Minimum 6 caractères"
              className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setVoirNouveau(!voirNouveau)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label={voirNouveau ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {voirNouveau ? <LuEye className="text-base" /> : <LuEyeOff className="text-base" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Utilisez au moins 6 caractères avec chiffres et lettres pour une sécurité renforcée.
          </p>
        </div>

        {/* Champ Confirmation du Nouveau Mot de passe */}
        <div>
          <label 
            htmlFor="confirm-password" 
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Confirmer le nouveau mot de passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LuShieldCheck className="text-base" aria-hidden="true" />
            </div>
            <input
              type={voirConfirm ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setErrorMsg('')
                setSuccessMsg('')
              }}
              required
              placeholder="Répétez le nouveau mot de passe"
              className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setVoirConfirm(!voirConfirm)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label={voirConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {voirConfirm ? <LuEye className="text-base" /> : <LuEyeOff className="text-base" />}
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2 animate-fade-in" role="alert">
            <LuTriangleAlert className="text-base shrink-0" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Message de succès */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-fade-in" role="status">
            <LuCheck className="text-base shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Bouton de soumission */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !ancienPassword || !nouveauPassword || !confirmPassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                <span>Mise à jour en cours...</span>
              </>
            ) : (
              <span>Changer mon mot de passe</span>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
