"use client"
import React, { useEffect, useState } from 'react'
import LeBudget from '@/composants/LeBudget'; 
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'

function LeBudgetIntermd({idBudget}) {
  
  const [listeBud, setListeBud]=useState([])
  const [listeTransaction, setListeTransaction]=useState([])

  //On recupère la liste des Transactions-Budget dans indexDb quand le composant est monté (page totalement chargé)
            useEffect(() => {
        
                if (typeof window === "undefined") return;
      
                //on filtre les budgets de l'utilisateurs
                getAllDataTodatabase("budget", (e) => {
                   
                  setListeBud(e.filter(leBudget => leBudget.id===Number(idBudget)))//idBudget sans number
                  //console.log(e, idBudget)
                })
      //console.log(listeBud, idBudget)
                //on recherche les transactions..
                getAllDataTodatabase("transaction", (e) => {
                  
                  setListeTransaction(e.filter(laTrans => laTrans.budgetTrans===idBudget))
                  //console.log(e, "ama2")
              })
        
            }, [])
  
    return (
    <div>
      <LeBudget idBudget={idBudget} listeBud={listeBud} setListeBud={setListeBud} listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} />
    </div>
  )
}

export default LeBudgetIntermd
