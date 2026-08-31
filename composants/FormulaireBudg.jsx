"use client"
import { AddTodatabase } from '@/lib/IndexDB/addToDB'
import React, { useEffect, useRef, useState } from 'react'
import MessageOk from './MessageOk'
import MessageErreur from './MessageErreur'
import { RecupInfosUserConnecte } from '@/mesFonctions/RecupInfosUserConnecte'
import { UpdateTodatabase } from '@/lib/IndexDB/updateDataToDB'

function FormulaireBudg({listeBudget, setListeBudget, BudgetM}) {

  //const [listeBudget, setListeBudget]=useState([])
  const [montantBud, setMontantBud] = useState(BudgetM?.montantBud || "")
  const [descriptionBud, setDescriptionBud] = useState(BudgetM?.descriptionBud || "")
  const [moisBud, setMoisBud] = useState(BudgetM?.moisBud || null)
  
  const [rep, setRep] = useState(null) //le message de reponse en cas d'erreur...

  //on créé une reference au formulaire
    const formRef = useRef(null)

    //On ajoute le budget dans indexDB
    const submitForm = (e) => {
        e.preventDefault()
        const dateEnrg=new Date() //.toLocaleString()
        const idUser=RecupInfosUserConnecte().idUser
        const data = { descriptionBud, montantBud, moisBud, dateEnrg, idUser}

        if (typeof window === "undefined") {
            return;
        }

        if(!BudgetM){
          //ajout budget
          AddTodatabase("budget", data, (e) => {
            if (e) {
                setListeBudget([...listeBudget, data])
                e ? setRep(true) : setRep(false) 
                formRef.current.reset() //Renitialise le formulaire
                setDescriptionBud("")
                setMontantBud("")
                setMoisBud("")
            }
          })
        }
        else{
          //modification budget
          UpdateTodatabase("budget", BudgetM.id, {descriptionBud, montantBud, moisBud}, (e) => {
            if(!e) return;

            //On mets à jours aussi la varible Listebudget en créant d'abord un nouveau tableau avec map
            const nouveauTableau = listeBudget.map(item =>
                    item.id === BudgetM.id ? { ...item, descriptionBud, montantBud, moisBud } : item
            )

            setListeBudget(nouveauTableau)
            //on ferme le modal
            document.getElementById("closeModalBTN")?.click()
          })
        }
    }

    //important pour l'actualisation des données et l'affichage ds le cas de la modification
     useEffect(() => {
        if(BudgetM) {
            setMontantBud(BudgetM.montantBud)
            setMoisBud(BudgetM.moisBud)
            setDescriptionBud(BudgetM.descriptionBud)
        }
    }, [BudgetM])


  return (
      <div>
        <form ref={formRef} onSubmit={(e) => submitForm(e)}>
          <input type='text' value={descriptionBud} onChange={(e) => setDescriptionBud(e.target.value)} required name="descriptionBud" placeholder='Description Budget' className='input w-full mb-3 outline-0 ring-0' />
          <input type="text" value={montantBud} onChange={(e) => setMontantBud(Number(e.target.value))} required name="montantBud" placeholder="Montant Alloué" className='input w-full mb-3 outline-0 ring-0' />
          <input type="month" value={moisBud===null ? "" : moisBud} onChange={(e) => setMoisBud(e.target.value)} required name="moisBud" placeholder="Mois concerné" className='input w-full mb-3 outline-0 ring-0' />
          <button type="submit" className='btn bg-teal-900 text-white'>{!BudgetM ? "Ajouter" : "Modifier"} Budget <i className="bi bi-plus-lg"></i></button>
          {BudgetM && <button type="button" className='btn ms-5' onClick={() => document.getElementById("closeModalBTN")?.click()}>Annuler </button>}
          
        </form>

        {/* afficher un message en cas de succès ou d'erreur */}
        {
          rep!==null && (
          <>
          {rep ? 
          <MessageOk message={"Budget enregistré avec succès"} onClose={() => setRep(null)} />
          : <MessageErreur message={"Une erreur s'est produite"} onClose={() => setRep(null)} />
          }
          </>
        )
        }
        {/* fermer le modal */}
        <label htmlFor="my_modal_6" className="btn hidden" id='closeModalBTN' ></label>
      </div>
  )
}

export default FormulaireBudg
