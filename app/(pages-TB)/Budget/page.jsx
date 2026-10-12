import React from 'react'
import BudgetIntermd from '@/composants/BudgetIntermd'

export const metadata = {
  title: "Mes Budgets",
  description: "Gérez vos enveloppes budgétaires et maîtrisez vos dépenses",
}

function page() {
  return (
    <div className="w-full">
      <BudgetIntermd />
    </div>
  )
}

export default page
