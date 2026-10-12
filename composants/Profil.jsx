"use client"
import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { InitAuth } from '@/firebaseConfig'
import { useAuth } from './AuthProvider'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'
import { LuUser, LuLock, LuMail, LuSlidersHorizontal } from 'react-icons/lu'

// Composants modulaires du Lot 8
import ProfileHeader from './profil/ProfileHeader'
import ProfileInfoForm from './profil/ProfileInfoForm'
import ProfilePasswordForm from './profil/ProfilePasswordForm'
import ProfileEmailForm from './profil/ProfileEmailForm'
import ProfilePreferences from './profil/ProfilePreferences'
import ProfileDangerZone from './profil/ProfileDangerZone'
import ProfileSkeleton from './profil/ProfileSkeleton'
import ToastNotification from './ui/ToastNotification'

/**
 * Profil — Refonte complète de la gestion du profil et des paramètres (Lot 8)
 * Supprime les anti-patterns (zéro manipulation directe du DOM via document.getElementById),
 * sépare rigoureusement la modification du nom et du mot de passe, résout l'import de verifyBeforeUpdateEmail,
 * et offre une navigation par onglets ergonomique et responsive.
 */
export default function Profil() {
  const { user: authUser, infosUser: authInfosUser, setInfosUser, logout } = useAuth()
  
  const [currentUser, setCurrentUser] = useState(authUser)
  const [infosUser, setLocalInfosUser] = useState(authInfosUser)
  const [isLoading, setIsLoading] = useState(!authUser)
  
  // Onglet actif : 'INFO' | 'SECURITY' | 'EMAIL' | 'SETTINGS'
  const [activeTab, setActiveTab] = useState('INFO')

  // Notification Toast
  const [toast, setToast] = useState(null)

  // Synchronisation avec Firebase Auth et localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const auth = InitAuth || getAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser(firebaseUser)
      }
      const localInfos = RecupInfosUserConnecte()
      if (localInfos) {
        setLocalInfosUser(localInfos)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Synchronisation avec les props de AuthContext si disponibles
  useEffect(() => {
    if (authUser) setCurrentUser(authUser)
    if (authInfosUser) setLocalInfosUser(authInfosUser)
  }, [authUser, authInfosUser])

  // Gestion du toast de notification
  const handleNotify = (type, message) => {
    setToast({ type, message })
  }

  // Callback après mise à jour réussie du profil
  const handleProfileUpdated = (updatedInfos) => {
    setLocalInfosUser(updatedInfos)
    if (setInfosUser) {
      setInfosUser(updatedInfos)
    }
  }

  if (isLoading) {
    return <ProfileSkeleton />
  }

  const TABS = [
    { id: 'INFO', label: 'Informations', icon: LuUser },
    { id: 'SECURITY', label: 'Mot de passe', icon: LuLock },
    { id: 'EMAIL', label: 'Adresse Email', icon: LuMail },
    { id: 'SETTINGS', label: 'Paramètres', icon: LuSlidersHorizontal },
  ]

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12">
      
      {/* ── 1. En-tête du profil (Avatar, Nom, Email, Statut) ──── */}
      <ProfileHeader user={currentUser} infosUser={infosUser} />

      {/* ── 2. Navigation par onglets responsive ──────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80 no-scrollbar" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`
                inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap
                ${isActive 
                  ? 'bg-[#16a34a] text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
                }
              `}
            >
              <Icon className="text-base" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── 3. Contenu de l'onglet actif ──────────────────────── */}
      <div className="transition-all">
        {activeTab === 'INFO' && (
          <ProfileInfoForm
            user={currentUser}
            infosUser={infosUser}
            onUpdateSuccess={handleProfileUpdated}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'SECURITY' && (
          <ProfilePasswordForm
            user={currentUser}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'EMAIL' && (
          <ProfileEmailForm
            user={currentUser}
            onNotify={handleNotify}
          />
        )}

        {activeTab === 'SETTINGS' && (
          <div className="space-y-6">
            <ProfilePreferences
              user={currentUser}
              onNotify={handleNotify}
            />
            <ProfileDangerZone
              onLogout={logout}
            />
          </div>
        )}
      </div>

      {/* ── Notification Toast accessible ────────────────────── */}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  )
}
