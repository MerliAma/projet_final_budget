"use client"
import React, { useState } from 'react'
import FenBudget from '@/composants/FenBudget'

/**
 * BudgetIntermd — Composant intermédiaire pour la gestion des budgets
 * Maintient l'état listeBudget et listeTransaction transmis en props.
 */
function BudgetIntermd() {
  const [listeBudget, setListeBudget] = useState([])
  const [listeTransaction, setListeTransaction] = useState([])

  return (
    <div className="w-full">
      <FenBudget 
        listeBudget={listeBudget} 
        setListeBudget={setListeBudget} 
        listeTransaction={listeTransaction} 
        setListeTransaction={setListeTransaction} 
      />
    </div>
  )
}

export default BudgetIntermd
