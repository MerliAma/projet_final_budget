"use client"
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { LuMail, LuWallet } from 'react-icons/lu'
import { InitAuth } from '@/firebaseConfig'
import { GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'

// Composants Auth réutilisables
import AuthLayout from './auth/AuthLayout'
import AuthInput from './auth/AuthInput'
import PasswordInput from './auth/PasswordInput'
import AuthButton from './auth/AuthButton'
import AuthAlert from './auth/AuthAlert'

// Anciens imports conservés (logique non modifiée)
// import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB'
import GetMesBudgets from '@/mesFonctions/GetMesBudgets'


/**
 * Traduit les erreurs Firebase en messages utilisateur compréhensibles.
 */
function translateFirebaseError(message) {
  if (!message) return "Une erreur inconnue s'est produite."
  if (message.includes("auth/invalid-credential")) return "L'adresse email ou le mot de passe est incorrect."
  if (message.includes("auth/too-many-requests")) return "Trop de tentatives. Veuillez réessayer dans quelques minutes."
  if (message.includes("auth/user-disabled")) return "Ce compte a été désactivé. Contactez le support."
  if (message.includes("auth/network-request-failed")) return "Une erreur réseau est survenue. Vérifiez votre connexion et réessayez."
  if (message.includes("auth/popup-closed-by-user")) return "La fenêtre de connexion a été fermée. Réessayez."
  if (message.includes("auth/cancelled-popup-request")) return null // Ignore — action annulée volontairement
  return "Une erreur est survenue. Veuillez réessayer."
}


function Se_connecter() {

  //const [login, setLogin] = useState("") — ancien code IndexDB conservé en commentaire
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState(null)
  const [emailVerifMsg, setEmailVerifMsg] = useState(null)

  // Loaders
  const [load, setLoad] = useState(false)   // loader bouton email/password
  const [load2, setLoad2] = useState(false) // loader bouton Google

  const router = useRouter()
  const formRef = useRef(null)

  // Erreurs de validation champ par champ
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null })

  // ─── Validation locale ─────────────────────────────────────────────────────
  const validateFields = () => {
    const errors = {}
    if (!email) errors.email = "L'adresse email est requise."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format d'email invalide."
    if (!password) errors.password = "Le mot de passe est requis."
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ─── Connexion email / mot de passe ────────────────────────────────────────
  //  Ancienne logique IndexDB conservée en commentaire :
  /*const submitForm = (e) => {
      e.preventDefault()
      if (typeof window === "undefined") { return; }
      getOneDataTodatabase("users", { champ: "login", valeur: login }, (e) => {
          if(e) {
              if(e.password===password){
                  const infosUser={nomUser:e.nom, emailUser:e.email, loginUser:e.login, idUser:e.id}
                  localStorage.setItem("InfosUser", JSON.stringify(infosUser))
                  router.push(`/TableauBord`)
                  setRep(true)
              } else { setRep(false) }
          } else { setRep(false) }
      })
  }*/

  const submitForm = async (e) => {
    e.preventDefault()
    setErrorMsg(null)
    setEmailVerifMsg(null)

    if (!validateFields()) return

    try {
      setLoad(true)

      // Connexion Firebase — logique préservée
      const data = await signInWithEmailAndPassword(InitAuth, email, password)

      // Vérification email — logique préservée
      if (!data?.user?.emailVerified) {
        await sendEmailVerification(data.user)
        // Remplace l'ancien alert() par un message intégré
        setEmailVerifMsg("Votre compte n'est pas encore vérifié. Un nouvel email de vérification vous a été envoyé.")
        return
      }

      // Sauvegarde localStorage — logique préservée
      if (typeof window !== "undefined") {
        localStorage.setItem("InfosUser", JSON.stringify({
          idUser: data.user.uid,
          nomUser: data.user.displayName,
        }))
      }

      // Redirection — logique préservée
      router.push(`/TableauBord`)

    } catch (error) {
      const msg = translateFirebaseError(error?.message)
      if (msg) setErrorMsg(msg)
      console.log("Erreur connexion:", error?.message)
    } finally {
      setLoad(false)
    }
  }

  // ─── Connexion Google ───────────────────────────────────────────────────────
  const googleConnect = async () => {
    setErrorMsg(null)
    try {
      setLoad2(true)

      // Logique Google préservée
      const provider = new GoogleAuthProvider()
      const data = await signInWithPopup(InitAuth, provider)

      if (!data?.user) {
        setErrorMsg("Impossible de se connecter avec Google. Vérifiez votre connexion et réessayez.")
        return
      }

      const user = data?.user

      // localStorage préservé
      if (typeof window !== "undefined") {
        localStorage.setItem("InfosUser", JSON.stringify({
          idUser: user.uid,
          nomUser: user.displayName,
        }))
      }

      // Redirection préservée
      router.push("/TableauBord")

    } catch (error) {
      const msg = translateFirebaseError(error?.message)
      if (msg) setErrorMsg(msg)
      console.log("Erreur Google:", error?.message)
    } finally {
      setLoad2(false)
    }
  }


  // ─── Zone Branding ─────────────────────────────────────────────────────────
  const brandingContent = (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
        Reprenez le contrôle de vos finances
      </h1>
      <p className="text-white/70 text-base leading-relaxed">
        Suivez vos budgets, analysez vos dépenses et atteignez vos objectifs financiers.
      </p>
    </div>
  )


  // ─── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <AuthLayout brandingContent={brandingContent}>

      {/* En-tête du formulaire */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] mb-1">
          Bienvenue !
        </h2>
        <p className="text-sm text-[#475569]">
          Connectez-vous pour retrouver vos budgets et suivre vos dépenses.
        </p>
      </div>

      {/* Alerte email non vérifié */}
      {emailVerifMsg && (
        <div className="mb-4">
          <AuthAlert
            type="info"
            message={emailVerifMsg}
            onClose={() => setEmailVerifMsg(null)}
            duration={8000}
          />
        </div>
      )}

      {/* Alerte erreur globale */}
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

          {/* Champ email */}
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

          {/* Champ mot de passe */}
          <div className="flex flex-col gap-1">
            <PasswordInput
              id="password"
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }))
              }}
              required
              error={fieldErrors.password}
              autoComplete="current-password"
            />

            {/* Lien mot de passe oublié */}
            <div className="flex justify-end mt-1">
              <Link
                href="/mot-de-passe-oublie"
                className="text-xs text-[#16a34a] hover:text-[#15803d] font-medium transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          {/* Bouton de connexion */}
          <AuthButton
            id="btn-connexion"
            type="submit"
            loading={load}
            loadingText="Connexion en cours..."
            className="mt-2"
          >
            Se connecter
          </AuthButton>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-1" aria-hidden="true">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="text-xs text-[#94a3b8] font-medium">OU</span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          {/* Bouton Google */}
          <AuthButton
            id="btn-google"
            type="button"
            onClick={googleConnect}
            loading={load2}
            loadingText="Connexion en cours..."
            variant="outline"
          >
            {/* Logo Google SVG inline */}
            <svg aria-hidden="true" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <g>
                <path d="m0 0H512V512H0" fill="#fff" />
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
              </g>
            </svg>
            Continuer avec Google
          </AuthButton>

        </div>
      </form>

      {/* Lien inscription */}
      <p className="text-center text-sm text-[#475569] mt-8">
        Pas encore de compte ?{" "}
        <Link
          href="/Inscription"
          id="lien-inscription"
          className="text-[#16a34a] hover:text-[#15803d] font-semibold transition-colors"
        >
          Créer un compte
        </Link>
      </p>

    </AuthLayout>
  )
}

export default Se_connecter
