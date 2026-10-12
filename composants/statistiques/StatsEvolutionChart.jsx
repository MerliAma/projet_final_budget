"use client"
import React, { useState } from 'react'
import { LuTrendingUp, LuInfo } from 'react-icons/lu'

/**
 * StatsEvolutionChart — Graphique d'évolution chronologique des dépenses
 * Compare le budget alloué et les dépenses réelles par mois/période.
 * Développé en pur SVG responsive et Tailwind CSS, accessible et sans dépendance lourde.
 */
export default function StatsEvolutionChart({
  monthlyData = [], // [{ moisKey, labelMois, alloue, depense, solde }]
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <LuTrendingUp className="text-emerald-600 text-lg" aria-hidden="true" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Évolution chronologique des dépenses
          </h2>
        </div>
        <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
          <LuInfo className="text-3xl text-slate-300 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium">Pas assez de données pour afficher l'évolution.</p>
          <p className="text-xs text-slate-400 mt-1">L'historique se construira au fil de vos budgets et dépenses.</p>
        </div>
      </div>
    )
  }

  // Calcul du max pour l'échelle verticale
  const maxValeur = Math.max(
    ...monthlyData.map((d) => Math.max(d.alloue || 0, d.depense || 0)),
    10000 // Valeur plancher pour éviter division par zéro
  )

  // Dimensions SVG
  const svgWidth = 700
  const svgHeight = 280
  const paddingX = 50
  const paddingTop = 25
  const paddingBottom = 45
  const chartWidth = svgWidth - paddingX * 2
  const chartHeight = svgHeight - paddingTop - paddingBottom

  const stepX = chartWidth / monthlyData.length
  const barWidth = Math.min(28, Math.max(12, (stepX - 16) / 2))

  // 4 paliers d'axe Y
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => Math.round(maxValeur * ratio))

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      
      {/* ── En-tête du graphique ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <LuTrendingUp className="text-emerald-600" aria-hidden="true" />
            <span>Évolution des dépenses dans le temps</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Comparaison entre enveloppe allouée et dépenses réelles par période
          </p>
        </div>

        {/* Légende du graphique */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#16a34a]" aria-hidden="true" />
            <span className="font-medium text-slate-600">Budget alloué</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-red-500" aria-hidden="true" />
            <span className="font-medium text-slate-600">Dépenses réelles</span>
          </div>
        </div>
      </div>

      {/* ── Graphique SVG responsive ──────────────────────── */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[500px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
            role="img"
            aria-label="Graphique d'évolution chronologique comparant budget alloué et dépenses par mois"
          >
            {/* Lignes de repère horizontales */}
            {yTicks.map((val, idx) => {
              const y = paddingTop + chartHeight - (val / maxValeur) * chartHeight
              return (
                <g key={`ytick-${val}-${idx}`}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={idx === 0 ? '0' : '4 4'}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-sans"
                  >
                    {val >= 1000000 
                      ? `${(val / 1000000).toFixed(1)}M` 
                      : val >= 1000 
                      ? `${Math.round(val / 1000)}k` 
                      : val}
                  </text>
                </g>
              )
            })}

            {/* Barres comparatives par mois */}
            {monthlyData.map((d, index) => {
              const groupCenterX = paddingX + index * stepX + stepX / 2
              const xAlloue = groupCenterX - barWidth - 2
              const xDepense = groupCenterX + 2

              const heightAlloue = Math.max(2, (d.alloue / maxValeur) * chartHeight)
              const yAlloue = paddingTop + chartHeight - heightAlloue

              const heightDepense = Math.max(2, (d.depense / maxValeur) * chartHeight)
              const yDepense = paddingTop + chartHeight - heightDepense

              const isHovered = hoveredIndex === index

              return (
                <g 
                  key={d.moisKey || `month-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer transition-opacity"
                  opacity={hoveredIndex !== null && !isHovered ? 0.45 : 1}
                >
                  {/* Zone de fond active au survol */}
                  {isHovered && (
                    <rect
                      x={groupCenterX - stepX / 2 + 4}
                      y={paddingTop}
                      width={stepX - 8}
                      height={chartHeight}
                      fill="#f1f5f9"
                      rx="8"
                      opacity="0.6"
                    />
                  )}

                  {/* Barre Budget Alloué */}
                  <rect
                    x={xAlloue}
                    y={yAlloue}
                    width={barWidth}
                    height={heightAlloue}
                    rx="4"
                    fill="#16a34a"
                    className="transition-all duration-300"
                  />

                  {/* Barre Dépenses Réelles */}
                  <rect
                    x={xDepense}
                    y={yDepense}
                    width={barWidth}
                    height={heightDepense}
                    rx="4"
                    fill={d.depense > d.alloue ? '#dc2626' : '#ef4444'}
                    className="transition-all duration-300"
                  />

                  {/* Libellé du mois en bas */}
                  <text
                    x={groupCenterX}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    className={`text-[11px] font-sans ${isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-500'}`}
                  >
                    {d.labelMois}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* ── Tooltip / Détail contextuel de la période survolée ou active ──────── */}
      <div className="mt-4 pt-4 border-t border-slate-100 min-h-[60px] flex items-center justify-between text-xs sm:text-sm">
        {hoveredIndex !== null && monthlyData[hoveredIndex] ? (
          (() => {
            const current = monthlyData[hoveredIndex]
            const pct = current.alloue > 0 ? Math.round((current.depense / current.alloue) * 100) : 0
            const solde = current.alloue - current.depense

            return (
              <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 capitalize text-sm">
                    {current.labelMois} :
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${solde >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {solde >= 0 ? `+${solde.toLocaleString('fr-FR')} FCFA restants` : `Dépassement de ${Math.abs(solde).toLocaleString('fr-FR')} FCFA`}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Alloué : </span>
                    <strong className="text-emerald-700">{current.alloue.toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Dépensé : </span>
                    <strong className="text-red-600">{current.depense.toLocaleString('fr-FR')} FCFA ({pct}%)</strong>
                  </div>
                </div>
              </div>
            )
          })()
        ) : (
          <div className="w-full text-center text-xs text-slate-400 py-1">
            Survolez une période pour afficher le détail comparatif chiffré.
          </div>
        )}
      </div>

    </div>
  )
}
