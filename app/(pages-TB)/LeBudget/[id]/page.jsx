import LeBudgetIntermd from '@/composants/LeBudgetIntermd';
import Link from 'next/link';
import React from 'react'
import { BsArrowRight } from 'react-icons/bs';

export const metadata = {
  title: "Détails Budget",
  description: "Informations sur le Budget selectionné",
};


const page = async({params}) =>{
  
  const idBudget=await params
  //console.log(idBudget.id)
  
  return (
    <>
      <div className='flex flex-col-reverse md:flex-row items-center gap-15 md:justify-between my-5'>
        <h3 className="font-bold m-3">Détails du Budget</h3>
        <Link href={"/Budget"} className='badge badge-md lg:badge-lg bg-teal-900 text-white'>Retour à la liste des Budgets <BsArrowRight />  </Link>
      </div>
      <LeBudgetIntermd idBudget={idBudget.id} />
    </>
  )
}

export default page
