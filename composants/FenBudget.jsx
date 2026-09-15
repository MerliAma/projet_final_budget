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
import axios from 'axios';

function FenBudget({listeBudget, setListeBudget, listeTransaction, setListeTransaction}) {
  
    const [IdUserConnecte, setIdUserConnecte] = useState("")
    //const [idBuget, setIdBudget]=useState("") //pr afficher les transactions d'un budget dans un popup

  //On recupère la liste des Budgets dans indexDb quand le composant est monté (page totalement chargé)
    useEffect(() => {

        if (typeof window === "undefined") return;

        /*getAllDataTodatabase("budget", (e) => {
            setListeBudget(e)
        })
         getAllDataTodatabase("transaction", (e) => {
            setListeTransaction(e)
        })*/

        //utilisation de la bd realtime de firebase
        //document.getElementById('RemplirBudTrans').click()

        //on profite pour récupérer l'ID de l'utilisateur connecter avec la fonction importée RecupInfosUserConnecte()
        setIdUserConnecte(RecupInfosUserConnecte()?.idUser)

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
                setListeBudget(req?.data.budgets)
               
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
//console.log(SommeTransactions("-P0MXY76XT75Y3lj-M41", listeTransaction,listeBudget,0).Somme)
    //pour ouvrir la fenêtre modal pour la modification en lui donnant la variable budgetModif comme paramètre
    const [budgetModif, setBudgetModif] = useState(null)
    const openModal = (leBudget) => {
        setBudgetModif(leBudget)
        setTimeout(() => {
            document.getElementById("openModalBTN")?.click()
        }, 200);
    }

    //On supprime le budget//avec index DB
    /*const supprimeBudget = (id) => {
      if (typeof window === "undefined") return;
      //verifier si le budget n'a pas des transactions asoocié //supprimer le string après String(id)
      //index DB
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

                //On retire le budget du tableau js (html)
                const nouveauTableau = listeBudget.filter(item =>
                    item.id !== id
                )

                setListeBudget(nouveauTableau);
            })
        }
      })
    }*/

      //realtime db
     const supprimeBudget = async(id) => {
      if (typeof window === "undefined") return;

      //realtime db
      //je supprime en mm temps les transaction du budget s'il confirme
      if (confirm("Voulez-vous supprimer ce Budget ? NB: Les transactions du Budget seront aussi supprimées")) {
        //suppression des transactions
        const req = await axios.get("/server/transaction/get-all")
        if(!req?.data) return

        if(req?.data){
          const TransBud=req?.data?.transactions.filter(item => item.budgetTrans===id)
          //a voir... 
          const TabIdTrans=TransBud.map(item => item.id)
          //appel à ma route delete_many pour supprimer les transactions...
          const supTrans = await axios.delete("/server/transaction/delete-many", {data: { ids: TabIdTrans }})
          
          if(!supTrans?.data) return;
        
        //suppression du budget
        const reqB = await axios.delete(`/server/budget/deleteB/${id}`)

        if(!reqB?.data) return
        if(reqB?.data?.message==="Budget supprimé"){
          alert("Budget supprimé avec succès")

          //On retire la tache du tableau js (html)
          const nouveauTableau = listeBudget.filter(item =>
            item.id !== id
          )

          setListeBudget(nouveauTableau);
        }
        else{
          alert("Une erreur s'est produite.")
        }
      }
    }
  }
  
    return (
    <>
      <button className='hidden' onClick={() => GetBudgetTrans()} id='RemplirBudTrans'></button>
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
                            
                            <progress className="progress progress-primary" value={SommeTransactions(leBudget?.id, listeTransaction).Somme} max={leBudget?.montantBud}><span>{((SommeTransactions(leBudget?.id, listeTransaction).Somme)/leBudget?.montantBud)*100}%</span></progress>

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
