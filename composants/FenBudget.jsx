"use client"
import React, { useState, useEffect } from 'react'
import FormulaireBudg from '@/composants/FormulaireBudg';
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
import { DeleteToDB } from '@/lib/IndexDB/deleteToDB';
import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB';
import GetMesBudgets from '@/mesFonctions/GetMesBudgets';
import { SommeTransactions } from '@/mesFonctions/SommeMontant';
import { LuEye } from 'react-icons/lu';
import Link from 'next/link';

function FenBudget({listeBudget, setListeBudget, listeTransaction, setListeTransaction}) {
  
    const [IdUserConnecte, setIdUserConnecte] = useState("")
    //const [idBuget, setIdBudget]=useState("") //pr afficher les transactions d'un budget dans un popup
    
  //On recupère la liste des Budgets dans indexDb quand le composant est monté (page totalement chargé)
    useEffect(() => {

        if (typeof window === "undefined") return;

        getAllDataTodatabase("budget", (e) => {
            setListeBudget(e)
        })
         getAllDataTodatabase("transaction", (e) => {
            setListeTransaction(e)
        })

        //on profite pour récupérer l'ID de l'utilisateur connecter avec la fonction importée RecupInfosUserConnecte()
        setIdUserConnecte(RecupInfosUserConnecte()?.idUser)

    }, [])

    //pour ouvrir la fenêtre modal pour la modification en lui donnant la variable budgetModif comme paramètre
    const [budgetModif, setBudgetModif] = useState(null)
    const openModal = (leBudget) => {
        setBudgetModif(leBudget)
        setTimeout(() => {
            document.getElementById("openModalBTN")?.click()
        }, 200);
    }

    //On supprime le budget
    const supprimeBudget = (id) => {
      if (typeof window === "undefined") return;
      //verifier si le budget n'a pas des transactions asoocié //supprimer le string après String(id)
      getOneDataTodatabase("transaction",{champ:"budgetTrans", valeur:String(id)}, (e) =>{
        if(e) {
          alert("Suppression impossible! Ce budget a des transactions associées")
          return;
        }

        //dans le cas ou le budget n'a pas encore de transaction on peut le supprimer si l'user confirme
        if (confirm("Voulez-vous supprimer ce Budget ?")) {
            DeleteToDB("budget", id, (e) => {
                if (!e) {
                    alert("Budget non supprimé. une erreur s'est produite")
                    return;
                }

                //On retire la tache du tableau js (html)
                const nouveauTableau = listeBudget.filter(item =>
                    item.id !== id
                )

                setListeBudget(nouveauTableau);
            })
        }
      })
    }

  
    return (
    <>
      {/* La grande grille pour la fenêtre budget*/}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-3 '>

        <div className="col-span-2">
          {/* Les cartes pour présenter les différents budgets dans une grille - lié à la BASE DE DONNEES */}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 '>
          {
            listeBudget?.length>0 ? (
                <>
                    {
                      listeBudget?.filter(leBudget => leBudget.idUser===IdUserConnecte).map((leBudget, index)=>(
                      /*listeBudget?.map((leBudget, index)=>(*/
                         <div key={leBudget?.id || index+1} className="card bg-base-100 shadow-sm" >
                          <div className="card-body"> 
                            
                            <div className="p-3 bg-gray-300/50 rounded-md flex flex-col gap-2">
                              
                              <div className='flex justify-items-center justify-between'>
                                <h2 className="card-title">Budget {leBudget?.descriptionBud}</h2>
                                <span className='text-orange-500 text-lg'> {leBudget?.montantBud.toLocaleString('fr-FR')} FCFA</span>
                              </div>
                              <p className='text-gray-800'>{SommeTransactions(leBudget?.id, listeTransaction).Nbr} Transaction(s)   </p>
                            
                            </div>

                            <p className='text-lg'> <span className='font-semibold'>Mois :</span> {new Date(leBudget?.moisBud).toLocaleDateString("fr",{month:"long", year:"numeric"})}</p>
                            
                            <p className='text-red-500 text-md'>{SommeTransactions(leBudget?.id, listeTransaction).Somme.toLocaleString('fr-FR')} FCFA Dépensé</p> 
                            <p className='text-primary text-md'>{SommeTransactions(leBudget?.id, listeTransaction, listeBudget, leBudget?.montantBud).reste.toLocaleString('fr-FR')} FCFA Restant</p>
                            
                            <progress className="progress progress-primary" value={SommeTransactions(leBudget?.id, listeTransaction).Somme} max={SommeTransactions(leBudget?.id, listeTransaction, listeBudget, leBudget?.montantBud).reste}><span>{((SommeTransactions(leBudget?.id, listeTransaction).Somme)/leBudget?.montantBud)*100}%</span></progress>

                            <div className="card-actions justify-end justify-items-center">
                              {/*<label htmlFor="my_modal_6"><i className="bi bi-pencil-square cursor-pointer text-lg text-blue-600"></i></label>*/}
                              <button onClick={() => openModal(leBudget)}><i className="bi bi-pencil-square cursor-pointer text-lg text-blue-600" title='Modifier Budget'></i></button>
                              <Link href={`/LeBudget/${leBudget?.id}`}> <button><LuEye className='cursor-pointer text-xl text-green-600 mt-1' title='Voir les Transactions'/></button> </Link>
                              <button onClick={() => supprimeBudget(leBudget?.id)}><i className="bi bi-trash-fill cursor-pointer text-lg text-red-600" title='Supprimer Budget'></i></button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                </>
            ) : 
            (
                <h4 className='text-center'>Aucun Budget enregisté pour le moment</h4>
            )
          }            

          </div>
        </div>

        <div className='mt-10 lg:mt-0'>
          
            <FormulaireBudg listeBudget={listeBudget} setListeBudget={setListeBudget} />
        </div>
      </div>

      {/*Modal pour la modification d'un Budget */}
      <label htmlFor="my_modal_6" id="openModalBTN" className='hidden'></label>
      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          {/* corps modal de modification */}
          <FormulaireBudg listeBudget={listeBudget} setListeBudget={setListeBudget} BudgetM={budgetModif} />
          {/*<div className="modal-action">
            <label htmlFor="my_modal_6" className="btn">Annuler</label>
          </div>*/}
        </div>
      </div>
    </>
  )
}

export default FenBudget
