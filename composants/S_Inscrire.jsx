"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'
import { AddTodatabase } from '@/lib/IndexDB/addToDB'
import MessageErreur from './MessageErreur'
import MessageOk from './MessageOk'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { InitAuth } from '@/firebaseConfig'

function S_Inscrire() {
  
    //const [listeUsers, setListeUsers] = useState([]) //le tableau qui contiendra tous les users
    const [nom, setNom] = useState("")
    const [email, setEmail] = useState("")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [rep, setRep] = useState(null) //le message de reponse apres l'ajout d'un user

    //Le loader
    const [load, setLoad] = useState(false)

    //on créé une reference au formulaire
    const formRef = useRef(null)

    //On ajoute l'utilisateur dans indexDB (on remplace par firebase pour la sécurité)
    /*const submitForm = (e) => {
        e.preventDefault()

        setLoad(true)
        const data = { nom, email, login, password }

        if (typeof window === "undefined") {
            return;
        }

        AddTodatabase("users", data, (e) => {
            if(e) {
                setListeUsers([...listeUsers, data])
                 //const rep = e ? "Utilisateur ajouté avec succès" : "Une erreur s'est produite"
                 setRep(true) 
                 formRef.current.reset() //Renitialise le formulaire
            }
            else{
                setRep(false)
            }
            setLoad(false)
        })
    }*/

    //On créé l'utilisateur par email/mot de passe
    const submitForm = async (e) => {
        e.preventDefault()
        try {

            setLoad(true) //On active le loader du bouton

            //code pour fireBase Authentication
            //On ajoute le users dans firebase
            const data = await createUserWithEmailAndPassword(InitAuth, email, password)

            //On ajoute le nom de l'utilisateur
            await updateProfile(data.user, {
                displayName: nom
            })

            //On envoi un email de confirmation de compte
            await sendEmailVerification(data.user)

            //On affiche le message de succès
            setRep(true)
            formRef.current.reset() //Renitialise le formulaire

        } catch (error) {

            const message = error?.message
            console.log("Erreur: ", message)

            /*setRep(
                (message === "Firebase: Error (auth/email-already-in-use).") ? "Email déjà utilisé" :
                    (message === "Firebase: Password should be at least 6 characters (auth/weak-password).") ? "Mot de passe trop court, 6 caractères minimum" :
                        "Une erreur inconnue s'est produit"
            )*/
           setRep(false)

        } finally {

            setLoad(false)
        }
    }

    //On recupère les utilisateurs dans indexDb quand le composant est monté (page totalement chargé)
    /*useEffect(() => {

        if(typeof window === "undefined") return;

        getAllDataTodatabase("users", (e) => {
               setListeUsers(e)
        })

    }, [])*/

    //console.log(listeUsers)

    return (
    <section className="bg-teal-700 h-full w-full absolute">
        <div className="card bg-base-100/50 w-100 shadow-sm mx-auto my-25" id="MaCarte">
          <figure className="px-10 pt-10 flex flex-col gap-3">
              <button type="button" className="ml-auto flex items-center gap-3 cursor-pointer hover:text-teal-950" id="Sign"><Link href="/">Se Connecter<i className="bi bi-arrow-right "></i></Link></button>
              <i className="bi bi-person-fill-add text-5xl"></i>
          </figure>
          <div className="card-body items-center text-center">
              <form className="w-full" ref={formRef} onSubmit={(e) => submitForm(e)} >
                  <input type="text" id="nom" placeholder="Nom Complet" onChange={(e) => setNom(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 bg-transparent autofill:bg-transparent autofill:transition-colors autofill:duration-[5000000s] " />
                  <input type="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 bg-transparent autofill:bg-transparent autofill:transition-colors autofill:duration-[5000000s]" />
                  {/*<input type="text" id="login" placeholder="Login" onChange={(e) => setLogin(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 bg-transparent autofill:bg-transparent autofill:transition-colors autofill:duration-[5000000s]" />*/}
                  <input type="password" id="password" placeholder="Mot de passe (6 caractères minimum)" onChange={(e) => setPassword(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 " />
                  <div className="flex items-center justify-between">
                      <button type={!load ? "submit" : "button"} disabled={load} id="Connexion" className="btn bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2 px-6 rounded-lg transition transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:animate-none focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        
                        {!load ? (
                            <span>S'inscrire</span>
                        ) : (
                            <div className='flex items-center gap-3'>
                                <span className="loading loading-spinner loading-xl"></span>
                                <span>En cours de traitement...</span>
                            </div>
                        )}
                      </button>
                  </div>
              </form>
              {/* affichage du message de reponse apres l'ajout d'un user */}
              { rep!==null && (
                <>
                    {rep ? <MessageOk message={"Utilisateur ajouté avec succès. Un Mail de confirmation vous a été envoyé."} onClose={() => setRep(null)} /> 
                    : <MessageErreur message={"Une erreur s'est produite"} onClose={() => setRep(null)} />}
                </>
              )}
          </div>
        </div>

           
    </section>
      
  )
}

export default S_Inscrire
