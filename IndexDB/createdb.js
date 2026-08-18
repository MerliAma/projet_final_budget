
let dabase;  //variable pour manipuler la base de données

export const OpenDataBase = (callback)=> {

    // si la DB est déjà ouverte, on appelle immédiatement le callback
    if (dabase) {
        callback(dabase)
        return
    }
    
    const req = indexedDB.open("DbBudget", 1)

    //On créé les tables
    req.onupgradeneeded = (e) => {
        dabase = e.target.result

        //Table Utilisateurs
         if (!dabase.objectStoreNames.contains("users")) {
            const store = dabase.createObjectStore("users", {
                keyPath: "id",
                autoIncrement: true
            })
            //Creons des index de recherche
            store.createIndex("email", "email", {
                unique: true //Deux user ne peuvent pas avoir la mm adresse email
            })
        }

        //Table budget
         if (!dabase.objectStoreNames.contains("budget")) {
            dabase.createObjectStore("budget", {
                keyPath: "id",
                autoIncrement: true
            })
        }

        //Table transaction
         if (!dabase.objectStoreNames.contains("transaction")) {
            dabase.createObjectStore("transaction", {
                keyPath: "id",
                autoIncrement: true
            })
        }
    }
    //On verifie que tous c'est bien passé
    req.onsuccess = (e) => {
        dabase = e.target.result
        callback(dabase)
    }

    req.onerror = (e) => {
        console.error('Erreur de connexion à la db', e)
        callback(null)
    }
}

//Pour utiliser la base de données partout dans l'appli
export const getDatabase = () => {
    return dabase;
}