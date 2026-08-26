"use client"
import React, { useState } from 'react'
import TableauBord from './TableauBord'

function TableauBordIntermd() {
  
    const [listeBudget, setListeBudget] = useState([])
    const [listeTransaction, setListeTransaction] = useState([])

    return (
    <div>
      <TableauBord listeBudget={listeBudget} setListeBudget={setListeBudget} listeTransaction={listeTransaction} setListeTransaction={setListeTransaction} />
    </div>
  )
}

export default TableauBordIntermd
