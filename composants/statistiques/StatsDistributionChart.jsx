"use client"
import React, { useState } from 'react'
import { LuChartPie, LuInfo } from 'react-icons/lu'

const PALETTE = [
  { hex: '#16a34a', bgClass: 'bg-[#16a34a]' },
  { hex: '#10b981', bgClass: 'bg-emerald-500' },
  { hex: '#0d9488', bgClass: 'bg-teal-600' },
  { hex: '#0284c7', bgClass: 'bg-sky-600' },
  { hex: '#6366f1', bgClass: 'bg-indigo-500' },
  { hex: '#f59e0b', bgClass: 'bg-amber-500' },
  { hex: '#ea580c', bgClass: 'bg-orange-600' },
  { hex: '#64748b', bgClass: 'bg-slate-500' },
]

/**
 * StatsDistributionChart — Répartition des dépenses par budget / catégorie
 * Propose un Donut Chart SVG moderne et interactif complété d'une liste détaillée avec pourcentages.
 */
export default function StatsDistributionChart({
  distributionData = [], // [{ id, nom, depense, partPct }]
  totalDepenses = 0,
}) {
  const [activeItem, setActiveItem] = useState(null)

  if (!distributionData || distributionData.length === 0 || totalDepenses === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <LuChartPie className="text-emerald-600" aria-hidden="true" />
            <span>Répartition des dépenses</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Part de chaque budget dans les dépenses globales
          </p>
        </div>

        <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
          <LuInfo className="text-3xl text-slate-300 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium">Aucune dépense enregistrée sur cette période.</p>
          <p className="text-xs text-slate-400 mt-1">La répartition apparaîtra automatiquement dès vos premiers achats.</p>
        </div>
      </div>
    )
  }

  // Calcul des segments Donut SVG
  // Rayon et circonférence du cercle
  const radius = 65
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius // ≈ 408.4

  let cumulativeAngle = 0
  const segments = distributionData.map((item, idx) => {
    const fraction = totalDepenses > 0 ? item.depense / totalDepenses : 0
    const strokeDasharray = `${fraction * circumference} ${circumference}`
    const strokeDashoffset = -cumulativeAngle * circumference
    cumulativeAngle += fraction

    const color = PALETTE[idx % PALETTE.length]
    return {
      ...item,
      color,
      strokeDasharray,
      strokeDashoffset,
      fraction,
    }
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      
      {/* ── En-tête ───────────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <LuChartPie className="text-emerald-600" aria-hidden="true" />
          <span>Répartition des dépenses</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Part de chaque budget dans les dépenses réelles totales
        </p>
      </div>

      {/* ── Donut SVG + Liste détaillée ───────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Donut SVG interactif */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full -rotate-90 select-none"
              role="img"
              aria-label="Graphique circulaire de répartition des dépenses par catégorie"
            >
              {/* Fond de piste */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />

              {/* Tranches circulaires */}
              {segments.map((seg, idx) => {
                const isHovered = activeItem?.id === seg.id
                return (
                  <circle
                    key={seg.id || `donut-slice-${idx}`}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color.hex}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActiveItem(seg)}
                    onMouseLeave={() => setActiveItem(null)}
                  />
                )
              })}
            </svg>

            {/* Centre du Donut avec informations dynamiques */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-400">
                {activeItem ? activeItem.nom : 'Total dépensé'}
              </span>
              <span className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {activeItem 
                  ? `${activeItem.depense.toLocaleString('fr-FR')} F`
                  : `${totalDepenses.toLocaleString('fr-FR')} F`}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {activeItem ? `${activeItem.partPct} %` : `${distributionData.length} budget(s)`}
              </span>
            </div>
          </div>
        </div>

        {/* Liste détaillée des catégories avec pourcentages */}
        <div className="md:col-span-7 space-y-3">
          {segments.map((item) => {
            const isHovered = activeItem?.id === item.id
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveItem(item)}
                onMouseLeave={() => setActiveItem(null)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered 
                    ? 'bg-slate-50 border-slate-300 shadow-xs scale-[1.01]' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className={`w-3 h-3 rounded-full shrink-0 ${item.color.bgClass}`} 
                      aria-hidden="true" 
                    />
                    <span className="font-bold text-slate-800 capitalize truncate">
                      {item.nom}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-slate-900">
                      {item.depense.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                      {item.partPct} %
                    </span>
                  </div>
                </div>

                {/* Barre de proportion */}
                <div 
                  className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={item.partPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.nom}: ${item.partPct}% du total`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color.bgClass}`}
                    style={{ width: `${Math.min(100, Math.max(0, item.partPct))}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* ── Pied de carte récapitulatif ───────────────────── */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Montant total analysé :</span>
        <strong className="text-slate-900 font-bold">
          {totalDepenses.toLocaleString('fr-FR')} FCFA
        </strong>
      </div>

    </div>
  )
}
