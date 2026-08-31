import axios from "axios";
import { NextResponse } from "next/server"

export const PATCH = async (req, { params }) => {
    try {

        //On recupère les infos du frontend
       const { descriptionTrans, montantTrans} = await req.json()

       //On recupère le parametre id
        const { id } = await params 

        if(!id || id === "") return NextResponse.json({message: "Selectionner unne transaction"});

        // On vérifie si le budget existe
        const transExiste = await axios.get( `${process.env.db_url}/transaction/${id}.json` )

        if (!transExiste.data) {
            return NextResponse.json(
                { message: "Transaction introuvable" },
                { status: 404 }
            )
        }


        const trans = await axios.patch(`${process.env.db_url}/transaction/${id}.json`,{ descriptionTrans, montantTrans} )

        return NextResponse.json({message: "Modification effectuée" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite !"})
    }
}