import { OpenDataBase } from "./createdb.js"

//Pour recupérer un seul élément dans la base de données (critere est un objet {champ, valeur})
export const getOneDataTodatabase = (table, critere, callback) => {

    //Testons si on est pas sur un navigateur
    if (typeof window === "undefined") {
        callback(false)
        return;
    }

    // OpenDataBase utilisera le callback une fois la database prête
    OpenDataBase((database) => {

        if (!database) {
            console.error('DB non disponible')
            callback([]) //On retourne un tableau vide car la db a généré une erreur
            return
        }

        //On créé la transaction pour la lecture seule
        const transaction = database.transaction(table, "readonly")

        //On recupère toutes les données de la table
        const store = transaction.objectStore(table)


        //On créé d'abord la requette
        let request;

        if (critere.champ === "id") {
            //On recherche par l'id de la donnée
            request = store.get(critere.valeur)
        } else {
            //const index = (critere.type === "email") ? store.index("email") : store.index("tel")
            const champ = store.index(critere.champ)
            request = champ.get(critere.valeur)
        }

        //Si on a pu recupérer les data, on le stock dans le callback
        request.onsuccess = () => {
            console.log(request)
            callback(request.result)
        }

        request.onerror = (e) => {
            console.error('Erreur lors de la recupération des données: ', e)
            callback([])
        }
    })
}