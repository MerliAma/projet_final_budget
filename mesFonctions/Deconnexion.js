"use client"
import React from 'react'
import { RecupInfosUserConnecte } from './RecupInfosUserConnecte'
import { useRouter } from 'next/navigation'

export const Deconnexion=(etat)=> {
  
    if(etat===true){
    const router=useRouter()
    router.push("/connexion")
    if(RecupInfosUserConnecte()){
        localStorage.removeItem("InfosUser")
    } 
    }
}
