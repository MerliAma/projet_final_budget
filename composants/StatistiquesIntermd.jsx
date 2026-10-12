"use client"
import React, { useState } from 'react'
import Statistiques from './Statistiques'

/**
 * StatistiquesIntermd — Composant intermédiaire de la page Statistiques
 * Maintient le pattern d'état global { listeBudget, setListeBudget, listeTransaction, setListeTransaction }
 * cohérent avec l'ensemble de l'architecture du projet.
 */
export default function StatistiquesIntermd() {
  const [listeBudget, setListeBudget] = useState([])
  const [listeTransaction, setListeTransaction] = useState([])

  return (
    <div className="w-full">
      <Statistiques
        listeBudget={listeBudget}
        setListeBudget={setListeBudget}
        listeTransaction={listeTransaction}
        setListeTransaction={setListeTransaction}
      />
    </div>
  )
}
