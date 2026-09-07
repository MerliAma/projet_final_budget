"use client"
import React, { useEffect, useState } from 'react'
import FormulaireTrans from '@/composants/FormulaireTrans';
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB';
import Link from 'next/link';
import TableTrans from './TableTrans';
import { SommeTransactions } from '@/mesFonctions/SommeMontant';

function FenTransaction({listeTransaction, setListeTransaction, listeBudget, setListeBudget}) {
  
  //const [IdUserConnecte, setIdUserConnecte] = useState("")
  const [listeBudFiltre, setListeBudFiltre] = useState([]) // pour faire le filtre, ce tableau est filtré et parcouru

  //compteur pour N° d'ordre du tableau
  //let compter=1

    //On recupère la liste des Transactions-Budget dans indexDb quand le composant est monté (page totalement chargé)
      useEffect(() => {
  
          if (typeof window === "undefined") return;
  
          //on profite pour récupérer l'ID de l'utilisateur connecter avec la fonction importée RecupInfosUserConnecte()
          //setIdUserConnecte(RecupInfosUserConnecte()?.idUser)
          const IdUserConnecte=RecupInfosUserConnecte()?.idUser

          //on filtre les budgets de l'utilisateurs
          getAllDataTodatabase("budget", (e) => {
            const BudUser=e.filter(leBudget => leBudget.idUser===IdUserConnecte)
            setListeBudget(BudUser)
            setListeBudFiltre(BudUser)
          })

          //on recherche les transactions..
          getAllDataTodatabase("transaction", (e) => {
            setListeTransaction(e)
        })
  
      }, [])

      //fonction au changement du select pour le filtre budget
      const filtreBudget =(Budgetselc) =>{
        //setListeBudget(listeBudFiltre)
        if(Number(Budgetselc)===0){
            
            setListeBudFiltre(listeBudget.filter(leBudget => leBudget.idUser===IdUserConnecte))
        }
        else{
          
          setListeBudFiltre(listeBudget.filter(leBudget => leBudget.id===Number(Budgetselc)) )
        }
      }

      

  return (
    <div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-3 '>

        <div className='border border-gray-300 p-3'>
          <FormulaireTrans listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} listeBudget={listeBudget} setListeBudget={setListeBudget} fenConcerne={""} />
        </div>

        <div className='lg:col-span-2 mt-10 lg:mt-0'>
          <div className="flex flex-col gap-1 mb-3">
              { /* liste des budget de l'user connecté dans le filtre pr les recherches */
                listeBudget?.length>0 ? (
                  <>
                  <label className='ms-auto'>Filtrer par Budget</label>
                  <select defaultValue="" onChange={(e) => filtreBudget(e.target.value)} className="ms-auto select select-md w-60 md:w-100 outline-0 ring-0" name="budget">
                    <option value="" >Toutes les transactions</option>
                    {
                      listeBudget?.map(leBudget => (
                        <option value={leBudget?.id} key={leBudget?.id}>{leBudget?.descriptionBud}</option>
                      ))
                    }
                    </select>
                  </>
                ) : 
                (
                  <>
                    <Link href={"/Budget"} className='btn bg-teal-900 text-white'>Nouveau Budget <i className="bi bi-plus-lg"></i></Link>
                  </>
                )
              }
          </div>

          {/* la table présentant la liste des transactions */}
          <TableTrans listeBudFiltre={listeBudFiltre} listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} listeBudget={listeBudget} setListeBudget={setListeBudget} fenConcerne={""}/>
        </div>
      </div>


      
    </div>
  )
}

export default FenTransaction
