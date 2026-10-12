"use client"
import React from 'react'
import Profil from './Profil'

/**
 * ProfilInterm — Composant intermédiaire pour la page Profil
 * Encapsule le composant Profil sans surcharge visuelle superflue.
 */
export default function ProfilInterm() {
  return (
    <div className="w-full">
      <Profil />
    </div>
  )
}
