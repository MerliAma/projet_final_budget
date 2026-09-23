//import { DeleteToDB } from '@/lib/IndexDB/deleteToDB'
import React, { useState } from 'react'
import FormulaireTrans from './FormulaireTrans'
import { SommeTransactions } from '@/mesFonctions/SommeMontant'
import axios from 'axios'

function TableTrans({listeBudFiltre, listeTransaction, setListeTransaction, listeBudget, setListeBudget, fenConcerne}) {
  
  //compteur pour N° d'ordre du tableau
  let compter=1

  //pour la modification de la transaction. on actualise la valeur de transModif avec l'objet laTrans et on la passe en props au formulaire
  const [transModif, setTransModif] = useState(null)
  const openModal = (laTrans) => {
    setTransModif(laTrans)
    setTimeout(() => {
      document.getElementById("openModalTrans")?.click()
    }, 200);
  }
  
  //On supprime la transaction //IndexDB
  /*const supprimeTrans = (id) => {
    if (confirm("Voulez-vous supprimer cette Transaction ?")) {
      DeleteToDB("transaction", id, (e) => {
        if (!e) {
          alert("Tâche non supprimé. une erreur s'est produite")
          return;
        }

        //On retire la tache du tableau js (html)
        const nouveauTableau = listeTransaction.filter(item =>
          item.id !== id
        )

        setListeTransaction(nouveauTableau);
      })
    }
  }*/

    //Realtime db
    const supprimeTrans = async(id) => {
      if (typeof window === "undefined") return;

      //realtime db
      if (confirm("Voulez-vous supprimer cette transaction ?")) {
        
        const reqT = await axios.delete(`/server/transaction/deleteT/${id}`)

        if(!reqT?.data) return
        if(reqT?.data?.message==="Transaction supprimée"){
          alert("Transaction supprimée avec succès")

          //On retire la transaction du tableau js (html)
          const nouveauTableau = listeTransaction.filter(item =>
            item.id !== id
          )

          setListeTransaction(nouveauTableau);
        }
        else{
          alert("Une erreur s'est produite.")
        }
      }
    }
  
    return (
    <>
    <div className=' overflow-x-auto w-full rounded-box border border-base-content/5 bg-base-100 shadow-lg'>
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Date Ajout</th>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Budget Concerné</th>
                  <th>Montant alloué Restant</th>
                  <th>Mois</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="TableTrans">
                {/* Liste de toutes les transactions de l'user  */}
                {
                  (listeBudFiltre?.length>0 && listeTransaction?.length>0 ) && 
                  //on parcourt les budgets de l'user, puis on filtre les transactions de ce budget 
                  <>
                  {listeBudFiltre.map((leBudget,indexB) => (
                    listeTransaction.filter(laTrans => laTrans.budgetTrans===leBudget.id).map((laTransUser,indexT) => (
                      <tr key={`${indexB}-${indexT}`}>
                  <td>{compter++}</td>
                  <td>{new Date(laTransUser?.dateEnrg).toLocaleDateString("fr-FR",{ day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                  <td className=' capitalize'>{laTransUser?.descriptionTrans}</td>
                  <td className='bg-orange-400 text-white text-nowrap'>{`- ${laTransUser?.montantTrans.toLocaleString('fr-FR')}`}</td>
                  <td className=' capitalize font-semibold' >{leBudget?.descriptionBud}</td>
                  <td className=' text-teal-700' >{SommeTransactions(leBudget?.id, listeTransaction, listeBudget, leBudget?.montantBud).reste.toLocaleString('fr-FR')} FCFA</td>
                  <td>{new Date(leBudget?.moisBud).toLocaleDateString("fr",{month:"long", year:"numeric"})}</td>
                  <td className='flex items-center gap-3'>
                    {/*<label htmlFor="my_modal_6" ><i className="bi bi-pencil-square cursor-pointer text-lg text-blue-600"></i></label>
                    <i className="bi bi-trash-fill cursor-pointer text-lg text-red-600"></i>*/}
                    <button onClick={() => openModal(laTransUser)}><i className="bi bi-pencil-square cursor-pointer text-lg text-blue-600"></i></button>
                    <button onClick={() => supprimeTrans(laTransUser?.id)}><i className="bi bi-trash-fill cursor-pointer text-lg text-red-600"></i></button>
                  </td>
                </tr>
                    )))
                  )}</>
                }

              </tbody>
            </table>
          </div>

          <label htmlFor="my_modal_6" id="openModalTrans" className='hidden'></label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          {/* corps modal de modification */}
            <FormulaireTrans listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} listeBudget={listeBudget} setListeBudget={setListeBudget} TransactionM={transModif} fenConcerne={fenConcerne} />
          {/*<div className="modal-action">
            <button className='btn bg-teal-900 text-white'>Valider</button>
            <label htmlFor="my_modal_6" className="btn">Annuler</label>
          </div>*/}
        </div>
      </div>
    </>
  )
}

export default TableTrans
