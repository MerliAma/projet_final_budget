"use client"
import FenTransaction from '@/composants/FenTransaction';
import React, { useState } from 'react'

/*export const metadata = {
  title: "Mes Transactions",
  description: "Gestion Transactions",
};*/


function page() {

  const [listeTransaction, setListeTransaction]=useState([])
  const [listeBudget, setListeBudget]=useState([]) //pour avoir la liste des budgets de l'user connecté...

  return (
    <div className="p-4">
      <h3 className="font-bold m-3" >Mes Transactions</h3>
      {/* appel du composant contenant une grille pour la fenêtre transaction */}
      <FenTransaction listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} listeBudget={listeBudget} setListeBudget={setListeBudget} />
    </div>
  )
}

export default page
