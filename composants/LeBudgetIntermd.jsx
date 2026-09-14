"use client"
import React, { useEffect, useState } from 'react'
import LeBudget from '@/composants/LeBudget'; 
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB'
import axios from 'axios';

function LeBudgetIntermd({idBudget}) {
  
  const [listeBud, setListeBud]=useState([])
  const [listeTrans, setListeTrans]=useState([])

  //fonction à exécuter pour le remplissage des tableaux de budgets et transactions
    const GetBudgetTrans = async () => {
    try {
        //On appel notre api backend pour recuperer tous les budgets et transactions
        const req = await axios.get(`/server/budget/get-one/${idBudget}`)
        if(req?.data){
            //setListeBudget(req?.data.budgets)
            const ListeBudg=[req?.data.budget]  //req?.data.budgets.filter(leBudget => leBudget.id===idBudget) //pr get-all
            console.log(ListeBudg)
            setListeBud(ListeBudg)
        }  
        
        const req2 = await axios.get("/server/transaction/get-all")
        if(req2?.data){
            setListeTrans(req2?.data.transactions.filter(laTrans => laTrans.budgetTrans===idBudget))
        } 

    } catch (error) {
       const message = error?.message
       //console.log("Erreur: ", message) 
    }
  }

  //On recupère la liste des Transactions-Budget dans indexDb quand le composant est monté (page totalement chargé)
            useEffect(() => {
        
                if (typeof window === "undefined") return;
      
                //on filtre les budgets de l'utilisateurs index DB
                /*getAllDataTodatabase("budget", (e) => {
                   
                  setListeBud(e.filter(leBudget => leBudget.id===Number(idBudget)))//idBudget sans number
                  //console.log(e, idBudget)
                })
      //console.log(listeBud, idBudget)
                //on recherche les transactions..
                getAllDataTodatabase("transaction", (e) => {
                  
                  setListeTransaction(e.filter(laTrans => laTrans.budgetTrans===idBudget))
                  //console.log(e, "ama2")
              })*/

              //on filtre les budgets de l'utilisateurs realtime db en appelant la fonction asynchrone
              GetBudgetTrans()
        
            }, [])
  
    return (
    <div>
      <LeBudget idBudget={idBudget} listeBud={listeBud} setListeBud={setListeBud} listeTransaction={listeTrans} setListeTransaction={setListeTrans} />
    </div>
  )
}

export default LeBudgetIntermd
