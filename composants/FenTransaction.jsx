"use client"
import React, { useEffect, useState } from 'react'
import FormulaireTrans from '@/composants/FormulaireTrans';
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB';

function FenTransaction({listeTransaction, setListeTransaction, listeBudget, setListeBudget}) {
  
  const [IdUserConnecte, setIdUserConnecte] = useState("")
    //On recupère la liste des Transactions-Budget dans indexDb quand le composant est monté (page totalement chargé)
      useEffect(() => {
  
          if (typeof window === "undefined") return;
  
          //on profite pour récupérer l'ID de l'utilisateur connecter avec la fonction importée RecupInfosUserConnecte()
          setIdUserConnecte(RecupInfosUserConnecte()?.idUser)

          //on filtre les budgets de l'utilisateurs
          getAllDataTodatabase("budget", (e) => {
            e.filter(leBudget => leBudget.idUser===IdUserConnecte)
            setListeBudget(e)
          })

          //on recherche les transactions..
          getAllDataTodatabase("transaction", (e) => {
            setListeTransaction(e)
        })
  
      }, [])

      //pour la modification de la transaction. on actualise la valeur de transModif avec l'objet laTrans et on la passe en props au formulaire
  const [transModif, setTransModif] = useState(null)
  const openModal = (laTrans) => {
    setTransModif(laTrans)
    setTimeout(() => {
      document.getElementById("openModalTrans")?.click()
    }, 100);
  }
  
  //On supprime la transaction
  const supprimeTrans = (id) => {
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
  }

  return (
    <div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-3 '>

        <div className='border border-gray-300 p-3'>
          <FormulaireTrans listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} listeBudget={listeBudget} setListeBudget={setListeBudget}  />
        </div>

        <div className='lg:col-span-2'>
          <div className="flex flex-col gap-1 mb-3">
              { /* liste des budget de l'user connecté dans le filtre pr les recherches */
                listeBudget?.length>0 ? (
                  <>
                  <label className='ms-auto'>Filtrer par Budget</label>
                  <select defaultValue="" className="ms-auto select select-md w-60 md:w-100 outline-0 ring-0" name="budget">
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
                    <button className='btn bg-teal-900 text-white'>Nouveau Budget <i className="bi bi-plus-lg"></i></button>
                  </>
                )
              }
          </div>

          <div className=' overflow-x-auto w-full'>
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Date Ajout</th>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Budget Concerné</th>
                  <th>Mois</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Liste de toutes les transactions de l'user  */}
                {
                  (listeBudget?.length>0 && listeTransaction?.length>0 ) && 
                  //on parcourt les budget de l'user, puis on filtre les transactions de ce budget 
                  <>
                  {listeBudget.map(leBudget => (
                    listeTransaction.filter(laTrans => Number(laTrans.budgetTrans)===leBudget.id).map((laTransUser,index) => (
                      <tr key={laTransUser?.id || index+1}>
                  <th>{index+1}</th>
                  <td>{laTransUser?.dateEnrg || index+1}</td>
                  <td>{laTransUser?.descriptionTrans}</td>
                  <td>{laTransUser?.montantTrans}</td>
                  <td>{leBudget?.descriptionBud}</td>
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
        </div>
      </div>


      <label htmlFor="my_modal_6" id="openModalTrans" className='hidden'></label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          {/* corps modal de modification */}
            <FormulaireTrans listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} listeBudget={listeBudget} setListeBudget={setListeBudget} TransactionM={transModif} />
          {/*<div className="modal-action">
            <button className='btn bg-teal-900 text-white'>Valider</button>
            <label htmlFor="my_modal_6" className="btn">Annuler</label>
          </div>*/}
        </div>
      </div>
    </div>
  )
}

export default FenTransaction
