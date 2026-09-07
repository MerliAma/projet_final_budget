"use client"
import React, { useEffect, useState } from 'react'
import TableTrans from './TableTrans'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'
import FormulaireTrans from './FormulaireTrans'

function LeBudget({idBudget, listeBud, setListeBud, listeTransaction, setListeTransaction}) {
  
    //const [listeBud, setListeBud]=useState([])
    //const [listeTransaction, setListeTransaction]=useState([])

    
  
    return (

    <>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
            <div className='p-3'>
                <div className='card bg-base-100 shadow-sm mb-5'>
                <div className="card-body "> 
                            
                            <div className="p-3 bg-gray-300/50 rounded-md flex flex-col gap-2">
                              
                              <div className='flex justify-items-center justify-between'>
                                <h2 className="card-title">Budget {listeBud[0]?.descriptionBud}</h2>
                                <span className='text-orange-500 text-lg'> {listeBud[0]?.montantBud.toLocaleString('fr-FR')} FCFA</span>
                              </div>
                              <p className='text-gray-800'>{SommeTransactions(listeBud[0]?.id, listeTransaction).Nbr} Transaction(s)   </p>
                            
                            </div>

                            <p className='text-lg'> <span className='font-semibold'>Mois :</span> {new Date(listeBud[0]?.moisBud).toLocaleDateString("fr",{month:"long", year:"numeric"})}</p>
                            
                            <p className='text-red-500 text-md'>{SommeTransactions(listeBud[0]?.id, listeTransaction).Somme.toLocaleString('fr-FR')} FCFA Dépensé</p> 
                            <p className='text-primary text-md'>{SommeTransactions(listeBud[0]?.id, listeTransaction, listeBud, listeBud[0]?.montantBud).reste.toLocaleString('fr-FR')} FCFA Restant</p>
                            
                            {/*<progress className="progress progress-primary" value={SommeTransactions(listeBud[0]?.id, listeTransaction).Somme} max={SommeTransactions(listeBud[0]?.id, listeTransaction, listeBud[0]?.montantBud).reste}></progress>*/}

                          </div>
                        </div>

                <div className='border border-gray-300 p-3'>
          <FormulaireTrans listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} listeBudget={listeBud} setListeBudget={setListeBud} fenConcerne={`${idBudget}`} />
        </div>
            </div>
            
            <div className="col-span-2">
                <TableTrans  listeBudFiltre={listeBud} listeBudget={listeBud} listeTransaction={listeTransaction} setListeBudget={setListeBud} setListeTransaction={setListeTransaction} fenConcerne={`${idBudget}`} />
            </div>
            
        </div>
    </>
    
  )
}

export default LeBudget
