import ProfilInterm from '@/composants/ProfilInterm'
import React from 'react'

export const metadata = {
  title: "Mon Compte",
  description: "Profil Utilisateur",
};


function page() {
  return (
    <div className="p-4">
      <ProfilInterm />
    </div>
  )
}

export default page
