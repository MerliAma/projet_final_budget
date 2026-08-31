import axios from "axios"
import { NextResponse } from "next/server"

export const DELETE = async (req, { params }) => {
    try {
        
        //On recupère le parametre id
        const { id } = await params 

        // On vérifie si le budget existe
        const transExiste = await axios.get( `${process.env.db_url}/transaction/${id}.json` )

        if (!transExiste.data) {
            return NextResponse.json(
                { message: "Transaction introuvable" },
                { status: 404 }
            )
        }

        //On SUPPRIME dans la db s'il existe
        const trans = await axios.delete(`${process.env.db_url}/transaction/${id}.json`)

        return NextResponse.json({ message: "Transaction supprimée" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}