//"use client"
import AuthProvider from '@/composants/AuthProvider'
import React, { Children } from 'react'

function layout({children}) {
    
    //au départ je faisais la vérification de l'utilisateur connecté sur cette page...
    //const [InfosUser, setInfosUser] = useState(null)
   // const [etat, setEtat] = useState(null)//pr la déconnexion old ama

    /*const router=useRouter()
    useEffect(() => {
            const infos = RecupInfosUserConnecte()
            setInfosUser(infos)
            if(infos===null){
                setEtat(false)
                router.push("/")
            }
            else{
                setEtat(true)
            }
    }, [])*/

    /*useEffect(() => { //code deconnexion old pr Ama
        if(etat===false){
            //const router=useRouter()
            router.push("/")
            if(RecupInfosUserConnecte()){
                localStorage.removeItem("InfosUser")
            } 
            }
    }, [etat])*/

   


    return (
    <div>
        {/* Le composant AuthProvider permet de protéger les pages lié au backOffice de l'user */}
        <AuthProvider> 
            {children}    
        </AuthProvider>  
    </div>
  )
}

export default layout
