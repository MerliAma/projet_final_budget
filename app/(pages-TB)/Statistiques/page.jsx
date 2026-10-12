import StatistiquesIntermd from '@/composants/StatistiquesIntermd'
import React from 'react'

export const metadata = {
  title: "Statistiques & Analyses | TopBudget",
  description: "Analysez vos dépenses, la répartition de votre budget et suivez vos tendances financières réelles.",
}

export default function page() {
  return (
    <div className="w-full">
      <StatistiquesIntermd />
    </div>
  )
}
