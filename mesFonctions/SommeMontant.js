import { getAllDataTodatabase } from "@/lib/IndexDB/getAllDB";
import { getOneDataTodatabase } from "@/lib/IndexDB/getOneDataToDB";

//somme transactions user
export const SommeTransactions = (idBudget, listeTransaction) =>{

    let LaSomme
    let ObjSomNb

    if(String(idBudget)!==""){
        //je fais la somme des transactions du budget selectionné
        let TransBud = listeTransaction.filter(LaTrans => LaTrans.budgetTrans===String(idBudget))
        LaSomme= TransBud.reduce((accumulateur, LaTrans) => {
            return accumulateur + LaTrans.montantTrans;
        }, 0)
        ObjSomNb={Nbr: TransBud.length, Somme: LaSomme}

        return ObjSomNb  //ici je retourne un objet contenant la somme des trans du budget et le nbr de trans du budget
    }
    else{
        //je fais la somme de toutes les transactions de l'user tous mois confondu...
        LaSomme= listeTransaction.reduce((accumulateur, LaTrans) => {
            return accumulateur + LaTrans.montantTrans;
        }, 0)
        
        return LaSomme  //ici je ne retourne que la somme
    }

    
}

//somme montant budget User
export const SommeMontantBud = (listeBudget) =>{

    const SommeBud= listeBudget.reduce((accumulateur, LeBudget) => {
            return accumulateur + LeBudget.montantBud;
        }, 0)

    return SommeBud
}
