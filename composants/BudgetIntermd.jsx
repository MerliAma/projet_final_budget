"use client"
import FenBudget from '@/composants/FenBudget';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
//import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function BudgetIntermd() {
  const [listeBudget, setListeBudget]=useState([])
  /*if(!RecupInfosUserConnecte()) {
    useRouter().push("/")
  }*/

  return (
    <div className="p-4">
      <h3 className="font-bold m-3" >Mes Budgets</h3>
      {/* appel du composant contenant une grille pour la fenêtre Budget */}
      <FenBudget listeBudget={listeBudget} setListeBudget={setListeBudget}/>
    </div>
  )
}

export default BudgetIntermd
