"use client"
import React from 'react'
import { LuShieldCheck, LuCalendar, LuMail, LuUser, LuClock } from 'react-icons/lu'

/**
 * ProfileHeader — Bannière d'en-tête du profil utilisateur
 * Affiche l'avatar, le nom complet, l'email, la date d'inscription et le statut du compte.
 */
export default function ProfileHeader({ user, infosUser }) {
  const nomAffiche = infosUser?.nomUser || user?.displayName || 'Utilisateur'
  const emailAffiche = user?.email || infosUser?.email || ''
  const initial = nomAffiche.charAt(0).toUpperCase()

  // Date de création du compte formatée
  const dateCreation = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : null

  // Date de dernière connexion
  const derniereConnexion = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        
        {/* Avatar avec initiale */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-extrabold flex items-center justify-center text-3xl sm:text-4xl shadow-md border-4 border-emerald-50">
            {initial}
          </div>
          <div 
            className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 text-white rounded-xl shadow-xs border-2 border-white"
            title="Compte actif"
          >
            <LuShieldCheck className="text-sm" aria-hidden="true" />
          </div>
        </div>

        {/* Détails du profil */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight capitalize truncate">
              {nomAffiche}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <LuShieldCheck className="text-xs" aria-hidden="true" />
              <span>{user?.emailVerified ? 'Email vérifié' : 'Compte actif'}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs sm:text-sm text-slate-500">
            {emailAffiche && (
              <span className="flex items-center gap-1.5 truncate">
                <LuMail className="text-slate-400 text-sm" aria-hidden="true" />
                <span>{emailAffiche}</span>
              </span>
            )}

            {dateCreation && (
              <span className="flex items-center gap-1.5 capitalize">
                <LuCalendar className="text-slate-400 text-sm" aria-hidden="true" />
                <span>Membre depuis {dateCreation}</span>
              </span>
            )}

            {derniereConnexion && (
              <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                <LuClock className="text-xs" aria-hidden="true" />
                <span>Dernière visite : {derniereConnexion}</span>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
