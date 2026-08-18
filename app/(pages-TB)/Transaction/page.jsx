import TransactionIntermd from '@/composants/TransactionIntermd';
import React from 'react'

export const metadata = {
  title: "Mes Transactions",
  description: "Gestion Transactions",
};


function page() {

  return (
    <div className="p-4">
      <TransactionIntermd />
    </div>
  )
}

export default page
