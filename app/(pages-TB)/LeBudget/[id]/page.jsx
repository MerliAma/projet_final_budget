import LeBudgetIntermd from '@/composants/LeBudgetIntermd';
import React from 'react'

export const metadata = {
  title: "Détails Budget",
  description: "Informations sur le Budget selectionné",
};


const page = async({params}) =>{
  
  const idBudget=await params
  
  
  return (
    <div>
      <h3 className="font-bold m-3" >Détails Budget</h3>

      <LeBudgetIntermd idBudget={idBudget.id} />
    </div>
  )
}

export default page
