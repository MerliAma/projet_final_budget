"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { LuMail, LuArrowLeft, LuMailCheck } from 'react-icons/lu'
import { sendPasswordResetEmail } from 'firebase/auth'
import { InitAuth } from '@/firebaseConfig'

// Composants Auth réutilisables
import AuthLayout from '@/composants/auth/AuthLayout'
import AuthInput from '@/composants/auth/AuthInput'
import AuthButton from '@/composants/auth/AuthButton'
import AuthAlert from '@/composants/auth/AuthAlert'


/**
 * Traduit les erreurs Firebase pour le reset mot de passe.
 */
function translateResetError(message) {
  if (!message) return "Une erreur inconnue s'est produite."
  if (message.includes("auth/user-not-found")) return "Aucun compte n'est associé à cette adresse email."
  if (message.includes("auth/invalid-email")) return "Le format de l'adresse email n'est pas valide."
  if (message.includes("auth/too-many-requests")) return "Trop de tentatives. Veuillez réessayer dans quelques minutes."
  if (message.includes("auth/network-request-failed")) return "Une erreur réseau est survenue. Vérifiez votre connexion et réessayez."
  return "Une erreur est survenue. Veuillez réessayer."
}


function MotDePasseOublie() {
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [sent, setSent] = useState(false)
  const [load, setLoad] = useState(false)

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validateEmail = () => {
    if (!email) { setEmailError("L'adresse email est requise."); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Format d'email invalide."); return false }
    setEmailError(null)
    return true
  }

  // ─── Envoi du lien de réinitialisation ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!validateEmail()) return

    try {
      setLoad(true)
      // Firebase sendPasswordResetEmail
      await sendPasswordResetEmail(InitAuth, email)
      setSent(true)
    } catch (error) {
      const msg = translateResetError(error?.message)
      setErrorMsg(msg)
      console.log("Erreur reset:", error?.message)
    } finally {
      setLoad(false)
    }
  }

  // ─── Zone Branding ─────────────────────────────────────────────────────────
  const brandingContent = (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
        Pas de panique !
      </h1>
      <p className="text-white/70 text-base leading-relaxed">
        Ça arrive à tout le monde d&apos;oublier son mot de passe. Nous allons vous aider à le réinitialiser rapidement.
      </p>
    </div>
  )


  // ─── État succès ────────────────────────────────────────────────────────────
  if (sent) {
    return (
      <AuthLayout brandingContent={brandingContent}>
        <div className="flex flex-col items-center text-center gap-6">

          {/* Icône succès */}
          <div className="w-16 h-16 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center">
            <LuMailCheck className="text-3xl text-[#16a34a]" aria-hidden="true" />
          </div>

          {/* Message */}
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a] mb-2">
              Email envoyé !
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Un lien de réinitialisation a été envoyé à{" "}
              <strong className="text-[#0f172a]">{email}</strong>.
              Consultez votre boîte de réception et cliquez sur le lien pour définir un nouveau mot de passe.
            </p>
          </div>

          {/* Conseils */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] p-4 text-left w-full">
            <p className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-2">
              Vous ne recevez rien ?
            </p>
            <ul className="text-xs text-[#475569] space-y-1 list-disc list-inside">
              <li>Vérifiez vos spams et courriers indésirables</li>
              <li>Assurez-vous que l&apos;adresse email est correcte</li>
              <li>Le lien est valide pendant 1 heure</li>
            </ul>
          </div>

          {/* Renvoyer */}
          <button
            type="button"
            onClick={() => { setSent(false); setEmail("") }}
            className="text-sm text-[#16a34a] hover:text-[#15803d] font-medium transition-colors cursor-pointer"
          >
            Renvoyer un email
          </button>

          {/* Retour connexion */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#0f172a] transition-colors font-medium"
          >
            <LuArrowLeft className="text-base" aria-hidden="true" />
            Retour à la connexion
          </Link>

        </div>
      </AuthLayout>
    )
  }

  // ─── Rendu principal ────────────────────────────────────────────────────────
  return (
    <AuthLayout brandingContent={brandingContent}>

      {/* En-tête */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-1">
          Mot de passe oublié ?
        </h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          Entrez votre adresse email. Nous vous enverrons les instructions
          pour réinitialiser votre mot de passe.
        </p>
      </div>

      {/* Alerte erreur */}
      {errorMsg && (
        <div className="mb-4">
          <AuthAlert
            type="error"
            message={errorMsg}
            onClose={() => setErrorMsg(null)}
          />
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-4">

          <AuthInput
            id="email-reset"
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError(null)
            }}
            required
            icon={LuMail}
            error={emailError}
            autoComplete="email"
          />

          <AuthButton
            id="btn-envoyer-reset"
            type="submit"
            loading={load}
            loadingText="Envoi en cours..."
            className="mt-2"
          >
            Envoyer le lien de réinitialisation
          </AuthButton>

        </div>
      </form>

      {/* Retour */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#475569] hover:text-[#0f172a] transition-colors font-medium"
        >
          <LuArrowLeft className="text-base" aria-hidden="true" />
          Retour à la connexion
        </Link>
      </div>

    </AuthLayout>
  )
}

export default MotDePasseOublie
