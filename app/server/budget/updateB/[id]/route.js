import axios from "axios";
import { NextResponse } from "next/server"

export const PATCH = async (req, { params }) => {
    try {

        //On recupère les infos du frontend
       const {  descriptionBud, montantBud, moisBud } = await req.json()

       //On recupère le parametre id
        const { id } = await params 

        if(!id || id === "") return NextResponse.json({message: "Selectionner un Budget"});

        // On vérifie si le budget existe
        const budgetExiste = await axios.get( `${process.env.db_url}/budget/${id}.json` )

        if (!budgetExiste.data) {
            return NextResponse.json(
                { message: "Budget introuvable" },
                { status: 404 }
            )
        }


        const budget = await axios.patch(`${process.env.db_url}/budget/${id}.json`,{  descriptionBud, montantBud, moisBud } )

        return NextResponse.json({message: "Modification effectuée" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite !"})
    }
}