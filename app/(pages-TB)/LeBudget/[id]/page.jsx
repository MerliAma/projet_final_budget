import LeBudgetIntermd from '@/composants/LeBudgetIntermd'
import Link from 'next/link'
import React from 'react'
import { LuArrowLeft, LuPiggyBank } from 'react-icons/lu'

export const metadata = {
  title: "Détails du Budget",
  description: "Informations et dépenses du budget sélectionné",
}

const page = async ({ params }) => {
  const resolvedParams = await params
  const idBudget = resolvedParams.id

  return (
    <div className="w-full space-y-6">
      {/* ── En-tête avec bouton retour ─────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/Budget"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            title="Retour à mes budgets"
            aria-label="Retour à la liste des budgets"
          >
            <LuArrowLeft className="text-lg" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <LuPiggyBank className="text-emerald-600 text-xl" />
              <span>Détails du Budget</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Consultez les informations de l&apos;enveloppe et gérez ses dépenses rattachées.
            </p>
          </div>
        </div>

        <Link
          href="/Budget"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <LuArrowLeft className="text-sm" />
          <span>Tous les budgets</span>
        </Link>
      </div>

      {/* Contenu intermédiaire */}
      <LeBudgetIntermd idBudget={idBudget} />
    </div>
  )
}

export default page
