"use client"
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { LuMail, LuPenLine } from 'react-icons/lu'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { InitAuth } from '@/firebaseConfig'

// Anciens imports conservés (logique IndexDB commentée)
// import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'
// import { AddTodatabase } from '@/lib/IndexDB/addToDB'

// Composants Auth réutilisables
import AuthLayout from './auth/AuthLayout'
import AuthInput from './auth/AuthInput'
import PasswordInput from './auth/PasswordInput'
import AuthButton from './auth/AuthButton'
import AuthAlert from './auth/AuthAlert'


/**
 * Traduit les erreurs Firebase en messages utilisateur compréhensibles.
 */
function translateFirebaseError(message) {
  if (!message) return "Une erreur inconnue s'est produite."
  if (message.includes("auth/email-already-in-use")) return "Cette adresse email est déjà associée à un compte existant."
  if (message.includes("auth/weak-password")) return "Le mot de passe est trop court. Il doit contenir au moins 6 caractères."
  if (message.includes("auth/invalid-email")) return "Le format de l'adresse email n'est pas valide."
  if (message.includes("auth/network-request-failed")) return "Une erreur réseau est survenue. Vérifiez votre connexion et réessayez."
  if (message.includes("auth/operation-not-allowed")) return "La création de compte est temporairement désactivée."
  return "Une erreur est survenue. Veuillez réessayer."
}


function S_Inscrire() {

  //const [listeUsers, setListeUsers] = useState([]) — ancien code IndexDB conservé en commentaire
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [login, setLogin] = useState("") // conservé (non utilisé Firebase mais présent dans l'état original)
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const [load, setLoad] = useState(false)

  const formRef = useRef(null)

  // Erreurs de validation champ par champ
  const [fieldErrors, setFieldErrors] = useState({
    nom: null, email: null, password: null, password2: null,
  })

  // ─── Validation locale ─────────────────────────────────────────────────────
  const validateFields = () => {
    const errors = {}
    if (!nom.trim()) errors.nom = "Le nom complet est requis."
    if (!email) errors.email = "L'adresse email est requise."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format d'email invalide."
    if (!password) errors.password = "Le mot de passe est requis."
    else if (password.length < 6) errors.password = "Le mot de passe doit contenir au moins 6 caractères."
    if (!password2) errors.password2 = "Veuillez confirmer votre mot de passe."
    else if (password !== password2) errors.password2 = "Les mots de passe ne correspondent pas."
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ─── Inscription Firebase ──────────────────────────────────────────────────
  //  Ancienne logique IndexDB conservée en commentaire :
  /*const submitForm = (e) => {
      e.preventDefault()
      setLoad(true)
      const data = { nom, email, login, password }
      if (typeof window === "undefined") { return; }
      AddTodatabase("users", data, (e) => {
          if(e) {
              setListeUsers([...listeUsers, data])
              setRep(true)
              formRef.current.reset()
          } else { setRep(false) }
          setLoad(false)
      })
  }*/

  const submitForm = async (e) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!validateFields()) return

    try {
      setLoad(true)

      // Vérification confirmation — logique préservée
      if (password !== password2) {
        setFieldErrors((prev) => ({ ...prev, password2: "Les mots de passe ne correspondent pas." }))
        return
      }

      // Création compte Firebase — logique préservée
      const data = await createUserWithEmailAndPassword(InitAuth, email, password)

      // Mise à jour du profil — logique préservée
      await updateProfile(data.user, {
        displayName: nom,
      })

      // Email de vérification — logique préservée
      await sendEmailVerification(data.user)

      // Message de succès + reset formulaire — logique préservée
      setSuccessMsg(
        "Votre compte a été créé avec succès ! Un email de vérification vous a été envoyé. Vérifiez votre boîte de réception avant de vous connecter."
      )
      formRef.current.reset()
      setNom(""); setEmail(""); setPassword(""); setPassword2("")

    } catch (error) {
      const msg = translateFirebaseError(error?.message)
      setErrorMsg(msg)
      console.log("Erreur inscription:", error?.message)
    } finally {
      setLoad(false)
    }
  }

  //  Ancienne récupération IndexDB conservée en commentaire :
  /*useEffect(() => {
      if(typeof window === "undefined") return;
      getAllDataTodatabase("users", (e) => { setListeUsers(e) })
  }, [])*/


  // ─── Zone Branding ─────────────────────────────────────────────────────────
  const brandingContent = (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
        Commencez votre parcours financier
      </h1>
      <p className="text-white/70 text-base leading-relaxed">
        Créez votre compte gratuitement et prenez le contrôle de vos finances dès aujourd&apos;hui.
      </p>
    </div>
  )


  // ─── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <AuthLayout brandingContent={brandingContent}>

      {/* En-tête du formulaire */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-1">
          Créez votre compte
        </h2>
        <p className="text-sm text-[#475569]">
          Commencez à suivre vos budgets et vos dépenses simplement.
        </p>
      </div>

      {/* Alerte succès */}
      {successMsg && (
        <div className="mb-4">
          <AuthAlert
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg(null)}
            duration={8000}
          />
        </div>
      )}

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
      <form ref={formRef} onSubmit={submitForm} noValidate>
        <div className="flex flex-col gap-4">

          {/* Nom complet */}
          <AuthInput
            id="nom"
            label="Nom complet"
            type="text"
            placeholder="Jean Dupont"
            value={nom}
            onChange={(e) => {
              setNom(e.target.value)
              if (fieldErrors.nom) setFieldErrors((prev) => ({ ...prev, nom: null }))
            }}
            required
            icon={LuPenLine}
            error={fieldErrors.nom}
            autoComplete="name"
          />

          {/* Email */}
          <AuthInput
            id="email"
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }))
            }}
            required
            icon={LuMail}
            error={fieldErrors.email}
            autoComplete="email"
          />

          {/* Mot de passe avec indicateur de robustesse */}
          <PasswordInput
            id="password"
            label="Mot de passe"
            placeholder="6 caractères minimum"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }))
            }}
            required
            error={fieldErrors.password}
            autoComplete="new-password"
            showStrength={true}
            hint={!fieldErrors.password && "Minimum 6 caractères"}
          />

          {/* Confirmation mot de passe */}
          <PasswordInput
            id="password2"
            label="Confirmation du mot de passe"
            placeholder="Répétez votre mot de passe"
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value)
              if (fieldErrors.password2) setFieldErrors((prev) => ({ ...prev, password2: null }))
            }}
            required
            error={fieldErrors.password2}
            autoComplete="new-password"
          />

          {/* Bouton d'inscription */}
          <AuthButton
            id="btn-inscription"
            type="submit"
            loading={load}
            loadingText="Création du compte..."
            className="mt-2"
          >
            Créer mon compte
          </AuthButton>

        </div>
      </form>

      {/* Lien connexion */}
      <p className="text-center text-sm text-[#475569] mt-8">
        Vous avez déjà un compte ?{" "}
        <Link
          href="/connexion"
          id="lien-connexion"
          className="text-[#16a34a] hover:text-[#15803d] font-semibold transition-colors"
        >
          Se connecter
        </Link>
      </p>

    </AuthLayout>
  )
}

export default S_Inscrire
