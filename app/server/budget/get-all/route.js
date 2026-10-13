import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les budgets de la db 
export const GET = async (req) => {
    try {
        const cleanUrl = (process.env.db_url || "").replace(/\/+$/, "")
        const budget = await axios.get(`${cleanUrl}/budget.json?auth=${process.env.db_secret}`) 
        
        if (!budget?.data) {
            return NextResponse.json({ budgets: [] })
        }

        //On convertie l'objet json retourné en tableau js 
        const data = Object.entries(budget.data).map(([id, data]) => ({ id, ...data })) //retourne avec les id

        return NextResponse.json({budgets: data}) //retourne le tableau de tous les budgets
        
    } catch (error) {
        console.error("Erreur Firebase budget get-all:", error?.response?.status, error?.response?.data || error?.message)
        const isPermissionDenied = error?.response?.status === 401 || error?.response?.data?.error === "Permission denied"
        return NextResponse.json({
            message: isPermissionDenied
                ? "Accès refusé par Firebase (Permission denied) : les règles de sécurité de votre Realtime Database bloquent la lecture (.read). Veuillez autoriser la lecture dans la console Firebase."
                : "Une erreur s'est produite lors de la récupération des budgets.",
            error: error?.response?.data || error?.message
        }, { status: error?.response?.status || 500 })
    }
}