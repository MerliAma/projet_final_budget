"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB'
import MessageErreur from './MessageErreur'
import { useRouter } from 'next/navigation'  //a la place de next/router
import { LuWallet} from 'react-icons/lu'
import { InitAuth } from '@/firebaseConfig'
import { GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'


function Se_connecter() {

    //const [login, setLogin] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rep, setRep] = useState(null) //le message de reponse en cas d'erreur...

    //Le loader
    const [load, setLoad] = useState(false)
    const [load2, setLoad2] = useState(false)

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

        } 
        finally {

            setLoad(false)
        }
    }

    //pour la connexion à Google
    const googleConnect = async () => {
        try {
            setLoad2(true)
            //on appel le provider(fournisseur ou methode de connexion)
            const provider = new GoogleAuthProvider()

            //on se connecte maintenant via google
            const data = await signInWithPopup(InitAuth, provider)

            if(!data?.user) {
                alert("Impossible de se connecter à votre compte google. reessayer ou verifier connexion")
                return;
            }
            //on recupere les infos de connexion
            const user = data?.user
            
            if(typeof window !== "undefined") 
                localStorage.setItem("InfosUser", JSON.stringify({
                idUser: user.uid,
                nomUser: user.displayName
            }))

            //on le redirige sur le tableau de bord
            router.push("/TableauBord")

        } catch (error) {
            const messageErr = error.message
            console.log(messageErr)
            alert("Une erreur s'est produite pendant la connexion à google")
        } 
        finally {
            setLoad2(false)
        }
    }



  return (
      <section className="bg-teal-600 h-full w-full absolute">
          <div className='bg-base-100/50 shadow-sm mx-5 lg:mx-60 mt-10 p-5 lg:p-10 rounded-t-full'>
              <div className="flex items-center justify-center gap-2 ms-2">
                  <LuWallet className='text-teal-900 text-5xl' />
                  <span className='text-4xl text-teal-900 font-bold'><i>T</i>op<i>B</i>udget</span>
              </div>
              <span className='flex justify-center mt-3 text-lg space-x-6 text-teal-900 italic'>- Ma Gestion de Budget simplifée -</span>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 card bg-base-100/50 mx-5 lg:mx-60 shadow-sm mb-10 mt-5'>
              
              {/* Formulaire de connexion */}
              <div className="border-0 lg:border-e lg:border-e-gray-600" id="MaCarte">
                  <figure className="px-10 pt-10 flex flex-col gap-3">
                      {/*<button type="button" className="ml-auto flex items-center gap-3 cursor-pointer hover:text-teal-950" id="Sign"  ><Link href="/Inscription">S'inscrire<i className="bi bi-arrow-right "></i></Link></button> */}
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

                      {(rep !== "" && rep !== null) && <MessageErreur message={rep} onClose={() => setRep(null)} />}
                  </div>
              </div>

              {/* s'inscrire et btn Google connexion */}
              <div className='flex flex-col gap-1 lg:gap-3 justify-center lg:mt-15 mx-auto p-5'>
                <span className='flex items-center justify-center gap-2 text-md'>
                    <span className='flex lg:hidden'>Pas de compte? </span>
                    <span className='hidden lg:flex'>Vous n'avez pas de compte?</span> <Link href="/Inscription" className="cursor-pointer hover:text-teal-950 font-bold" id="Sign" >Inscrivez-vous Ici</Link>
                </span>
                
                <div className='flex items-center justify-center gap-2'>
                    <span className='border-b border-b-gray-600 w-30'></span>
                    <h5 className='text-lg'>OU</h5>
                    <span className='border-b border-b-gray-600 w-30'></span>
                </div>

                {/* Google */}
                <button onClick={googleConnect} disabled={load2} className="btn bg-transparent mx-auto text-teal-950 border-[#e5e5e5] transition transform duration-200 hover:bg-teal-900 hover:text-white hover:scale-105 active:scale-95 shadow-lg hover:animate-none focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                
                {!load2 ? (
                    <span>Continuer avec Google</span>
                ) : (
                    <div className='flex items-center gap-3'>
                        <span className="loading loading-spinner loading-xl"></span>
                        <span>En cours de connexion...</span>
                    </div>
                )}

                </button>

              </div>
          </div>
      </section>
      
  )
}

export default Se_connecter
