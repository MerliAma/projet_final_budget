"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LuLayoutDashboard, 
  LuPiggyBank, 
  LuArrowLeftRight, 
  LuChartPie,
  LuUser, 
  LuLogOut, 
  LuWallet,
  LuChevronRight
} from 'react-icons/lu'

/**
 * Navigation principale du back-office
 * Adapte les entrées aux fonctionnalités réelles de l'application
 */
const NAV_ITEMS = [
  {
    label: 'Tableau de bord',
    href: '/TableauBord',
    icon: LuLayoutDashboard,
    badge: null,
  },
  {
    label: 'Mes Budgets',
    href: '/Budget',
    icon: LuPiggyBank,
    badge: null,
    matchPrefix: ['/LeBudget'],
  },
  {
    label: 'Mes Transactions',
    href: '/Transaction',
    icon: LuArrowLeftRight,
    badge: null,
  },
  {
    label: 'Statistiques',
    href: '/Statistiques',
    icon: LuChartPie,
    badge: null,
  },
]

const ACCOUNT_ITEMS = [
  {
    label: 'Mon Profil',
    href: '/Profil',
    icon: LuUser,
  },
]

export default function Sidebar({ user, onLogout, onCloseMobile }) {
  const pathname = usePathname()

  const isActive = (item) => {
    if (pathname === item.href) return true
    if (item.matchPrefix) {
      return item.matchPrefix.some(prefix => pathname.startsWith(prefix))
    }
    return false
  }

  // Initiales de l'utilisateur pour l'avatar
  const userInitial = user?.nomUser ? user.nomUser.charAt(0).toUpperCase() : 'U'
  const userName = user?.nomUser || 'Utilisateur'
  const userEmail = user?.emailUser || user?.email || ''

  return (
    <aside className="h-full flex flex-col justify-between bg-white border-r border-slate-200 select-none">
      
      {/* ── Haut : Logo & Navigation ────────────────────── */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5">
        
        {/* Brand / Logo */}
        <Link 
          href="/TableauBord"
          onClick={onCloseMobile}
          className="flex items-center gap-3 px-3 py-2 mb-6 rounded-xl hover:bg-slate-50 transition-colors group"
        >
          <div className="bg-[#16a34a] p-2.5 rounded-xl shadow-md text-white group-hover:scale-105 transition-transform">
            <LuWallet className="text-xl" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
              Top<span className="text-[#16a34a]">Budget</span>
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Gestion de budget
            </span>
          </div>
        </Link>

        {/* Section Navigation Principale */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Menu principal
          </p>
          <nav className="space-y-1" aria-label="Navigation principale">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`
                    group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${active 
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Indicateur actif gauche */}
                  {active && (
                    <span 
                      className="absolute left-0 top-2 bottom-2 w-1 bg-[#16a34a] rounded-r-md" 
                      aria-hidden="true" 
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon 
                      className={`text-lg transition-colors ${
                        active ? 'text-[#16a34a]' : 'text-slate-400 group-hover:text-slate-700'
                      }`} 
                      aria-hidden="true" 
                    />
                    <span>{item.label}</span>
                  </div>

                  {active && (
                    <LuChevronRight className="text-sm text-emerald-600" aria-hidden="true" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Section Compte */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Compte & Réglages
          </p>
          <nav className="space-y-1" aria-label="Menu du compte">
            {ACCOUNT_ITEMS.map((item) => {
              const active = isActive(item)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`
                    group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${active 
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <span 
                      className="absolute left-0 top-2 bottom-2 w-1 bg-[#16a34a] rounded-r-md" 
                      aria-hidden="true" 
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <Icon 
                      className={`text-lg transition-colors ${
                        active ? 'text-[#16a34a]' : 'text-slate-400 group-hover:text-slate-700'
                      }`} 
                      aria-hidden="true" 
                    />
                    <span>{item.label}</span>
                  </div>
                  {active && (
                    <LuChevronRight className="text-sm text-emerald-600" aria-hidden="true" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

      </div>

      {/* ── Bas : Carte Utilisateur & Déconnexion ────────── */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60">
        
        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
            {userInitial}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold text-slate-900 truncate" title={userName}>
              {userName}
            </span>
            {userEmail ? (
              <span className="text-xs text-slate-400 truncate" title={userEmail}>
                {userEmail}
              </span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">
                Compte actif
              </span>
            )}
          </div>
        </div>

        {/* Bouton de Déconnexion */}
        <button
          onClick={onLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-100"
          aria-label="Se déconnecter de votre compte"
        >
          <LuLogOut className="text-sm" aria-hidden="true" />
          <span>Se déconnecter</span>
        </button>

      </div>

    </aside>
  )
}
