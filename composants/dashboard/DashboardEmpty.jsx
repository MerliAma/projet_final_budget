"use client"
import React from 'react'
import Link from 'next/link'
import { LuPiggyBank, LuPlus, LuSparkles } from 'react-icons/lu'

export default function DashboardEmpty({ userName }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xs">
      
      {/* ── Icône d'accueil ──────────────────────────────── */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 text-[#16a34a] border border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <LuPiggyBank className="text-3xl sm:text-4xl" aria-hidden="true" />
      </div>

      {/* ── Message de bienvenue ─────────────────────────── */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-4 border border-emerald-200">
        <LuSparkles className="text-emerald-600 text-xs" aria-hidden="true" />
        <span>Bienvenue sur TopBudget</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
        Bonjour{userName ? ` ${userName}` : ''}, commencez par créer votre premier budget
      </h2>

      <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto mb-8 leading-relaxed">
        Vous n'avez pas encore défini de budget. Pour commencer à suivre vos dépenses, visualiser vos soldes restants et maîtriser vos finances, créez votre première catégorie budgétaire.
      </p>

      {/* ── CTA principal ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/Budget"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <LuPlus className="text-lg" aria-hidden="true" />
          <span>Créer mon premier budget</span>
        </Link>
      </div>

      {/* ── Conseils rapides ─────────────────────────────── */}
      <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {[
          { title: '1. Définissez', desc: 'Allouez un montant mensuel par poste (courses, loyer...)' },
          { title: '2. Enregistrez', desc: 'Ajoutez vos dépenses au fur et à mesure' },
          { title: '3. Maîtrisez', desc: 'Surveillez vos alertes et gardez le contrôle' },
        ].map((tip) => (
          <div key={tip.title} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-1">{tip.title}</h3>
            <p className="text-[11px] text-slate-500 leading-snug">{tip.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
