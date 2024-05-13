const fs = require('fs');                           // module "file system", permet de manipuler les fichiers
const readline = require('readline');               // lit les entrées utilisateur depuis le terminal 
const fichierToDo = 'todoList.json';                // mon fichier JSON
const UserInterface = readline.createInterface({    // création d'une ui
    input: process.stdin,
    output: process.stdout
});

function chargerToDoList() {                        
    try {                                           // démarre un bloc d'essai pour gérer les erreurs potentielles.
        const data = fs.readFileSync(fichierToDo);  // constante : recup les données 
        return JSON.parse(data);                    // convertit les données JSON en objet JavaScript avec JSON.parse() et les renvoie
    } catch (error) {                               // si erreur, execute la suite : 
        return [];                                  // retourne array vide
    }
};

function sauvegarderToDoList(tasksList) {
    fs.writeFileSync(fichierToDo, JSON.stringify(tasksList, 2));        // écrit les données de tasksList dans fichierToDo
}                                                                       // null, 2 : formater le JSON avec une indentation de 2 espaces pour + lisibilité

function showTodolist(tasksList) {
    console.log("à faire :");                                           // affiche un titre pour la liste des tâches
    if (tasksList.length === 0) {                                       // vérifie si la liste des tâches est vide
        console.log("Liste vide");
    } else {
        tasksList.forEach(tache => {                                    // parcourt les taches
            if (!tache.termine) {                                       // si tache pas terminée
                console.log(`${tache.id}. ${tache.titre}`);             // affiche l'ID et le titre de la tache
            }
        });
    }
};

function addTask(tasksList, titre) {                                    
    var newTask = {                                                     // crée un nouvel objet, ici la tache
        id: tasksList.length + 1,
        titre: titre,
        termine: false
    };
    tasksList.push(newTask);                                            //ajoute la tache dans la liste
    sauvegarderToDoList(tasksList);
    console.log(`La tâche "${titre}" a été ajoutée.`);
}

function modifTask(tasksList, taskId, newTitle) {
    const taskIndex = tasksList.findIndex(task => task.id === taskId);  
    if (taskIndex !== -1) {                                             //Recherche de l'index de la tâche à modifier
        tasksList[taskIndex].titre = newTitle;                          // maj du titre avec le nouveau
        sauvegarderToDoList(tasksList);
        console.log(`Tâche ${taskId} modifiée : ${newTitle}`);          //${titre} insère la valeur de `titre` dans la chaîne
    } else {
        console.log("Tâche non trouvée.");
    }
    main();
};

function taskDone(tasksList, taskId) {
    const taskIndex = tasksList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasksList[taskIndex].termine = true;
        sauvegarderToDoList(tasksList);
        console.log('Tâche terminée :', tasksList[taskIndex].titre);
    } else {
        console.log('Indice de tâche invalide');
    }
};


function main() {
    const tasksList = chargerToDoList();

    UserInterface.question("Que souhaitez-vous faire? ([a]-ajouter / [b]-liste / [c]-modifier / [d]-quitter): ", (action) => {
        switch (action) {
            case "a":
                UserInterface.question("Nouvelle tache: ", (titre) => {
                    addTask(tasksList, titre);
                    main();
                });
                break;

            case "b":
                showTodolist(tasksList);
                main();
                break;

            case "c":
                UserInterface.question("Id de la tâche à modifier : ", (id) => {
                    UserInterface.question("Que souhaitez-vous modifier? ([1]-le titre / [2]-l'état de la tâche / [3]-quitter): ", (action) => {
                        switch (action) {
                            case "1":
                                UserInterface.question("Nouveau titre de la tâche : ", (titre) => {
                                    modifTask(tasksList, parseInt(id), titre); // Convertit l'ID en nombre entier
                                    main();
                                });
                                break;
            
                            case "2":
                                UserInterface.question("Avez-vous terminé cette tâche? [y]/[n]) : ", (termine) => {
                                    if (termine === "y") {
                                        taskDone(tasksList, parseInt(id));
                                        console.log(`Statut de la tâche ${id} modifié comme faite, retour au menu principal.`);
                                        main();
                                    } else if (termine === "n") {
                                        console.log(`Statut de la tâche ${id} non modifié, retour au menu principal.`);
                                        main();
                                    } else {
                                        console.log("Choix invalide, retour au menu principal.");
                                        main();
                                    }
                                });
                                break;
            
                            case "3":
                                console.log("retour au menu principal");
                                main();
                                break;
                            
                            default:
                                console.log("Choix invalide, retour au menu principal.");
                                main();
                                break;
                        }
                    });
                });
                break;


        case "d":
            UserInterface.close();
            break;

        default:
            console.log("Je n'ai pas compris votre demande.");
            main();
            break;
    }
});
}

main();
