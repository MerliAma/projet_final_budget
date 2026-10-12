"use client"
import React from 'react'
import { LuWallet } from 'react-icons/lu'
import Link from 'next/link'

/**
 * AuthLayout — Layout principal des pages d'authentification
 * Structure 2 colonnes sur desktop, 1 colonne sur mobile.
 * Zone de branding à gauche, formulaire à droite.
 */
function AuthLayout({ children, brandingContent }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc]">
      
      {/* ── Zone Branding (gauche / haut) ────────────────── */}
      <div className="
        relative flex flex-col items-center justify-center
        bg-[#14532d] text-white overflow-hidden
        px-8 py-10
        lg:w-1/2 lg:min-h-screen
        lg:px-14 lg:py-16
      ">
        {/* Cercles décoratifs en arrière-plan */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] pointer-events-none" aria-hidden="true" />

        {/* Contenu branding */}
        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left max-w-md w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#16a34a] p-2.5 rounded-xl shadow-lg">
              <LuWallet className="text-white text-2xl" aria-hidden="true" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              TopBudget
            </span>
          </div>

          {/* Tagline */}
          <p className="text-[#bbf7d0] text-sm font-medium uppercase tracking-widest mb-8">
            Ma Gestion de Budget simplifiée
          </p>

          {/* Contenu personnalisable par page */}
          {brandingContent}

          {/* Features */}
          <div className="hidden lg:flex flex-col gap-4 mt-10">
            {[
              { icon: "📊", label: "Suivez vos dépenses en temps réel" },
              { icon: "💰", label: "Gérez vos budgets par catégorie" },
              { icon: "📈", label: "Analysez vos habitudes financières" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-white/80 text-sm">
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone Formulaire (droite / bas) ────────────────── */}
      <div className="
        flex flex-col items-center justify-center
        flex-1 px-6 py-10
        lg:px-14 lg:py-16
        bg-[#f8fafc]
      ">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  )
}

export default AuthLayout
