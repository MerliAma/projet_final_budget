"use client"
import React from 'react'
import Link from 'next/link'
import { 
  LuLightbulb, 
  LuArrowUpRight, 
  LuTriangleAlert, 
  LuCircleCheck, 
  LuInfo, 
  LuTrendingDown, 
  LuTrendingUp,
  LuSparkles
} from 'react-icons/lu'

/**
 * RecommandationCard — Carte individuelle pour une recommandation IA personnalisée.
 * Présentation aérée, sobre et percutante pour éviter toute surcharge visuelle.
 */
export default function RecommandationCard({ rec, onDismiss }) {
  if (!rec) return null

  // Détermination de l'icône thématique
  let TypeIcon = LuSparkles
  if (rec.type === 'alerte') TypeIcon = LuTriangleAlert
  else if (rec.type === 'vigilance') TypeIcon = LuInfo
  else if (rec.type === 'optimisation') TypeIcon = LuTrendingUp
  else if (rec.type === 'succes') TypeIcon = LuCircleCheck
  else if (rec.type === 'habitude') TypeIcon = LuTrendingDown

  return (
    <article 
      className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
      aria-labelledby={`rec-title-${rec.id}`}
    >
      <div>
        {/* ── Ligne 1 : Badge catégorie & Chiffre clé saillant ──── */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${rec.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${rec.dotColor}`} aria-hidden="true" />
            <TypeIcon className="text-xs shrink-0" aria-hidden="true" />
            <span>{rec.categorie}</span>
          </span>

          {rec.chiffreCle && (
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight block">
                {rec.chiffreCle}
              </span>
              {rec.chiffreLabel && (
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  {rec.chiffreLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Ligne 2 : Titre de la recommandation ─────────────── */}
        <h3 
          id={`rec-title-${rec.id}`}
          className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-emerald-700 transition-colors"
        >
          {rec.titre}
        </h3>

        {/* ── Ligne 3 : Explication chiffrée personnalisée ───────── */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
          {rec.message}
        </p>

        {/* ── Ligne 4 : Boîte d'action / Conseil pratique IA ─────── */}
        {rec.conseil && (
          <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-2.5 sm:p-3 mb-3 flex items-start gap-2">
            <LuLightbulb className="text-amber-500 text-sm shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {rec.conseil}
            </p>
          </div>
        )}
      </div>

      {/* ── Ligne 5 : Lien d'action rapide vers le budget ou l'opération ──── */}
      {rec.actionHref && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
          <Link
            href={rec.actionHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline group/link"
          >
            <span>{rec.actionLabel || 'Voir les détails'}</span>
            <LuArrowUpRight className="text-xs transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" aria-hidden="true" />
          </Link>

          {rec.budgetNom && (
            <span className="text-[11px] text-slate-400 truncate max-w-[140px]" title={rec.budgetNom}>
              {rec.budgetNom}
            </span>
          )}
        </div>
      )}
    </article>
  )
}
