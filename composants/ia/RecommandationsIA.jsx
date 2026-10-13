"use client"
import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  LuSparkles, 
  LuBrainCircuit, 
  LuChevronDown, 
  LuChevronUp, 
  LuRefreshCw, 
  LuCircleCheck, 
  LuTriangleAlert, 
  LuInfo,
  LuPlus
} from 'react-icons/lu'
import { analyserMouvementsBudget } from '@/mesFonctions/analyserMouvementsBudget'
import RecommandationCard from './RecommandationCard'

/**
 * RecommandationsIA — Composant principal des recommandations intelligentes TopBudget.
 * 
 * Analyse les mouvements réels des budgets et transactions pour proposer des
 * conseils personnalisés, sans surcharger l'interface utilisateur.
 */
export default function RecommandationsIA({ 
  listeBudget = [], 
  listeTransaction = [], 
  className = "" 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [showAllRecs, setShowAllRecs] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Exécution du moteur d'analyse financière
  const analyse = useMemo(() => {
    return analyserMouvementsBudget(listeBudget, listeTransaction)
  }, [listeBudget, listeTransaction])

  const { scoreIA, diagnostic, diagnosticColor, synthese, recommandations = [] } = analyse

  // Simulation d'une ré-analyse interactive avec feedback visuel
  const handleReanalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 450)
  }

  // Filtrage des recommandations selon l'onglet sélectionné
  const filteredRecs = useMemo(() => {
    if (activeFilter === 'ALL') return recommandations
    if (activeFilter === 'ALERTE') return recommandations.filter(r => r.type === 'alerte')
    if (activeFilter === 'VIGILANCE') return recommandations.filter(r => r.type === 'vigilance')
    if (activeFilter === 'OPTIMISATION') return recommandations.filter(r => r.type === 'optimisation')
    if (activeFilter === 'HABITUDE') return recommandations.filter(r => r.type === 'habitude' || r.type === 'succes')
    return recommandations
  }, [recommandations, activeFilter])

  // Décompte par catégorie
  const countAlertes = useMemo(() => recommandations.filter(r => r.type === 'alerte').length, [recommandations])
  const countVigilance = useMemo(() => recommandations.filter(r => r.type === 'vigilance').length, [recommandations])
  const countOptimisation = useMemo(() => recommandations.filter(r => r.type === 'optimisation').length, [recommandations])
  const countHabitudes = useMemo(() => recommandations.filter(r => r.type === 'habitude' || r.type === 'succes').length, [recommandations])

  // Limitation à 3 recommandations visibles par défaut pour éviter la surcharge
  const recsToDisplay = showAllRecs ? filteredRecs : filteredRecs.slice(0, 3)
  const hasMore = filteredRecs.length > 3 && !showAllRecs

  // Configuration visuelle du score
  let scoreBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200'
  let scoreBarColor = 'bg-[#16a34a]'
  let ScoreIcon = LuCircleCheck

  if (scoreIA < 50) {
    scoreBadgeClass = 'bg-rose-50 text-rose-800 border-rose-200'
    scoreBarColor = 'bg-rose-600'
    ScoreIcon = LuTriangleAlert
  } else if (scoreIA < 70) {
    scoreBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200'
    scoreBarColor = 'bg-amber-500'
    ScoreIcon = LuInfo
  } else if (scoreIA < 85) {
    scoreBadgeClass = 'bg-teal-50 text-teal-800 border-teal-200'
    scoreBarColor = 'bg-teal-600'
    ScoreIcon = LuCircleCheck
  }

  // Si l'utilisateur n'a aucun budget
  if (!listeBudget || listeBudget.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-emerald-50/50 via-white to-slate-50 rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
              <LuBrainCircuit className="text-xl" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Conseiller Financier IA</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Actif
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Créez vos premiers budgets pour obtenir des analyses prédictives et recommandations personnalisées.
              </p>
            </div>
          </div>

          <Link
            href="/Budget"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white shadow-xs transition-colors self-start sm:self-auto"
          >
            <LuPlus className="text-sm" aria-hidden="true" />
            <span>Créer un budget</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section 
      aria-label="Recommandations et analyse budgétaire IA"
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all ${className}`}
    >
      {/* ── En-tête : Titre, Score IA & Contrôles (Plier / Rafraîchir) ── */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Titre & Synthèse */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
              <LuSparkles className="text-xl animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Recommandations & Analyses IA</span>
                </h2>

                {/* Score de santé financière IA */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${scoreBadgeClass}`}>
                  <ScoreIcon className="text-xs shrink-0" aria-hidden="true" />
                  <span>Score IA : {scoreIA}/100</span>
                  <span className="hidden md:inline font-normal opacity-80">• {diagnostic}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1 sm:line-clamp-none">
                {synthese}
              </p>
            </div>
          </div>

          {/* Boutons d'action : Réanalyser & Plier/Déplier */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {/* Bouton Réanalyser */}
            <button
              onClick={handleReanalyze}
              disabled={isAnalyzing}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              title="Relancer l'analyse intelligente des mouvements"
              aria-label="Relancer l'analyse intelligente des mouvements"
            >
              <LuRefreshCw className={`text-xs ${isAnalyzing ? 'animate-spin text-emerald-600' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Actualiser l'analyse</span>
            </button>

            {/* Bouton Masquer / Déplier */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? "Déplier les recommandations IA" : "Masquer les recommandations IA"}
            >
              <span>{isCollapsed ? "Afficher" : "Réduire"}</span>
              {isCollapsed ? <LuChevronDown className="text-sm" /> : <LuChevronUp className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Jauge fine du Score IA si non masqué */}
        {!isCollapsed && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium shrink-0">
              Résilience budgétaire :
            </span>
            <div 
              className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden" 
              role="progressbar" 
              aria-valuenow={scoreIA} 
              aria-valuemin={0} 
              aria-valuemax={100}
              aria-label="Indice de résilience budgétaire calculé par l'IA"
            >
              <div 
                className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
                style={{ width: `${scoreIA}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 shrink-0">
              {scoreIA} %
            </span>
          </div>
        )}
      </div>

      {/* ── Contenu dépliable des Recommandations ───────────────── */}
      {!isCollapsed && (
        <div className="px-5 sm:px-6 pb-6 pt-1">
          
          {/* Onglets de filtrage discrets pour éviter la surcharge */}
          {recommandations.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-slate-100">
              <button
                onClick={() => setActiveFilter('ALL')}
                type="button"
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Toutes ({recommandations.length})
              </button>

              {countAlertes > 0 && (
                <button
                  onClick={() => setActiveFilter('ALERTE')}
                  type="button"
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeFilter === 'ALERTE'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Alertes ({countAlertes})
                </button>
              )}

              {countVigilance > 0 && (
                <button
                  onClick={() => setActiveFilter('VIGILANCE')}
                  type="button"
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeFilter === 'VIGILANCE'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Vigilance ({countVigilance})
                </button>
              )}

              {countOptimisation > 0 && (
                <button
                  onClick={() => setActiveFilter('OPTIMISATION')}
                  type="button"
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeFilter === 'OPTIMISATION'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Opportunités ({countOptimisation})
                </button>
              )}

              {countHabitudes > 0 && (
                <button
                  onClick={() => setActiveFilter('HABITUDE')}
                  type="button"
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 cursor-pointer ${
                    activeFilter === 'HABITUDE'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Comportement ({countHabitudes})
                </button>
              )}
            </div>
          )}

          {/* Grille des cartes de recommandations (1 col mobile, 2 col md, 3 col lg) */}
          {recsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recsToDisplay.map((rec) => (
                <RecommandationCard key={rec.id} rec={rec} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs sm:text-sm">
              Aucune recommandation dans cette catégorie pour le moment.
            </div>
          )}

          {/* Bouton sobre pour afficher les recommandations supplémentaires */}
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllRecs(true)}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer shadow-xs"
              >
                <span>Afficher les {filteredRecs.length - 3} autres recommandations</span>
                <LuChevronDown className="text-xs" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Bouton pour replier si tout est affiché */}
          {showAllRecs && filteredRecs.length > 3 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllRecs(false)}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <span>Réduire à l'essentiel</span>
                <LuChevronUp className="text-xs" aria-hidden="true" />
              </button>
            </div>
          )}

        </div>
      )}
    </section>
  )
}
