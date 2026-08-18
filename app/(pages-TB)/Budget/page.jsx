import BudgetIntermd from '@/composants/BudgetIntermd'
import React from 'react'

export const metadata = {
  title: "Mes Budgets",
  description: "Gestion Budget",
};


function page() {
  //const [listeBudget, setListeBudget]=useState([])
  /*if(!RecupInfosUserConnecte()) {
    useRouter().push("/")
  }*/

  return (
    <div className="p-4">
      <BudgetIntermd />
    </div>
  )
}

export default page
