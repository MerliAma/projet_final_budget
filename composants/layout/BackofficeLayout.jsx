"use client"
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import Header from './Header'

/**
 * BackofficeLayout — Structure commune de l'espace connecté
 * 
 * Layout:
 * ┌───────────────┬──────────────────────────────────┐
 * │   SIDEBAR     │             HEADER               │
 * │   (Desktop)   ├──────────────────────────────────┤
 * │               │                                  │
 * │               │           PAGE CONTENT           │
 * │               │                                  │
 * └───────────────┴──────────────────────────────────┘
 */
export default function BackofficeLayout({ children, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      
      {/* ── Sidebar Desktop (Fixe à gauche sur lg+) ───────── */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40">
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* ── Drawer Mobile / Tablette ──────────────────────── */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      {/* ── Zone Principale (Décalée de la largeur de la sidebar) ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Header commun */}
        <Header
          user={user}
          onLogout={onLogout}
          onOpenMobile={() => setMobileMenuOpen(true)}
        />

        {/* Contenu de la page avec espacement harmonieux */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>

      </div>

    </div>
  )
}
