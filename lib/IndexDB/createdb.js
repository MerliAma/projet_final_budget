let dabase;  //variable pour manipuler la base de données

export const OpenDataBase = (callback) => {

    //Testons si on est pas sur un navigateur
    if(typeof window === "undefined") {
        callback(null)
        return;
    }


    // si la DB est déjà ouverte, on appelle immédiatement le callback
    if (dabase) {
        callback(dabase)
        return
    }
    
    const req = indexedDB.open("BudgetDB", 2)

    //On créé les tables
    req.onupgradeneeded = (e) => {
        dabase = e.target.result

        let store;

        //Table Utilisateurs
         if (!dabase.objectStoreNames.contains("users")) {
            store = dabase.createObjectStore("users", {
                keyPath: "id",
                autoIncrement: true
            })
            //Creons des index de recherche
            store.createIndex("email", "email", {
                unique: true //Deux user ne peuvent pas avoir la mm adresse email
            })
            store.createIndex("login", "login", {
                unique: true //Deux user ne peuvent pas avoir le mm login
            })
        }

        //Table budget
         if (!dabase.objectStoreNames.contains("budget")) {
            store = dabase.createObjectStore("budget", {
                keyPath: "id",
                autoIncrement: true
            })
            //Creons des index de recherche - l'id du de l'user
            store.createIndex("idUser", "idUser", {
                unique: false
            })
        }

        //Table transaction
         if (!dabase.objectStoreNames.contains("transaction")) {
            store = dabase.createObjectStore("transaction", {
                keyPath: "id",
                autoIncrement: true
            })
            //Creons des index de recherche - l'id du budget
            store.createIndex("budgetTrans", "budgetTrans", {
                unique: false
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
