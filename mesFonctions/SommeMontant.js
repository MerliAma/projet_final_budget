import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB";
import { getOneDataTodatabase } from "@/lib/IndexDB/getOneDataToDB";

//somme transactions user
export const SommeTransactionsama = (idBudget, listeTransaction, listeBudget, montantBud) =>{

    let LaSomme=0
    let ObjSomNb={Nbr: 0, Somme: 0, reste: 0}

    if(String(idBudget)!==""){
        //je fais la somme des transactions du budget selectionné
        let TransBud = listeTransaction.filter(LaTrans => LaTrans.budgetTrans===String(idBudget))
        LaSomme= TransBud.reduce((accumulateur, LaTrans) => {
            return accumulateur + LaTrans.montantTrans;
        }, 0)
        let reste = montantBud - LaSomme
        ObjSomNb={Nbr: TransBud.length, Somme: LaSomme, reste}

        return ObjSomNb  //ici je retourne un objet contenant la somme des trans du budget et le nbr de trans du budget
    }
    else{
        //je fais la somme de toutes les transactions de l'user tous mois confondu...

        //const listeTrans=/*
        listeBudget.map(leBud => {
            LaSomme += listeTransaction
                .filter(LaTrans => LaTrans.budgetTrans === String(leBud.id))
                .reduce((accumulateur, LaTrans) => accumulateur + LaTrans.montantTrans, 0)
        })

        /*LaSomme= listeTransaction.reduce((accumulateur, LaTrans) => {
            return accumulateur + LaTrans.montantTrans;
        }, 0)*/
        
        return LaSomme  //ici je ne retourne que la somme
    }

    
}

//fonction corrigée par IA
export const SommeTransactions = (idBudget, listeTransaction = [], listeBudget = [], montantBud = 0) => {
    let LaSomme = 0
    let ObjSomNb = { Nbr: 0, Somme: 0, reste: 0 }

    if (String(idBudget) !== "") {
        let TransBud = (listeTransaction || []).filter(
            LaTrans => LaTrans.budgetTrans === String(idBudget)
        )

        LaSomme = TransBud.reduce((accumulateur, LaTrans) => {
            return accumulateur + Number(LaTrans.montantTrans || 0)
        }, 0)

        let reste = Number(montantBud || 0) - LaSomme
        ObjSomNb = { Nbr: TransBud.length, Somme: LaSomme, reste }

        return ObjSomNb
    } else {
        const budgets = Array.isArray(listeBudget) ? listeBudget : []
        const transactions = Array.isArray(listeTransaction) ? listeTransaction : []

        budgets.forEach(leBud => {
            LaSomme += transactions
                .filter(LaTrans => LaTrans.budgetTrans === String(leBud.id))
                .reduce((accumulateur, LaTrans) => accumulateur + Number(LaTrans.montantTrans || 0), 0)
        })

        return LaSomme
    }
}

//somme montant budget User
export const SommeMontantBudama = (listeBudget) =>{

    const SommeBud= listeBudget.reduce((accumulateur, LeBudget) => {
            return accumulateur + LeBudget.montantBud;
        }, 0)

    return SommeBud
}

//fonction corrigée par IA
export const SommeMontantBud = (listeBudget = []) => {
    const budgets = Array.isArray(listeBudget) ? listeBudget : []
    return budgets.reduce((accumulateur, LeBudget) => {
        return accumulateur + Number(LeBudget.montantBud || 0)
    }, 0)
}