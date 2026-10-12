"use client"
import React, { useState } from 'react'
import FenTransaction from '@/composants/FenTransaction'

/**
 * TransactionIntermd — Composant intermédiaire pour la gestion des transactions
 * Conserve l'état listeTransaction et listeBudget transmis via props.
 */
function TransactionIntermd() {
  const [listeTransaction, setListeTransaction] = useState([])
  const [listeBudget, setListeBudget] = useState([])

  return (
    <div className="w-full">
      <FenTransaction
        listeTransaction={listeTransaction}
        setListeTransaction={setListeTransaction}
        listeBudget={listeBudget}
        setListeBudget={setListeBudget}
      />
    </div>
  )
}

export default TransactionIntermd
