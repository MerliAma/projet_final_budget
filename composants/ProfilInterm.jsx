import React from 'react'
import Profil from './Profil'

function ProfilInterm() {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-10" >Mon Profil</h3>
      {/* appel du composant pr le Profil */}
      <Profil/>
    </div>
  )
}

export default ProfilInterm
