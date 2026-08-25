"use client"
import React, { useEffect, useState } from 'react'
import FormulaireTrans from '@/composants/FormulaireTrans';
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB';
import Link from 'next/link';

function FenTransaction({listeTransaction, setListeTransaction, listeBudget, setListeBudget}) {
  
  const [IdUserConnecte, setIdUserConnecte] = useState("")
  const [listeBudFiltre, setListeBudFiltre] = useState([]) // pour faire le filtre, ce tableau est filtré et parcouru

    //On recupère la liste des Transactions-Budget dans indexDb quand le composant est monté (page totalement chargé)
      useEffect(() => {
  
          if (typeof window === "undefined") return;
  
          //on profite pour récupérer l'ID de l'utilisateur connecter avec la fonction importée RecupInfosUserConnecte()
          setIdUserConnecte(RecupInfosUserConnecte()?.idUser)

          //on filtre les budgets de l'utilisateurs
          getAllDataTodatabase("budget", (e) => {
            e.filter(leBudget => leBudget.idUser===IdUserConnecte)
            setListeBudget(e)
            setListeBudFiltre(e)
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

      //pour la modification de la transaction. on actualise la valeur de transModif avec l'objet laTrans et on la passe en props au formulaire
  const [transModif, setTransModif] = useState(null)
  const openModal = (laTrans) => {
    setTransModif(laTrans)
    setTimeout(() => {
      document.getElementById("openModalTrans")?.click()
    }, 200);
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
              <tbody id="TableTrans">
                {/* Liste de toutes les transactions de l'user  */}
                {
                  (listeBudFiltre?.length>0 && listeTransaction?.length>0 ) && 
                  //on parcourt les budgets de l'user, puis on filtre les transactions de ce budget 
                  <>
                  {listeBudFiltre.map((leBudget,index) => (
                    listeTransaction.filter(laTrans => Number(laTrans.budgetTrans)===leBudget.id).map((laTransUser) => (
                      <tr key={laTransUser?.id}>
                  <td>{index+1}</td>
                  <td>{laTransUser?.dateEnrg}</td>
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
