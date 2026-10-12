import Link from 'next/link'
import { LuWallet, LuLayoutDashboard, LuArrowLeft } from 'react-icons/lu'

export const metadata = {
  title: 'Page non trouvée — TopBudget',
  description: 'La page demandée est introuvable sur TopBudget.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 text-center shadow-xs space-y-6 animate-scale-in">
        
        {/* Logo TopBudget */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="bg-[#16a34a] p-3 rounded-2xl text-white shadow-md">
            <LuWallet className="text-2xl" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Top<span className="text-[#16a34a]">Budget</span>
          </span>
        </div>

        {/* Code 404 */}
        <div className="space-y-2">
          <span className="text-6xl font-black text-slate-200 block">404</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Page introuvable
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/TableauBord"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white transition-all shadow-xs cursor-pointer"
          >
            <LuLayoutDashboard className="text-base" aria-hidden="true" />
            <span>Tableau de bord</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <LuArrowLeft className="text-base" aria-hidden="true" />
            <span>Connexion</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
