"use client"
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { LuEye, LuEyeOff, LuLock, LuMail, LuPenLine, LuUser } from 'react-icons/lu'

function Profil() {
  
  const [nom, setNom] = useState("")
  const [password, setPassword] = useState("") //ancien password
  const [password2, setPassword2] = useState("") //nouveau password
  const [voirPassword, setVoirPassword]=useState(false)
  const [voirPassword2, setVoirPassword2]=useState(false)
  const [rep, setRep] = useState(null) //le message de reponse apres l'ajout d'un user
  
  //Le loader
  const [load, setLoad] = useState(false)
  
  //on créé une reference au formulaire
  const formRef = useRef(null)

  //pr récupérer l'email, le nom et les afficher
  /*Puisque l'initialisation de l'authentification peut prendre un bref instant au chargement de la page, 
  il est recommandé d'utiliser un observateur (onAuthStateChanged) pour éviter que currentUser ne soit null par erreur */
  const auth = getAuth();

  useEffect(() => {

    if (typeof window === "undefined") return;

    onAuthStateChanged(auth, (user) => {
      const emailUser = user ? user.email : ""
      document.getElementById("email").value = emailUser
      document.getElementById("nom1").value = user ? user.displayName : ""
    })

  }, [])

  //fonction de modification des informations
  const submitForm = async (e) => {
    e.preventDefault()
    try {

      setLoad(true) //On active le loader du bouton

      //on modifie le mot de passe
      /*Firebase exige que l'utilisateur se soit authentifié récemment pour pouvoir modifier son mot de passe. Si sa 
      connexion est trop ancienne, updatePassword() échouera avec une erreur du type auth/requires-recent-login.
      Dans ce cas, il faut d'abord réauthentifier l'utilisateur */
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        user.email,
        password
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, password2);

      //on met à jour maintenant le nom
      await updateProfile(user, {
        displayName: nom
      })

      //On affiche le message de succès
      setRep(true)
      formRef.current.reset() //Renitialise le formulaire

    } catch (error) {

      const message = error?.message
      console.log("Erreur: ", message)

      /*setRep(
          (message === "Firebase: Error (auth/email-already-in-use).") ? "Email déjà utilisé" :
              (message === "Firebase: Password should be at least 6 characters (auth/weak-password).") ? "Mot de passe trop court, 6 caractères minimum" :
                  "Une erreur inconnue s'est produite"
      )*/
      //setRep(false)

    } finally {

      setLoad(false)
    }
  }
  
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3'>
      {/* Grille 1 */}
      <div className='flex flex-col gap-5 mb-5 lg:mb-0'>
        <div className='mx-auto my-auto p-10 rounded-full bg-gray-300'>
          <LuUser className='text-7xl'/>
        </div>
        
        {/* infos personnels */}
        <span className='flex items-center gap-3'>
          <LuPenLine className='text-gray-600 text-lg' />
          <input type="email" id="nom1" disabled className="w-full text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 bg-transparent" />
        </span>
        <span className='flex items-center gap-3'>
          <LuMail className='text-gray-600 text-lg' />
          <input type="email" id="email" disabled className="w-full text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 bg-transparent" />
        </span>
          
      </div>

      {/* Grille 2 */}
      <div className='col-span-2 border-l border-l-gray-500 p-10'>
        <form className="w-full" ref={formRef} onSubmit={(e) => submitForm(e)} >

          <span className='relative'>
            <LuPenLine className='text-gray-600 text-lg absolute bottom-0' />
            <input type="text" id="nom" placeholder="Nom Complet" onChange={(e) => setNom(e.target.value)} required className="w-full h-8 py-5 px-7 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 bg-transparent autofill:bg-transparent autofill:transition-colors autofill:duration-[5000000s] " />
          </span>

          <span className='relative'>
            <LuLock className='text-gray-600 text-lg absolute bottom-0' />
            <input type={voirPassword ? "text" : "password"} id="password" placeholder="Ancien Mot de passe" onChange={(e) => setPassword(e.target.value)} required className="w-full h-8 py-5 px-7 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 " />
            {
              voirPassword ?
                <LuEye onClick={() => setVoirPassword(false)} className='text-gray-600 text-lg absolute bottom-0 right-0 cursor-pointer' />
                :
                <LuEyeOff onClick={() => setVoirPassword(true)} className='text-gray-600 text-lg absolute bottom-0 right-0 cursor-pointer' />
            }
          </span>

           <span className='relative'>
            <LuLock className='text-gray-600 text-lg absolute bottom-0' />
            <input type={voirPassword2 ? "text" : "password"} id="password2" placeholder="Nouveau Mot de passe (6 caractères minimum)" onChange={(e) => setPassword2(e.target.value)} required className="w-full h-8 py-5 px-7 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 " />
            {
              voirPassword2 ?
                <LuEye onClick={() => setVoirPassword2(false)} className='text-gray-600 text-lg absolute bottom-0 right-0 cursor-pointer' />
                :
                <LuEyeOff onClick={() => setVoirPassword2(true)} className='text-gray-600 text-lg absolute bottom-0 right-0 cursor-pointer' />
            }
          </span>

          <div className="flex items-center justify-between">
            <button type={!load ? "submit" : "button"} disabled={load} id="Connexion" className="btn bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2 px-6 rounded-lg transition transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:animate-none focus:outline-none focus:ring-2 focus:ring-indigo-300">
              {!load ? (
                <span>Modifier mes informations</span>
              ) : (
                <div className='flex items-center gap-3'>
                  <span className="loading loading-spinner loading-xl"></span>
                  <span>En cours de traitement...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profil
