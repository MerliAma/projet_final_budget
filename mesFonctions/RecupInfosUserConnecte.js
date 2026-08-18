
export const RecupInfosUserConnecte = () => {
  //if (typeof window === "undefined") return
    const InfosUser=JSON.parse(localStorage.getItem("InfosUser"))
  return InfosUser
}



