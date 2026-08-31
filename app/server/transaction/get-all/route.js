import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les budgets de la db 
export const GET = async (req) => {
    try {
        
        const trans = await axios.get(`${process.env.db_url}/transaction.json`) 
        
        //On convertie l'objet json retourné en tableau js 
        const data = Object.entries(trans?.data).map(([id, data]) => ({ id, ...data })) //retourne avec les id
        
        //const data2 = Object.values(produits.data) //retourne sans id

        return NextResponse.json({transactions: data}) //retourne le tableau de toutes les transactions
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}