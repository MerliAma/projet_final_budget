"use client"
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
import { SommeMontantBud, SommeTransactions } from '@/mesFonctions/SommeMontant';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoEyeSharp } from "react-icons/io5";

function TableauBord({listeBudget, setListeBudget, listeTransaction, setListeTransaction}) {

    const [IdUserConnecte, setIdUserConnecte] = useState("")
    
    let compter=1
    //let IdUserConnecte=""
    
    //On recupère la liste des Transactions-Budget dans indexDb quand le composant est monté (page totalement chargé)
    useEffect(() => {

        if (typeof window === "undefined") return;

        //on profite pour récupérer l'ID de l'utilisateur connecter avec la fonction importée RecupInfosUserConnecte()
        setIdUserConnecte(RecupInfosUserConnecte()?.idUser)
        //IdUserConnecte=RecupInfosUserConnecte()?.idUser

        //on filtre les budgets de l'utilisateurs (IndexDB)
        /*getAllDataTodatabase("budget", (e) => {
            const ListeBud=e.filter(leBudget => leBudget.idUser === IdUserConnecte)
            setListeBudget(ListeBud)
            //console.log(ListeBud,"ama", RecupInfosUserConnecte()?.idUser)
        })

        //on recherche les transactions..
        getAllDataTodatabase("transaction", (e) => {
            setListeTransaction(e)
        })*/
       
       //utilisation de la bd realtime de firebase
       //const btnClick=document.getElementById('RemplirBudTrans').click()
        //if(btnClick) console.log(listeBudget)
    }, [])

     //pour l'utilisation de la bd realtime de firebase
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!IdUserConnecte) return;
        GetBudgetTrans();
        }, [IdUserConnecte]);

    //fonction à exécuter pour le remplissage des tableaux de budgets et transactions
    const GetBudgetTrans = async () => {
    try {
        //On appel notre api backend pour recuperer tous les budgets et transactions
        const req = await axios.get("/server/budget/get-all")
        if(req?.data){
            //setListeBudget(req?.data.budgets)
            const ListeBud=req?.data.budgets.filter(leBudget => leBudget.idUser === IdUserConnecte)
            setListeBudget(ListeBud)
        }  
        
        const req2 = await axios.get("/server/transaction/get-all")
        if(req2?.data){
            setListeTransaction(req2?.data.transactions)
        } 

    } catch (error) {
       const message = error?.message
       console.log("Erreur: ", message) 
    }
 }

    return (
    <div className="p-4">
        {/*Bouton pour l'exécution de mes routes api */}
        <button className='hidden' onClick={() => GetBudgetTrans()} id='RemplirBudTrans'></button>

            <div className='flex flex-col md:flex-row items-center gap-10 md:justify-between my-5'>
                <h3 className="font-bold ">Tableau de Bord</h3>
                {/*<button className='btn bg-teal-900 text-white'>Nouveau Budget <i className="bi bi-plus-lg"></i></button>*/}
                <div className='flex gap-3'>
                    <Link href={"/Budget"} className='badge badge-md lg:badge-lg bg-teal-900 text-white'>Consulter Budget <IoEyeSharp /> </Link>
                    <Link href={"/Transaction"} className='badge badge-md lg:badge-lg bg-teal-900 text-white'>Consulter Transaction <IoEyeSharp /></Link>
                </div>
            </div>

            {/* Etiquettes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 my-10">
                <div className="card bg-base-100 card-lg shadow-md shadow-blue-400/80">
                    <div className="card-body"> {/* somme du montant alloué de tous les budgets confondues */}
                        <h2 className="card-title">{`${SommeMontantBud(listeBudget).toLocaleString('fr-FR')} FCFA`}</h2>
                        <p>Montant Total alloué</p>
                        <p>&nbsp;&nbsp;&nbsp; Nombre de Budget: <b>{listeBudget.length}</b></p>
                    </div>
                </div>

                <div className="card bg-base-100 card-lg shadow-md shadow-red-400">
                    <div className="card-body"> {/* somme de toutes les transactions confondues */}
                        <h2 className="card-title">{`${SommeTransactions("",listeTransaction,listeBudget,0).toLocaleString('fr-FR')} FCFA`}</h2>
                        <p>Montant Total des Transactions</p>
                        {/*<p>&nbsp;&nbsp;&nbsp; Nombre de Transactions: <b>{listeTransaction.length}</b></p>*/}
                    </div>
                </div>

                <div className="card bg-base-100 card-lg shadow-md shadow-green-400/80">
                    <div className="card-body"> {/* ? */}
                        <h2 className="card-title">0 %</h2>
                        <p>Taux de Réussite</p>
                    </div>
                </div>
            </div>

            {/* Tableau transactions */}
            <h3 className="font-bold mb-10">Mes 10 dernières transactions</h3>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 shadow-lg">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Montant</th>
                            <th>Budget Int.</th>
                            <th>Mois</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Liste des 10 dernières transactions de l'user  */}
                {
                  (listeBudget?.length>0 && listeTransaction?.length>0 ) && 
                  //on parcourt les budgets de l'user, puis on filtre les transactions de ce budget 
                  <>
                  {listeBudget.map((leBudget,indexB) => (
                    listeTransaction.filter(laTrans => laTrans.budgetTrans===leBudget.id) //plus de Number car plus de index DB
                    .slice(0, 9)
                    .sort((a, b) => Date.parse(b.dateEnrg) - Date.parse(a.dateEnrg)) //pr ranger dans l'ordre décroissant des dates
                    .map((laTransUser,indexT) => (
                      <tr key={`${indexB}-${indexT}`}>
                  <td id="num">{compter++}</td>
                  <td>{new Date(laTransUser?.dateEnrg).toLocaleDateString("fr",{ day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                  <td className=' capitalize'>{laTransUser?.descriptionTrans}</td>
                  <td className='text-red-500'>{`- ${laTransUser?.montantTrans.toLocaleString('fr-FR')}`}</td>
                  <td className=' capitalize font-semibold'>{leBudget?.descriptionBud}</td>
                  <td>{new Date(leBudget?.moisBud).toLocaleDateString("fr",{month:"long", year:"numeric"})}</td>
                </tr>
                    )))
                  )}</>
                }
                    </tbody>
                </table>
            </div>
            
        </div>
  )
}

export default TableauBord
