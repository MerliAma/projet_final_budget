//somme transactions user
export const SommeTransactions = (idBudget, listeTransaction) =>{

    let LaSomme

    if(String(idBudget)!==""){
        //je fais la somme des transactions du budget selectionné

    }
    else{
        //je fais la somme de toutes les transactions de l'user tous mois confondu...
        LaSomme= listeTransaction.reduce((accumulateur, LaTrans) => {
            return accumulateur + LaTrans.montantTrans;
        }, 0)
    }

    return LaSomme
}

//somme montant budget User
export const SommeMontantBud = (listeBudget) =>{

    const SommeBud= listeBudget.reduce((accumulateur, LeBudget) => {
            return accumulateur + LeBudget.montantBud;
        }, 0)

    return SommeBud
}
