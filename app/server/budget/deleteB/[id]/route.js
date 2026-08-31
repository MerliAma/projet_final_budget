import axios from "axios"
import { NextResponse } from "next/server"

export const DELETE = async (req, { params }) => {
    try {
        
        //On recupère le parametre id
        const { id } = await params 

        // On vérifie si le budget existe
        const BudgetExiste = await axios.get( `${process.env.db_url}/budget/${id}.json` )

        if (!BudgetExiste.data) {
            return NextResponse.json(
                { message: "Budget introuvable" },
                { status: 404 }
            )
        }

        //On SUPPRIME dans la db s'il existe
        const budget = await axios.delete(`${process.env.db_url}/budget/${id}.json`)

        return NextResponse.json({ message: "Budget supprimé" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}