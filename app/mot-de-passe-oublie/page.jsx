import MotDePasseOublie from '@/composants/MotDePasseOublie'
import React from 'react'

export const metadata = {
  title: "Mot de passe oublié — TopBudget",
  description: "Réinitialisez votre mot de passe TopBudget. Entrez votre adresse email pour recevoir les instructions de réinitialisation.",
}

function page() {
  return (
    <div>
      <MotDePasseOublie />
    </div>
  )
}

export default page
