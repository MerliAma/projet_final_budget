import { OpenDataBase } from "./createdb.js"

export const DeleteToDB = (table, id, callback) => {
    
    //Testons si on est pas sur un navigateur
        if(typeof window === "undefined") {
                callback(false)
                return;
        }

    OpenDataBase((database) => {

        //Si on a une erreur ou la db n'est pas encore ouverte
        if (!database) {
            callback(false)
            return
        }

        //On créé une transaction (le type readwrite c'est soit pour modifier ou ajouter les data dans la db)
        const tx = database.transaction(table, 'readwrite')

        //On sauvegarde dans la db
        const store = tx.objectStore(table)
        const req = store.delete(id)

        req.onsuccess = function () {
            callback(true)
        }

        req.onerror = function () {
            callback(false)
        }
    })
}