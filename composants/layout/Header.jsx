"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LuMenu, LuPlus, LuWallet } from 'react-icons/lu'
import UserMenu from './UserMenu'

const ROUTE_CONFIG = {
  '/TableauBord': {
    title: 'Tableau de bord',
    category: 'Vue d’ensemble',
  },
  '/Budget': {
    title: 'Mes Budgets',
    category: 'Gestion financière',
  },
  '/Transaction': {
    title: 'Mes Transactions',
    category: 'Historique des dépenses',
  },
  '/Statistiques': {
    title: 'Statistiques & Analyses',
    category: 'Analyses financières',
  },
  '/Profil': {
    title: 'Mon Compte',
    category: 'Paramètres du profil',
  },
}

export default function Header({ user, onLogout, onOpenMobile }) {
  const pathname = usePathname()

  // Détermination du titre et de la catégorie selon l'URL
  let currentConfig = ROUTE_CONFIG[pathname]
  if (!currentConfig && pathname.startsWith('/LeBudget')) {
    currentConfig = {
      title: 'Détails du Budget',
      category: 'Gestion financière',
    }
  }

  const title = currentConfig?.title || 'Espace Personnel'
  const category = currentConfig?.category || 'TopBudget'

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all">
      
      {/* ── Gauche : Menu Mobile + Titre contextuel ───────── */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Hamburger mobile */}
        <button
          onClick={onOpenMobile}
          type="button"
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Ouvrir le menu de navigation"
        >
          <LuMenu className="text-xl" aria-hidden="true" />
        </button>

        {/* Logo mini pour mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="bg-[#16a34a] p-1.5 rounded-lg text-white">
            <LuWallet className="text-base" aria-hidden="true" />
          </div>
          <span className="font-bold text-slate-900 text-sm">
            Top<span className="text-[#16a34a]">Budget</span>
          </span>
        </div>

        {/* Titre de page et fil d'ariane (Desktop) */}
        <div className="hidden lg:flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {category}
          </span>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h1>
        </div>

      </div>

      {/* ── Droite : Actions rapides & Menu Utilisateur ───── */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        
        {/* Action rapide : Nouveau Budget */}
        {pathname !== '/Budget' && (
          <Link
            href="/Budget"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            <LuPlus className="text-sm" aria-hidden="true" />
            <span>Nouveau budget</span>
          </Link>
        )}

        {/* Action rapide : Ajouter Transaction */}
        {pathname !== '/Transaction' && (
          <Link
            href="/Transaction"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors shadow-xs"
          >
            <LuPlus className="text-sm" aria-hidden="true" />
            <span>Dépense</span>
          </Link>
        )}

        {/* Séparateur discret */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1" aria-hidden="true" />

        {/* Menu déroulant Utilisateur */}
        <UserMenu user={user} onLogout={onLogout} />

      </div>

    </header>
  )
}
