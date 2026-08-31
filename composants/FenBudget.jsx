"use client"
import React, { useState, useEffect } from 'react'
import FormulaireBudg from '@/composants/FormulaireBudg';
import { getAllDataTodatabase } from '@/lib/IndexDB/getAllDB';
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte';
import { DeleteToDB } from '@/lib/IndexDB/deleteToDB';
import { getOneDataTodatabase } from '@/lib/IndexDB/getOneDataToDB';
import GetMesBudgets from '@/mesFonctions/GetMesBudgets';

function FenBudget({listeBudget, setListeBudget}) {
  
    const [IdUserConnecte, setIdUserConnecte] = useState("")
  //On recupère la liste des Budgets dans indexDb quand le composant est monté (page totalement chargé)
    useEffect(() => {

        if (typeof window === "undefined") return;

        getAllDataTodatabase("budget", (e) => {
            setListeBudget(e)
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
                            <h2 className="card-title">
                              Budget {leBudget?.descriptionBud}
                            </h2>
                            <p>Mois : {new Date(leBudget?.moisBud).toLocaleDateString("fr",{month:"long", year:"numeric"})}</p>
                            <p>Montant alloué : {leBudget?.montantBud}</p>
                            <div className="card-actions justify-end">
                              {/*<label htmlFor="my_modal_6"><i className="bi bi-pencil-square cursor-pointer text-lg text-blue-600"></i></label>*/}
                              <button onClick={() => openModal(leBudget)}><i className="bi bi-pencil-square cursor-pointer text-lg text-blue-600"></i></button>
                              <button onClick={() => supprimeBudget(leBudget?.id)}><i className="bi bi-trash-fill cursor-pointer text-lg text-red-600"></i></button>
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
