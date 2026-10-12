"use client"
import React, { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, verifyBeforeUpdateEmail } from 'firebase/auth'
import { LuMail, LuLock, LuEye, LuEyeOff, LuShieldCheck, LuTriangleAlert, LuCheck, LuInfo } from 'react-icons/lu'

/**
 * ProfileEmailForm — Modification sécurisée de l'adresse email
 * Résout le bug historique : importe et exécute verifyBeforeUpdateEmail de Firebase Auth avec réauthentification.
 */
export default function ProfileEmailForm({ user, onNotify }) {
  const [nouvelEmail, setNouvelEmail] = useState('')
  const [motDePasseActuel, setMotDePasseActuel] = useState('')
  const [voirMotDePasse, setVoirMotDePasse] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const emailActuel = user?.email || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const emailNettoye = nouvelEmail.trim().toLowerCase()

    if (!emailNettoye) {
      setErrorMsg("Veuillez saisir votre nouvelle adresse email.")
      return
    }

    if (emailNettoye === emailActuel.toLowerCase()) {
      setErrorMsg("La nouvelle adresse doit être différente de l'adresse actuelle.")
      return
    }

    if (!motDePasseActuel) {
      setErrorMsg("Veuillez saisir votre mot de passe actuel pour valider cette action sensible.")
      return
    }

    if (!user) {
      setErrorMsg("Session expirée. Veuillez vous reconnecter.")
      return
    }

    try {
      setIsLoading(true)

      // 1. Réauthentification de sécurité
      const credential = EmailAuthProvider.credential(user.email, motDePasseActuel)
      await reauthenticateWithCredential(user, credential)

      // 2. Envoi du lien de vérification à la nouvelle adresse
      await verifyBeforeUpdateEmail(user, emailNettoye)

      setNouvelEmail('')
      setMotDePasseActuel('')
      const msg = `Un email de confirmation a été envoyé à ${emailNettoye}. Veuillez cliquer sur le lien reçu pour valider votre nouvelle adresse.`
      setSuccessMsg(msg)

      if (onNotify) {
        onNotify('success', msg)
      }

    } catch (error) {
      console.error("Erreur modification email :", error)
      const code = error?.code || ''
      const msg = error?.message || ''

      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || msg.includes('invalid-credential')) {
        setErrorMsg("Le mot de passe actuel saisi est incorrect.")
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg("Cette adresse email est déjà utilisée par un autre compte.")
      } else if (code === 'auth/invalid-email') {
        setErrorMsg("Le format de l'adresse email est invalide.")
      } else if (code === 'auth/requires-recent-login') {
        setErrorMsg("Veuillez vous reconnecter avant de modifier votre adresse email.")
      } else {
        setErrorMsg("Une erreur est survenue lors de la demande de modification d'email.")
      }

      if (onNotify) {
        onNotify('error', "Échec de la modification d'email.")
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
          <LuMail className="text-emerald-600" aria-hidden="true" />
          <span>Adresse Email</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Consultez et mettez à jour l'adresse email associée à votre compte TopBudget.
        </p>
      </div>

      {/* ── Adresse Email Actuelle ────────────────────────── */}
      <div className="mb-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-xl">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Adresse email actuelle
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {emailActuel || 'Non renseignée'}
          </span>
        </div>

        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <LuShieldCheck className="text-xs" />
            <span>{user?.emailVerified ? 'Vérifiée' : 'Active'}</span>
          </span>
        </div>
      </div>

      {/* ── Formulaire de changement d'email ──────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        
        {/* Champ Nouvel Email */}
        <div>
          <label 
            htmlFor="nouvel-email" 
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Nouvelle adresse email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LuMail className="text-base" aria-hidden="true" />
            </div>
            <input
              type="email"
              id="nouvel-email"
              value={nouvelEmail}
              onChange={(e) => {
                setNouvelEmail(e.target.value)
                setErrorMsg('')
                setSuccessMsg('')
              }}
              required
              placeholder="nouveau.email@domaine.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Mot de passe actuel pour réauthentification */}
        <div>
          <label 
            htmlFor="email-password-confirm" 
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Mot de passe actuel <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LuLock className="text-base" aria-hidden="true" />
            </div>
            <input
              type={voirMotDePasse ? "text" : "password"}
              id="email-password-confirm"
              value={motDePasseActuel}
              onChange={(e) => {
                setMotDePasseActuel(e.target.value)
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
              onClick={() => setVoirMotDePasse(!voirMotDePasse)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label={voirMotDePasse ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {voirMotDePasse ? <LuEye className="text-base" /> : <LuEyeOff className="text-base" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Requis par sécurité pour confirmer votre identité avant la modification.
          </p>
        </div>

        {/* Note explicative */}
        <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
          <LuInfo className="text-base shrink-0 mt-0.5 text-blue-600" aria-hidden="true" />
          <span>
            Par mesure de sécurité, un email de confirmation vous sera envoyé à la nouvelle adresse. Vous devrez cliquer sur le lien reçu pour valider le changement.
          </span>
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
            disabled={isLoading || !nouvelEmail.trim() || !motDePasseActuel}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                <span>Envoi de la confirmation...</span>
              </>
            ) : (
              <span>Mettre à jour l'email</span>
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
