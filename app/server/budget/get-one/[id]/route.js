import axios from "axios"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
    try {
        
        //On recupère le parametre id
        const { id } = await params 

        //On recupere le produit dans la db
        const budget = await axios.get(`${process.env.db_url}/budget/${id}.json`)

        return NextResponse.json({ budget: {id, ...budget.data} })

    } catch (error) {
       console.log(error)
               return NextResponse.json({message: "Une erreur s'est produite."})
    }
}