import axios from "axios";
import { NextResponse } from "next/server"

export const POST = async (req) => {
    try {

        //On recupere les données du front
        const { descriptionTrans, montantTrans, budgetTrans} = await req.json()

        if (typeof descriptionTrans !== "string" || descriptionTrans === "") return NextResponse.json({ message: "La description est requise" });
        if (!montantTrans || montantTrans <= 0 || typeof montantTrans !== "number") return NextResponse.json({ message: "Le montant doit être supérieur à 0" });
        if (budgetTrans==="")  return NextResponse.json({ message: "Impossible! Aucun Budget selectionné" });
        const dateEnrg = new Date()

        //On ajoute la transaction dans la base de données dans la collection transaction
        const trans = await axios.post(
            `${process.env.db_url}/transaction.json`,
            { descriptionTrans, montantTrans, dateEnrg, budgetTrans}
        )

        //Si echoué
        if (!trans.data) return NextResponse.json({ message: "Transaction non ajoutée, veuillez reeassayer." })

        //Quand le produit est bien ajouté dans la db
        return NextResponse.json({ message: "Transaction ajoutée avec succès", id: trans.data.name })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Une erreur s'est produite" })
    }
}