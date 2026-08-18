import { getDatabase, OpenDataBase } from "./createdb.js"

export const getAllDataTodatabase = (table, callback) => {

    //Testons si on est pas sur un navigateur
        if(typeof window === "undefined") {
                callback([])
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
        const getData = transaction.objectStore(table)
        const req = getData.getAll()

        //Si on a pu recupérer les data, on le stock dans le callback
        req.onsuccess = () => {
            console.log('Liste: ', req.result)
            callback(req.result)
        }

        req.onerror = (e) => {
            console.error('Erreur lors de la recupération des données: ', e)
            callback([])
        }
    })
}