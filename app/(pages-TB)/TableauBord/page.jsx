import TableauBord from '@/composants/TableauBord';
import React from 'react'

export const metadata = {
  title: "Tableau de Bord",
  description: "Tableau de Bord Utilisateur",
};

function page() {
    return (
        <div>
            <TableauBord />
        </div>
    )
}

export default page
