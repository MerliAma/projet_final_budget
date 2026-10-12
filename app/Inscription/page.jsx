import S_Inscrire from '@/composants/S_Inscrire'
import React from 'react'

export const metadata = {
  title: "Créer un compte — TopBudget",
  description: "Inscrivez-vous sur TopBudget pour commencer à gérer vos budgets personnels et suivre vos dépenses simplement.",
}

function page() {
  return (
    <div>
      <S_Inscrire />
    </div>
  )
}

export default page
