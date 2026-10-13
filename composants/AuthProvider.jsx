"use client"

import { InitAuth } from '@/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'
import { LuWallet } from 'react-icons/lu'
import BackofficeLayout from './layout/BackofficeLayout'

// Context d'authentification pour partager l'utilisateur avec tous les composants enfants
export const AuthContext = createContext({
  user: null,
  infosUser: null,
  setInfosUser: () => {},
  logout: () => {},
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [infosUser, setInfosUser] = useState(null)
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [load, setLoad] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return

    // 1. Vérification côté localStorage
    const infos = RecupInfosUserConnecte() || null
    setInfosUser(infos)
    
    if (!infos) {
      router.push("/connexion")
      return
    }

    // 2. Vérification côté Firebase
    const unsubscribe = onAuthStateChanged(InitAuth, (user) => {
      if (!user) {
        router.push("/connexion")
      } else {
        setFirebaseUser(user)
      }
      setLoad(false)
    })

    return () => unsubscribe()
  }, [router])

  // Fonction de déconnexion sécurisée
  const FirebaseLogout = async () => {
    try {
      await signOut(InitAuth)
      if (typeof window !== "undefined") {
        localStorage.removeItem('user')
        localStorage.removeItem('InfosUser')
      }
      router.push('/connexion')
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error)
      if (typeof window !== "undefined") {
        localStorage.removeItem('user')
        localStorage.removeItem('InfosUser')
      }
      router.push('/connexion')
    }
  }

  // Si en cours de vérification de l'authentification
  if (load) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] text-slate-800"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#16a34a] p-3.5 rounded-2xl shadow-lg animate-pulse">
            <LuWallet className="text-white text-3xl" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Top<span className="text-[#16a34a]">Budget</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
            <span className="loading loading-spinner loading-sm text-[#16a34a]"></span>
            <span>Chargement de votre espace...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      user: firebaseUser,
      infosUser: infosUser,
      setInfosUser: setInfosUser,
      logout: FirebaseLogout,
      loading: load,
    }}>
      <BackofficeLayout user={infosUser} onLogout={FirebaseLogout}>
        {children}
      </BackofficeLayout>
    </AuthContext.Provider>
  )
}

export default AuthProvider
