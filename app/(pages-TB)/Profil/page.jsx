import ProfilInterm from '@/composants/ProfilInterm'
import React from 'react'

export const metadata = {
  title: "Mon Compte & Paramètres | TopBudget",
  description: "Gérez vos informations personnelles, la sécurité de votre compte et vos préférences sur TopBudget.",
}

export default function page() {
  return (
    <div className="w-full">
      <ProfilInterm />
    </div>
  )
}
