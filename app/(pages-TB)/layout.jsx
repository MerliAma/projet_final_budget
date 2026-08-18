"use client"
import { Deconnexion } from '@/mesFonctions/Deconnexion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Children } from 'react'
import { useEffect, useState } from 'react'
import { LuArrowLeftRight, LuHouse, LuList, LuLogOut, LuPiggyBank, LuUser } from 'react-icons/lu'

function layout({children}) {
    const [InfosUser, setInfosUser] = useState(null)

    const [etat, setEtat] = useState(null)//pr la déconnexion

    useEffect(() => {
            const infos = localStorage.getItem("InfosUser")
            setInfosUser(infos ? JSON.parse(infos) : null)
            setEtat(true)
    }, [])

    /*useEffect(() => {
        if(etat===false){
            const router=useRouter()
            router.push("/")
            if(RecupInfosUserConnecte()){
                localStorage.removeItem("InfosUser")
            } 
            }
    }, [etat])*/

    return (
    <div>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle inline" />
                <div className="drawer-content">
                    {/* Navbar */}
                    <nav className="navbar w-full bg-teal-900">
                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button group">
                            {/* Sidebar toggle icon */}
                            
                        <LuList className='text-white hover:text-black group-hover:text-black' />
                        </label>
                        {}
                        <div className="px-4 text-white">Bienvenue, {InfosUser?.nomUser || "Utilisateur"} </div>
                    </nav>
                    {/* Page content here */}
                       
                    {children}
        
                </div>

                <div className="drawer-side is-drawer-close:overflow-visible">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                        
                        {/* Sidebar content here */}
                        <ul className="menu w-full grow">

                            <li className="shadow-md is-drawer-close:shadow-none is-drawer-close:bg-base-200 mb-3 bg-teal-900 -mt-2 ">
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="">
                                    <i className="bi bi-wallet2 text-center text-2xl text-white is-drawer-close:text-teal-900"> </i>
                                    <span className="is-drawer-close:hidden text-center text-2xl pt-2 pb-3 text-white font-bold"> - <i>T</i>op<i>B</i>udget -</span>
                                </button>
                            </li>

                            {/* List item <BiWallet2 />*/}
                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="TableauBord">
                                    {/* Home icon<BsFillHouseDoorFill /> */}
                                    <Link href="/TableauBord">
                                        <div className='flex items-center gap-2 '>
                                            <LuHouse className=' text-lg' />
                                            <span className="is-drawer-close:hidden ms-2">Tableau de Bord</span>
                                        </div>
                                    </Link>
                                </button>
                            </li>

                            {/* List item */}
                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Budget">
                                    {/* Settings icon */}
                                    <Link href="/Budget">
                                        <div className='flex items-center gap-2 '>
                                            <LuPiggyBank className=' text-lg' />
                                            <span className="is-drawer-close:hidden ms-2">Mes Budgets</span>
                                        </div>
                                    </Link>
                                </button>
                            </li>

                            {/* List item */}
                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Transaction">
                                    {/* Settings icon */}
                                    
                                    <Link href="/Transaction">
                                        <div className='flex items-center gap-2 '>
                                            <LuArrowLeftRight className=' text-lg' />
                                            <span className="is-drawer-close:hidden ms-2">Mes Transactions</span>
                                        </div>
                                    </Link>
                                </button>
                            </li>
                        </ul>

                        
                        <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right ms-5 flex items-center gap-3 cursor-pointer mb-5">
                            <LuUser />
                            <span className="is-drawer-close:hidden" >Mon Compte</span>
                        </button>
                        <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right text-red-600 ms-5 flex items-center gap-3 cursor-pointer mb-5">
                            <LuLogOut />
                            <span className="is-drawer-close:hidden" onClick={() => setEtat(false)} >Se Deconnecter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default layout
