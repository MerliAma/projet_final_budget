import { AddTodatabase } from '@/lib/IndexDB/addToDB'
import React, { useEffect, useRef, useState } from 'react'
import MessageOk from './MessageOk'
import MessageErreur from './MessageErreur'
import { UpdateTodatabase } from '@/lib/IndexDB/updateDataToDB'

function FormulaireTrans({listeTransaction, setListeTransaction, listeBudget, setListeBudget, TransactionM}) {
  
    const [descriptionTrans, setDescriptionTrans] = useState(TransactionM?.descriptionTrans || "")
    const [montantTrans, setMontantTrans] = useState(TransactionM?.montantTrans || "")
    const [budgetTrans, setBudgetTrans] = useState(TransactionM?.budgetTrans || "") 

    const [rep, setRep] = useState(null) //le message de reponse en cas d'erreur...

    //on créé une reference au formulaire
    const formRefT = useRef(null)

    const submitFormT = (e) => {
        e.preventDefault()

        const dateEnrg=new Date().toLocaleString()
        //const idUser=RecupInfosUserConnecte().idUser
        const data = { descriptionTrans, montantTrans, dateEnrg, budgetTrans}

        if (typeof window === "undefined") {
            return;
        }

        if(!TransactionM){
          //ajout transaction
            AddTodatabase("transaction", data, (e) => {
            if (e) {
                setListeTransaction([...listeTransaction, data])
                e ? setRep(true) : setRep(false)
                formRefT.current.reset() //Renitialise le formulaire
                setDescriptionTrans("")
                setMontantTrans("")
                setBudgetTrans("")
            }
            })
        }
        else{
            //modification transaction
          UpdateTodatabase("transaction", TransactionM.id, { descriptionTrans, montantTrans, budgetTrans }, (e) => {
            if (!e) return;

            //On mets à jours aussi la varible Listebudget en créant d'abord un nouveau tableau avec map
            const nouveauTableau = listeTransaction.map(item =>
              item.id === TransactionM.id ? { ...item, descriptionTrans, montantTrans, budgetTrans } : item
            )

            setListeTransaction(nouveauTableau)
            //on ferme le modal
            document.getElementById("closeModalTrans")?.click()
          })
        }
        
    }

    //important pour l'actualisation des données et l'affichage ds le cas de la modification
         useEffect(() => {
            if(TransactionM) {
                setMontantTrans(TransactionM.montantTrans)
                setDescriptionTrans(TransactionM.descriptionTrans)
                setBudgetTrans(TransactionM.budgetTrans)
            }
        }, [TransactionM])

    return (
      <div>
          <form ref={formRefT} onSubmit={(e) => submitFormT(e)}>
              <input type='text' value={descriptionTrans} onChange={(e) => setDescriptionTrans(e.target.value)} required name="description" placeholder='Description' className='input w-full mb-3 outline-0 ring-0' />
              <input type="text" value={montantTrans} onChange={(e) => setMontantTrans(Number(e.target.value))} required name="montant" placeholder="Montant" className='input w-full mb-3 outline-0 ring-0' />
              { /* liste des budget de l'user connecté dans le filtre pr les recherches */
                listeBudget?.length>0 ? (
                  <>
                  <select value={budgetTrans} className="ms-auto select select-md w-full outline-0 ring-0" required onChange={(e) => setBudgetTrans(e.target.value)}>
                    <option value="" disabled>Choisir un budget</option>
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
                    <select defaultValue="" className="ms-auto select select-md w-full outline-0 ring-0" required></select>
                  </>
                )
              }
              <button className='btn bg-teal-900 text-white mt-5' type='submit'>{!TransactionM ? "Ajouter" : "Modifier"} Transaction <i className="bi bi-plus-lg"></i></button>
              {TransactionM && <button type="button" className='btn ms-5 mt-5' onClick={() => document.getElementById("closeModalTrans")?.click()}>Annuler </button>}
          </form>

          {/* afficher un message en cas de succès ou d'erreur */}
        {
          rep!==null && (
          <>
          {rep ? 
          <MessageOk message={"Transaction enregistrée avec succès"} onClose={() => setRep(null)} />
          : <MessageErreur message={"Une erreur s'est produite"} onClose={() => setRep(null)} />
          }
          </>
        )
        }

        {/* fermer le modal */}
        <label htmlFor="my_modal_6" className="btn hidden" id='closeModalTrans'>Annuler</label>
      </div>
  )
}

export default FormulaireTrans
