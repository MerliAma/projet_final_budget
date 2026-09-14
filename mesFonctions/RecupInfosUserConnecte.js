
/*export const RecupInfosUserConnecte = () => {
  //if (typeof window === "undefined") return
    const InfosUser=JSON.parse(localStorage.getItem("InfosUser"))
  return InfosUser
}*/
export const RecupInfosUserConnecte = () => {
  if (typeof window === "undefined") return null;

  const item = localStorage.getItem("InfosUser");
  return item ? JSON.parse(item) : null;
};


