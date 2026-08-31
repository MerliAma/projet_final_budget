import axios from "axios";
import { NextResponse } from "next/server"

export const POST = async (req) => {
    try {

        //On recupere les données du front
        const { descriptionBud, montantBud, moisBud, idUser} = await req.json()

        if (typeof descriptionBud !== "string" || descriptionBud === "") return NextResponse.json({ message: "La description est requise" });
        if (!montantBud || montantBud <= 0 || typeof montantBud !== "number") return NextResponse.json({ message: "Le montant doit être supérieur à 0" });
        if (idUser==="")  return NextResponse.json({ message: "Impossible! Aucun utilisateur connecté" });
        const dateEnrg = new Date()

        //On ajoute le budget dans la base de données dans la collection budget
        const budget = await axios.post(
            `${process.env.db_url}/budget.json`,
            {descriptionBud, montantBud, moisBud, dateEnrg, idUser}
        )

        //Si echoué
        if (!budget.data) return NextResponse.json({ message: "Budget non ajouté, veuillez reeassayer." })

        //Quand le produit est bien ajouté dans la db
        return NextResponse.json({ message: "Budget ajouté avec succès", id: budget.data.name })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Une erreur s'est produite" })
    }
}