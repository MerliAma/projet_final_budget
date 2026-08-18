"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'
import { AddTodatabase } from '@/lib/IndexDB/addToDB'
import MessageErreur from './MessageErreur'
import MessageOk from './MessageOk'

function S_Inscrire() {
  
    const [listeUsers, setListeUsers] = useState([]) //le tableau qui contiendra tous les users
    const [nom, setNom] = useState("")
    const [email, setEmail] = useState("")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [rep, setRep] = useState(null) //le message de reponse apres l'ajout d'un user

    //on créé une reference au formulaire
    const formRef = useRef(null)

    //On ajoute l'utilisateur dans indexDB
    const submitForm = (e) => {
        e.preventDefault()

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
        })
    }

    //On recupère les utilisateurs dans indexDb quand le composant est monté (page totalement chargé)
    useEffect(() => {

        if(typeof window === "undefined") return;

        getAllDataTodatabase("users", (e) => {
               setListeUsers(e)
        })

    }, [])

    console.log(listeUsers)

    return (
    <section className="bg-teal-700 h-full w-full absolute">
        <div className="card bg-base-100/50 w-100 shadow-sm mx-auto my-25" id="MaCarte">
          <figure className="px-10 pt-10 flex flex-col gap-3">
              <button type="button" className="ml-auto flex items-center gap-3 cursor-pointer hover:text-teal-950" id="Sign"><Link href="/">Se Connecter<i className="bi bi-arrow-right "></i></Link></button>
              <i className="bi bi-person-fill-add text-5xl"></i>
          </figure>
          <div className="card-body items-center text-center">
              <form className="w-full" ref={formRef} onSubmit={(e) => submitForm(e)} >
                  <input type="text" id="nom" placeholder="Nom Complet" onChange={(e) => setNom(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0" />
                  <input type="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0" />
                  <input type="text" id="login" placeholder="Login" onChange={(e) => setLogin(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0" />
                  <input type="password" id="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0" />
                  <div className="flex items-center justify-between">
                      <button type="submit" id="Connexion" className="btn bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2 px-6 rounded-lg transition transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:animate-none focus:outline-none focus:ring-2 focus:ring-indigo-300">S'inscrire</button>
                  </div>
              </form>
              {/* affichage du message de reponse apres l'ajout d'un user */}
              { rep!==null && (
                <>
                    {rep ? <MessageOk message={"Utilisateur ajouté avec succès"} onClose={() => setRep(null)} /> 
                    : <MessageErreur message={"Une erreur s'est produite"} onClose={() => setRep(null)} />}
                </>
              )}
          </div>
        </div>

           
    </section>
      
  )
}

export default S_Inscrire
