import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les budgets de la db 
export const GET = async (req) => {
    try {
        const cleanUrl = (process.env.db_url || "").replace(/\/+$/, "")
        const trans = await axios.get(`${cleanUrl}/transaction.json`) 
        
        if (!trans?.data) {
            return NextResponse.json({ transactions: [] })
        }

        //On convertie l'objet json retourné en tableau js 
        const data = Object.entries(trans.data).map(([id, data]) => ({ id, ...data })) //retourne avec les id

        return NextResponse.json({transactions: data}) //retourne le tableau de toutes les transactions
        
    } catch (error) {
        console.error("Erreur Firebase transaction get-all:", error?.response?.status, error?.response?.data || error?.message)
        const isPermissionDenied = error?.response?.status === 401 || error?.response?.data?.error === "Permission denied"
        return NextResponse.json({
            message: isPermissionDenied
                ? "Accès refusé par Firebase (Permission denied) : les règles de sécurité de votre Realtime Database bloquent la lecture (.read). Veuillez autoriser la lecture dans la console Firebase."
                : "Une erreur s'est produite lors de la récupération des transactions.",
            error: error?.response?.data || error?.message
        }, { status: error?.response?.status || 500 })
    }
}