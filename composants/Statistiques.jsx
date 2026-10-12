"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'
import { SommeMontantBud, SommeTransactions } from '@/mesFonctions/SommeMontant'

// Composants modulaires du Lot 7
import StatsHeader from './statistiques/StatsHeader'
import StatsKPIs from './statistiques/StatsKPIs'
import StatsEvolutionChart from './statistiques/StatsEvolutionChart'
import StatsDistributionChart from './statistiques/StatsDistributionChart'
import StatsBudgetPerformance from './statistiques/StatsBudgetPerformance'
import StatsSkeleton from './statistiques/StatsSkeleton'
import StatsEmptyState from './statistiques/StatsEmptyState'
import StatsErrorState from './statistiques/StatsErrorState'

/**
 * Statistiques — Orchestrateur principal des statistiques et analyses (Lot 7)
 * Préserve intégralement les calculs financiers réels, les props et les routes API backend.
 */
export default function Statistiques({
  listeBudget = [],
  setListeBudget,
  listeTransaction = [],
  setListeTransaction,
}) {
  const [idUserConnecte, setIdUserConnecte] = useState(() => {
    if (typeof window !== 'undefined') {
      return RecupInfosUserConnecte()?.idUser || ''
    }
    return ''
  })

  // États de chargement et d'erreur
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Filtre de période
  const [selectedPeriod, setSelectedPeriod] = useState('ALL')

  // Initialisation ID utilisateur
  useEffect(() => {
    if (typeof window === 'undefined') return
    const infos = RecupInfosUserConnecte()
    if (infos?.idUser) {
      setIdUserConnecte(String(infos.idUser))
    }
  }, [])

  // Récupération des données depuis l'API backend
  const GetBudgetTrans = useCallback(async (isManualRefresh = false) => {
    const currentId = idUserConnecte || (typeof window !== 'undefined' ? RecupInfosUserConnecte()?.idUser : '')
    if (!currentId) return

    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setHasError(false)
    setErrorMessage('')

    try {
      const [reqBudgets, reqTransactions] = await Promise.all([
        axios.get('/server/budget/get-all'),
        axios.get('/server/transaction/get-all'),
      ])

      if (reqBudgets?.data?.budgets) {
        const tousLesBudgets = reqBudgets.data.budgets
        const budgetsUtilisateur = tousLesBudgets.filter(
          (b) => String(b?.idUser || '').trim() === String(currentId).trim()
        )
        setListeBudget(budgetsUtilisateur)
      } else if (reqBudgets?.data?.error || reqBudgets?.data?.message) {
        setHasError(true)
        setErrorMessage(reqBudgets?.data?.message || 'Erreur lors du chargement des budgets.')
      }

      if (reqTransactions?.data?.transactions) {
        setListeTransaction(reqTransactions.data.transactions)
      }
    } catch (error) {
      const errDetail = error?.response?.data?.message || error?.response?.data?.error || error?.message
      setHasError(true)
      setErrorMessage(
        typeof errDetail === 'string'
          ? errDetail
          : 'Impossible de récupérer vos données financières. Veuillez réessayer.'
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [idUserConnecte, setListeBudget, setListeTransaction])

  // Chargement automatique au montage
  useEffect(() => {
    if (idUserConnecte) {
      GetBudgetTrans(false)
    }
  }, [idUserConnecte, GetBudgetTrans])

  const handleRefresh = () => {
    GetBudgetTrans(true)
  }

  // Filtrage des transactions de l'utilisateur connecté via ses budgets
  const userBudgets = useMemo(() => {
    return (listeBudget || []).filter(
      (b) => String(b?.idUser || '').trim() === String(idUserConnecte).trim()
    )
  }, [listeBudget, idUserConnecte])

  const userBudgetIdSet = useMemo(() => {
    return new Set(userBudgets.map((b) => String(b.id)))
  }, [userBudgets])

  const userTransactions = useMemo(() => {
    return (listeTransaction || []).filter((t) => userBudgetIdSet.has(String(t?.budgetTrans)))
  }, [listeTransaction, userBudgetIdSet])

  // Fonction utilitaire pour extraire la clé de mois (YYYY-MM)
  const getBudgetMonthKey = useCallback((b) => {
    if (b?.moisBud && /^\d{4}-\d{2}/.test(b.moisBud)) return b.moisBud.slice(0, 7)
    if (b?.dateEnrg && /^\d{4}-\d{2}/.test(b.dateEnrg)) return b.dateEnrg.slice(0, 7)
    return ''
  }, [])

  // Extraction dynamique des périodes disponibles (YYYY-MM)
  const availablePeriods = useMemo(() => {
    const periodSet = new Set()

    userBudgets.forEach((b) => {
      const key = getBudgetMonthKey(b)
      if (key) periodSet.add(key)
    })

    userTransactions.forEach((t) => {
      if (t.dateEnrg && /^\d{4}-\d{2}/.test(t.dateEnrg)) {
        periodSet.add(t.dateEnrg.slice(0, 7))
      }
    })

    const sorted = Array.from(periodSet).sort((a, b) => b.localeCompare(a))

    return sorted.map((key) => {
      const date = new Date(`${key}-01T00:00:00`)
      const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      return {
        value: key,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      }
    })
  }, [userBudgets, userTransactions, getBudgetMonthKey])

  // Application du filtre de période
  const { filteredBudgets, filteredTransactions } = useMemo(() => {
    if (selectedPeriod === 'ALL') {
      return {
        filteredBudgets: userBudgets,
        filteredTransactions: userTransactions,
      }
    }

    const budgetsForPeriod = userBudgets.filter((b) => {
      const key = getBudgetMonthKey(b)
      if (!key) return true // Budget général
      return key === selectedPeriod
    })

    const transactionsForPeriod = userTransactions.filter((t) => {
      if (!t.dateEnrg) return false
      return t.dateEnrg.startsWith(selectedPeriod)
    })

    return {
      filteredBudgets: budgetsForPeriod,
      filteredTransactions: transactionsForPeriod,
    }
  }, [userBudgets, userTransactions, selectedPeriod, getBudgetMonthKey])

  // Calculs financiers réels
  const totalAlloue = useMemo(() => {
    return SommeMontantBud(filteredBudgets)
  }, [filteredBudgets])

  const totalDepense = useMemo(() => {
    return SommeTransactions('', filteredTransactions, filteredBudgets, 0)
  }, [filteredTransactions, filteredBudgets])

  const nombreBudgets = filteredBudgets.length
  const nombreTransactions = filteredTransactions.length
  const depenseMoyenne = nombreTransactions > 0 ? totalDepense / nombreTransactions : 0

  // Statistiques détaillées par budget
  const budgetStats = useMemo(() => {
    return filteredBudgets.map((b) => {
      const calcul = SommeTransactions(b.id, filteredTransactions, filteredBudgets, b.montantBud)
      const depense = calcul?.Somme || 0
      const alloue = Number(b.montantBud || 0)
      const reste = alloue - depense
      const partPct = totalDepense > 0 ? Math.round((depense / totalDepense) * 100) : 0

      return {
        id: b.id,
        nom: b.descriptionBud,
        mois: b.moisBud,
        alloue,
        depense,
        reste,
        partPct,
        transactionsCount: calcul?.Nbr || 0,
      }
    })
  }, [filteredBudgets, filteredTransactions, totalDepense])

  // Données de répartition pour le Donut
  const distributionData = useMemo(() => {
    return budgetStats
      .filter((b) => b.depense > 0)
      .sort((a, b) => b.depense - a.depense)
  }, [budgetStats])

  // Budget le plus consommateur
  const budgetLePlusDepense = distributionData.length > 0 ? distributionData[0] : null

  // Données d'évolution chronologique dans le temps (Groupement par mois)
  const monthlyData = useMemo(() => {
    const monthsMap = new Map()

    // Mois présents dans les budgets de l'utilisateur
    userBudgets.forEach((b) => {
      const key = getBudgetMonthKey(b) || new Date().toISOString().slice(0, 7)
      if (!monthsMap.has(key)) {
        monthsMap.set(key, { alloue: 0, depense: 0 })
      }
      monthsMap.get(key).alloue += Number(b.montantBud || 0)
    })

    // Mois présents dans les transactions
    userTransactions.forEach((t) => {
      const key = t.dateEnrg ? t.dateEnrg.slice(0, 7) : new Date().toISOString().slice(0, 7)
      if (!monthsMap.has(key)) {
        monthsMap.set(key, { alloue: 0, depense: 0 })
      }
      monthsMap.get(key).depense += Number(t.montantTrans || 0)
    })

    // Tri chronologique ascendant (du passé vers le présent)
    const sortedKeys = Array.from(monthsMap.keys()).sort((a, b) => a.localeCompare(b))

    return sortedKeys.map((key) => {
      const data = monthsMap.get(key)
      const date = new Date(`${key}-01T00:00:00`)
      const labelMois = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
      return {
        moisKey: key,
        labelMois: labelMois.charAt(0).toUpperCase() + labelMois.slice(1),
        alloue: data.alloue,
        depense: data.depense,
        solde: data.alloue - data.depense,
      }
    })
  }, [userBudgets, userTransactions])

  // ── État de chargement (Skeleton) ──────────────────────────
  if (isLoading) {
    return <StatsSkeleton />
  }

  // ── État d'erreur ──────────────────────────────────────────
  if (hasError && userBudgets.length === 0) {
    return (
      <StatsErrorState
        onRetry={handleRefresh}
        isRetrying={isLoading}
        message={errorMessage}
      />
    )
  }

  // ── État vide : Aucun budget configuré ────────────────────
  if (userBudgets.length === 0) {
    return (
      <div className="space-y-6">
        <StatsHeader
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          availablePeriods={availablePeriods}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <StatsEmptyState hasBudgets={false} />
      </div>
    )
  }

  // ── Affichage principal ────────────────────────────────────
  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      
      {/* 1. En-tête avec titre et sélecteur de période */}
      <StatsHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        availablePeriods={availablePeriods}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Cartes de synthèse financière (KPIs) */}
      <StatsKPIs
        totalAlloue={totalAlloue}
        totalDepense={totalDepense}
        nombreBudgets={nombreBudgets}
        nombreTransactions={nombreTransactions}
        depenseMoyenne={depenseMoyenne}
        budgetLePlusDepense={budgetLePlusDepense}
      />

      {/* 3. Graphiques en grille : Évolution chronologique (7 col) & Répartition (5 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <StatsEvolutionChart monthlyData={monthlyData} />
        </div>
        <div className="lg:col-span-5">
          <StatsDistributionChart
            distributionData={distributionData}
            totalDepenses={totalDepense}
          />
        </div>
      </div>

      {/* 4. Analyse comparative et performance de chaque budget */}
      <StatsBudgetPerformance budgetStats={budgetStats} />

    </div>
  )
}
