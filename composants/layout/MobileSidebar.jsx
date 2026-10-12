"use client"
import React, { useEffect } from 'react'
import { LuX } from 'react-icons/lu'
import Sidebar from './Sidebar'

/**
 * MobileSidebar — Drawer mobile avec backdrop blur et transition fluide
 */
export default function MobileSidebar({ isOpen, onClose, user, onLogout }) {
  // Empêche le défilement du body lorsque le drawer mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Ferme sur touche Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation mobile"
    >
      {/* Backdrop sombre avec flou */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panneau coulissant */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-slide-right">
        
        {/* Bouton de fermeture en haut à droite du drawer */}
        <div className="absolute top-4 right-3 z-10">
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer le menu de navigation"
          >
            <LuX className="text-xl" aria-hidden="true" />
          </button>
        </div>

        {/* Sidebar contenue dans le drawer */}
        <div className="h-full flex flex-col">
          <Sidebar 
            user={user} 
            onLogout={() => {
              onClose()
              onLogout()
            }} 
            onCloseMobile={onClose} 
          />
        </div>

      </div>
    </div>
  )
}
