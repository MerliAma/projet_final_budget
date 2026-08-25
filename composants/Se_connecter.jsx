"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB'
import MessageErreur from './MessageErreur'
import { useRouter } from 'next/navigation'  //a la place de next/router
import { LuWallet} from 'react-icons/lu'
import { InitAuth } from '@/firebaseConfig'
import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'


function Se_connecter() {

    //const [login, setLogin] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rep, setRep] = useState(null) //le message de reponse en cas d'erreur...

    //Le loader
    const [load, setLoad] = useState(false)

    const router=useRouter()

    //on créé une reference au formulaire
    const formRef = useRef(null)

    //On recherche l'utilisateur dans la base de données indexDB (remplacer par firebase)
        /*const submitForm = (e) => {
            e.preventDefault()
    
            if (typeof window === "undefined") {
                return;
            }
            
            getOneDataTodatabase("users", { champ: "login", valeur: login }, (e) => {
                if(e) {
                    //si il a trouvé l'utilisateur...
                    if(e.password===password){
                        //enregistrer l'utilisateur dans localStorage
                        const infosUser={nomUser:e.nom, emailUser:e.email, loginUser:e.login, idUser:e.id}
                        localStorage.setItem("InfosUser", JSON.stringify(infosUser))
                        //rediriger vers le tableau de bord
                        router.push(`/TableauBord`)
                        setRep(true)
                    }
                    else{
                        setRep(false)
                    }
                }
                else{
                    setRep(false)
                }
            })
        }*/

        //On se connecte par email/mot de passe firebase
    const submitForm = async (e) => {
        e.preventDefault()
        try {

            setLoad(true) //On active le loader du bouton

            //connexion
            const data = await signInWithEmailAndPassword(InitAuth, email, password)

            //On verifie que l'email est verifié
            if (!data?.user?.emailVerified) {
                await sendEmailVerification(data.user) //On renvoie l'email de verification
                alert("Votre compte n'est pas encore verifié, un mail vous a été envoyé pour l'activer")
                return;
            }

            if (typeof window !== "undefined") {
                localStorage.setItem("InfosUser", JSON.stringify({
                    idUser: data.user.uid,
                    nomUser: data.user.displayName
                }))
            }

            //On affiche le message de succès
            setRep(true)
            //rediriger vers le tableau de bord
            router.push(`/TableauBord`)

        } catch (error) {

            const message = error?.message
            console.log("Erreur: ", message)

            setRep(
                (message === "Firebase: Error (auth/invalid-credential).") ? "Email ou mot de passe non valide" :
                    (message === "Firebase: Error (auth/too-many-requests).") ? "Trop de tentatives, reassayer plus tard" :
                        "Une erreur inconnue s'est produite"
            )
           //setRep()

        } finally {

            setLoad(false)
        }
    }


  return (
    <section className="bg-teal-700 h-full w-full absolute">
          <div className='bg-base-100/50 w-100 shadow-sm mx-auto mt-20 p-10 rounded-t-full'>
              <div className="flex items-center justify-center gap-2 ms-2"> 
                <LuWallet className='text-teal-900 text-5xl' />
                <span className='text-4xl text-teal-900 font-bold'><i>T</i>op<i>B</i>udget</span>
              </div>
              <span className='flex justify-center mt-3 text-lg space-x-6 text-teal-900 italic'>- Ma Gestion de Budget simplifée -</span>
          </div>

          <div className="card bg-base-100/50 w-100 shadow-sm mx-auto mb-25 mt-5" id="MaCarte">
          <figure className="px-10 pt-10 flex flex-col gap-3">
              <button type="button" className="ml-auto flex items-center gap-3 cursor-pointer hover:text-teal-950" id="Sign"  ><Link href="/Inscription">S'inscrire<i className="bi bi-arrow-right "></i></Link></button>
              <i className="bi bi-person-circle text-7xl" ></i>
          </figure>
          <div className="card-body items-center text-center">
              <form className="w-full" ref={formRef} onSubmit={(e) => submitForm(e)}>
                  {/*<input type="text" id="login" placeholder="login" onChange={(e) => setLogin(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0" />*/}
                  <input type="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0 bg-transparent autofill:bg-transparent autofill:transition-colors autofill:duration-[5000000s]" />
                  <input type="password" id="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required className="w-full h-8 py-5 px-2 mb-5 border-b border-b-gray-500 text-lg outline-0 ring-0 focus:outline-0 focus:ring-0" />
                  <div className="flex items-center justify-between">
                      <button type={!load ? "submit" : "button"} disabled={load} id="Connexion" className="btn bg-teal-800 hover:bg-teal-900 text-white font-semibold py-2 px-6 rounded-lg transition transform duration-200 hover:scale-105 active:scale-95 shadow-lg hover:animate-none focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        {!load ? (
                            <span>Se Connecter</span>
                        ) : (
                            <div className='flex items-center gap-3'>
                                <span className="loading loading-spinner loading-xl"></span>
                                <span>Connexion en cours...</span>
                            </div>
                        )}
                      </button>
                      <span className="text-sm text-gray-600 italic cursor-pointer">Mot de Passe oublié ?</span>
                  </div>
              </form>
              { (!rep!==null ) && <MessageErreur message={rep} onClose={() => setRep(null)} />}
          </div>
      </div>
    </section>
      
  )
}

export default Se_connecter
