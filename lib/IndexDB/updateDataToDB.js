import { OpenDataBase } from "./createdb.js"

// Modifier un produit dans la table. callback(true) si succès, callback(false) si erreur.
export const UpdateTodatabase = (table, id, data, callback) => {

        //Testons si on est pas sur un navigateur
        if (typeof window === "undefined") {
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

                //On recupère d'abord tous les champs de la données
                const request = store.get(id)

                request.onsuccess = () => {

                        const element = request.result //On stock la données brut d'abord (pour conserver tous les champs)
                        console.log("resultat", request.result)

                        //Si la donnée n'a pas été trouvé
                        if (!element) {
                                callback(false)
                                return;
                        }

                        //On procede à la modification
                        const objet = { ...element, ...data }
                        store.put(objet)
                        callback(true)

                }

        })
}

