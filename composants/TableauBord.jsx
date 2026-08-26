"use client"
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
import { SommeMontantBud, SommeTransactions } from '@/mesFonctions/SommeMontant';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoEyeSharp } from "react-icons/io5";

function TableauBord({listeBudget, setListeBudget, listeTransaction, setListeTransaction}) {

    const [IdUserConnecte, setIdUserConnecte] = useState("")
    
    let compter=1
    
    //On recupère la liste des Transactions-Budget dans indexDb quand le composant est monté (page totalement chargé)
    useEffect(() => {

        if (typeof window === "undefined") return;

        //on profite pour récupérer l'ID de l'utilisateur connecter avec la fonction importée RecupInfosUserConnecte()
        setIdUserConnecte(RecupInfosUserConnecte()?.idUser)

        //on filtre les budgets de l'utilisateurs
        getAllDataTodatabase("budget", (e) => {
            e.filter(leBudget => leBudget.idUser === IdUserConnecte)
            console.log(e)
            setListeBudget(e)
        })

        //on recherche les transactions..
        getAllDataTodatabase("transaction", (e) => {
            setListeTransaction(e)
        })

    }, [])

    /* a voir pr la somme du montant de toutes les transactions, voir si je peux mettre dans une fonction
    const panier = [
  { produit: 'Livre', prix: 15 },
  { produit: 'Stylo', prix: 3 },
  { produit: 'Sac', prix: 45 }
];

// On initialise l'accumulateur à 0
const prixTotal = panier.reduce((accumulateur, objetActuel) => {
  return accumulateur + objetActuel.prix;
}, 0);
*/

    return (
    <div className="p-4">
            <div className='flex flex-col-reverse md:flex-row items-center gap-15 md:justify-between my-5'>
                <h3 className="font-bold m-3">Mes 10 dernières transactions</h3>
                {/*<button className='btn bg-teal-900 text-white'>Nouveau Budget <i className="bi bi-plus-lg"></i></button>*/}
                <div className='flex gap-3'>
                    <Link href={"/Budget"} className='badge badge-lg bg-teal-900 text-white'>Consulter Budget <IoEyeSharp /> </Link>
                    <Link href={"/Transaction"} className='badge badge-lg bg-teal-900 text-white'>Consulter Transaction <IoEyeSharp /></Link>
                </div>
            </div>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
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
                        {/* Liste de toutes les transactions de l'user  */}
                {
                  (listeBudget?.length>0 && listeTransaction?.length>0 ) && 
                  //on parcourt les budgets de l'user, puis on filtre les transactions de ce budget 
                  <>
                  {listeBudget.map((leBudget,indexB) => (
                    listeTransaction.filter(laTrans => Number(laTrans.budgetTrans)===leBudget.id)
                    .slice(0, 10)
                    .sort((a, b) => Date.parse(b.dateEnrg) - Date.parse(a.dateEnrg))
                    .map((laTransUser,indexT) => (
                      <tr key={`${indexB}-${indexT}`}>
                  <td id="num">{compter++}</td>
                  <td>{laTransUser?.dateEnrg.toLocaleString()}</td>
                  <td>{laTransUser?.descriptionTrans}</td>
                  <td>{laTransUser?.montantTrans}</td>
                  <td>{leBudget?.descriptionBud}</td>
                  <td>{new Date(leBudget?.moisBud).toLocaleDateString("fr",{month:"long", year:"numeric"})}</td>
                </tr>
                    )))
                  )}</>
                }
                    </tbody>
                </table>
            </div>
            
            {/* Etiquettes */}
            <div className="grid grid-cols-3 gap-5 my-10">
                <div className="card bg-base-100 card-lg shadow-sm">
                    <div className="card-body"> {/* somme du montant alloué de tous les budgets confondues */}
                        <h2 className="card-title">{`${SommeMontantBud(listeBudget)} FCFA`}</h2>
                        <p>Montant Total alloué</p>
                    </div>
                </div>

                <div className="card bg-base-100 card-lg shadow-sm">
                    <div className="card-body"> {/* somme de toutes les transactions confondues */}
                        <h2 className="card-title">{`${SommeTransactions("",listeTransaction)} FCFA`}</h2>
                        <p>Total des Transactions</p>
                    </div>
                </div>

                <div className="card bg-base-100 card-lg shadow-sm">
                    <div className="card-body"> {/* ? */}
                        <h2 className="card-title">0 %</h2>
                        <p>Taux de Réussite</p>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default TableauBord
