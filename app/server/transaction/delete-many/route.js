import axios from "axios"
import { NextResponse } from "next/server"

//Pour recuperer tous les budgets de la db 
export const DELETE = async (req) => {
    try {
        const { ids } = await req.json()
        if (!Array.isArray(ids)) {
            return NextResponse.json(
                { message: "Les identifiants sont invalides" },
                { status: 400 }
            )
        }

        const updates = {}
       
        ids.forEach((id) => {
            updates[`transaction/${id}`] = null // updates[`transaction/${id}`] signifie: « utilise la valeur contenue dans cette expression comme nom de propriété de l'objet ».
        });
    
        await axios.patch(`${process.env.db_url}/.json`,updates );

        return NextResponse.json({message: "sup"});
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Une erreur s'est produite."})
    }
}