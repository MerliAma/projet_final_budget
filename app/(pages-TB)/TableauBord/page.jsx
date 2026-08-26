import TableauBordIntermd from '@/composants/TableauBordIntermd';
import React from 'react'

export const metadata = {
  title: "Tableau de Bord",
  description: "Tableau de Bord Utilisateur",
};

function page() {
    return (
        <div>
            <TableauBordIntermd />
        </div>
    )
}

export default page
