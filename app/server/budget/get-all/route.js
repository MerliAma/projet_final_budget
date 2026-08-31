import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les budgets de la db 
export const GET = async (req) => {
    try {
        
        const budget = await axios.get(`${process.env.db_url}/budget.json`) 
        
        //On convertie l'objet json retourné en tableau js 
        const data = Object.entries(budget?.data).map(([id, data]) => ({ id, ...data })) //retourne avec les id
        
        //const data2 = Object.values(produits.data) //retourne sans id

        return NextResponse.json({budgets: data}) //retourne le tableau de tous les budgets
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}