import React from 'react'

export const metadata = {
  title: "Tableau de Bord",
  description: "Tableau de Bord Utilisateur",
};

function page() {
    return (
        <div className="p-4">
            <div className='flex flex-col-reverse md:flex-row items-center gap-15 md:justify-between my-5'>
                <h3 className="font-bold m-3">Mes 10 dernières transactions</h3>
                <button className='btn bg-teal-900 text-white'>Nouveau Budget <i className="bi bi-plus-lg"></i></button>
            </div>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Montant</th>
                            <th>Budget Int.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr>
                            <th>1</th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {/* Etiquettes */}
            <div className="grid grid-cols-3 gap-5 my-10">
                <div className="card bg-base-100 card-lg shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">0 FCFA</h2>
                        <p>Montant Total alloué</p>
                    </div>
                </div>

                <div className="card bg-base-100 card-lg shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">0 FCFA</h2>
                        <p>Total des Transactions</p>
                    </div>
                </div>

                <div className="card bg-base-100 card-lg shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">0 %</h2>
                        <p>Taux de Réussite</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
