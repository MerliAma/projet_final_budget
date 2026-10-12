import React from 'react'
import TransactionIntermd from '@/composants/TransactionIntermd'

export const metadata = {
  title: "Mes Transactions",
  description: "Historique et gestion des dépenses personnelles",
}

function page() {
  return (
    <div className="w-full">
      <TransactionIntermd />
    </div>
  )
}

export default page
