"use client"
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'
import { SommeMontantBud, SommeTransactions } from '@/mesFonctions/SommeMontant'
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB' // Préservé pour conformité historique

// Composants modulaires du Dashboard
import DashboardHeader from './dashboard/DashboardHeader'
import DashboardStats from './dashboard/DashboardStats'
import BudgetOverview from './dashboard/BudgetOverview'
import DashboardChart from './dashboard/DashboardChart'
import RecentTransactions from './dashboard/RecentTransactions'
import DashboardSkeleton from './dashboard/DashboardSkeleton'
import DashboardEmpty from './dashboard/DashboardEmpty'
import DashboardError from './dashboard/DashboardError'

/**
 * TableauBord — Refonte UI/UX du tableau de bord principal (Lots 3 & 4)
 * Préserve intégralement les props et la logique métier existante.
 */
function TableauBord({ listeBudget = [], setListeBudget, listeTransaction = [], setListeTransaction }) {
  const [idUserConnecte, setIdUserConnecte] = useState(() => {
    if (typeof window !== "undefined") {
      return RecupInfosUserConnecte()?.idUser || ""
    }
    return ""
  })
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return RecupInfosUserConnecte()?.nomUser || ""
    }
    return ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Récupération des informations de l'utilisateur connecté au montage
  useEffect(() => {
    if (typeof window === "undefined") return

    const infos = RecupInfosUserConnecte()
    if (infos?.idUser) {
      setIdUserConnecte(String(infos.idUser))
      setUserName(infos.nomUser || "")
    }

    // IndexDB — ancien code conservé pour conformité avec les règles du projet
    /*
    getAllDataTodatabase("budget", (e) => {
        const ListeBud = e.filter(leBudget => leBudget.idUser === IdUserConnecte)
        setListeBudget(ListeBud)
    })
    getAllDataTodatabase("transaction", (e) => {
        setListeTransaction(e)
    })
    */
  }, [])

  // Récupération des budgets et transactions depuis l'API backend
  const GetBudgetTrans = useCallback(async (isManualRefresh = false) => {
    const currentId = idUserConnecte || (typeof window !== "undefined" ? RecupInfosUserConnecte()?.idUser : "")
    if (!currentId) return

    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setHasError(false)
    setErrorMessage("")

    try {
      const [reqBudgets, reqTransactions] = await Promise.all([
        axios.get("/server/budget/get-all"),
        axios.get("/server/transaction/get-all")
      ])

      if (reqBudgets?.data?.budgets) {
        const tousLesBudgets = reqBudgets.data.budgets
        const ListeBud = tousLesBudgets.filter(
          leBudget => String(leBudget?.idUser || "").trim() === String(currentId).trim()
        )
        if (tousLesBudgets.length > 0 && ListeBud.length === 0) {
          console.warn(`[TableauBord] ${tousLesBudgets.length} budget(s) trouvés dans la base, mais aucun ne correspond à l'idUser de l'utilisateur connecté ("${currentId}"). IDs en base :`, tousLesBudgets.map(b => b.idUser))
        }
        setListeBudget(ListeBud)
      } else if (reqBudgets?.data?.error || reqBudgets?.data?.message) {
        setHasError(true)
        setErrorMessage(reqBudgets?.data?.message || reqBudgets?.data?.error?.error || "Erreur de base de données")
      }

      if (reqTransactions?.data?.transactions) {
        setListeTransaction(reqTransactions.data.transactions)
      }
    } catch (error) {
      const errDetail = error?.response?.data?.message || error?.response?.data?.error?.error || error?.response?.data?.error || error?.message
      //console.error("Erreur lors de la récupération des données :", errDetail)
      setHasError(true)
      setErrorMessage(typeof errDetail === "string" ? errDetail : "Erreur de connexion à la base de données")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [idUserConnecte, setListeBudget, setListeTransaction])

  // Déclenchement automatique dès que l'ID utilisateur est disponible
  useEffect(() => {
    if (idUserConnecte) {
      GetBudgetTrans(false)
    }
  }, [idUserConnecte, GetBudgetTrans])

  // Rafraîchissement manuel
  const handleRefresh = () => {
    GetBudgetTrans(true)
  }

  // Calculs financiers globaux avec les fonctions métier existantes
  const totalAlloue = SommeMontantBud(listeBudget)
  const totalDepense = SommeTransactions("", listeTransaction, listeBudget, 0)

  // ── Affichage de l'état de chargement (Skeleton) ──────────
  if (isLoading) {
    return (
      <div className="w-full">
        {/* Bouton masqué préservé pour compatibilité éventuelle */}
        <button className="hidden" onClick={() => GetBudgetTrans(false)} id="RemplirBudTrans" />
        <DashboardSkeleton />
      </div>
    )
  }

  // ── Affichage de l'état d'erreur ──────────────────────────
  if (hasError && (!listeBudget || listeBudget.length === 0)) {
    return (
      <div className="w-full">
        <button className="hidden" onClick={() => GetBudgetTrans(false)} id="RemplirBudTrans" />
        <DashboardError onRetry={() => GetBudgetTrans(false)} isRetrying={isLoading} message={errorMessage} />
      </div>
    )
  }

  // ── Affichage de l'état vide (Nouveau compte sans budget) ──
  if (!listeBudget || listeBudget.length === 0) {
    return (
      <div className="w-full">
        <button className="hidden" onClick={() => GetBudgetTrans(false)} id="RemplirBudTrans" />
        <DashboardEmpty userName={userName} />
      </div>
    )
  }

  // ── Affichage principal du Tableau de bord ────────────────
  return (
    <div className="w-full space-y-8 animate-fade-in">
      
      {/* Bouton d'exécution des routes API conservé pour rétro-compatibilité */}
      <button className="hidden" onClick={() => GetBudgetTrans(false)} id="RemplirBudTrans" />

      {/* 1. En-tête du Dashboard (Salutation, actualisation, actions rapides) */}
      <DashboardHeader 
        userName={userName} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
      />

      {/* 2. Cartes statistiques principales (Hiérarchie stricte 1 à 4) */}
      <DashboardStats 
        totalAlloue={totalAlloue} 
        totalDepense={totalDepense} 
        nombreBudgets={listeBudget.length} 
      />

      {/* 3. Grille 2 colonnes : Vue synthétique des budgets + Graphique de répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Budgets (2 colonnes sur grand écran) */}
        <div className="lg:col-span-2">
          <BudgetOverview 
            listeBudget={listeBudget} 
            listeTransaction={listeTransaction} 
          />
        </div>

        {/* Graphique de répartition des dépenses (1 colonne sur grand écran) */}
        <div className="lg:col-span-1">
          <DashboardChart 
            listeBudget={listeBudget} 
            listeTransaction={listeTransaction} 
          />
        </div>
      </div>

      {/* 4. Tableau des 10 dernières transactions (Tri global + Double rendu responsive) */}
      <RecentTransactions 
        listeBudget={listeBudget} 
        listeTransaction={listeTransaction} 
      />

    </div>
  )
}

export default TableauBord
