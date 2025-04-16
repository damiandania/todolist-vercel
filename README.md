## Installation
1. Cloner le dépôt :
`git clone https://github.com/damiandania/todolist.git`

2. Se placer dans le dossier :
`cd todolist`

3. Installer les dépendances :
`npm install`

4. Démarrer le serveur :
`npm start`

5. Ouvrir `http://localhost:3000` dans un navigateur.
## Structure du projet

```
public/
├── assets/
│   ├── images/
│   │   ├── dark_background.png
│   │   ├── light_background.png
│   │   └── favicon.svg
│   └── css/
│       └── styles.css
├── js/
│   ├── darkMode.js
│   ├── filter.js
│   ├── notifications.js
│   ├── script.js
│   └── sort.js
├── errors/
│   ├── 400.html
│   └── 404.html
└── index.html
server.js       # API Node.js/Express
package.json    # Dépendances
```

## API Endpoints

Voici les endpoints disponibles pour l'API :

| Méthode | URL          | Description                          |
|---------|--------------|--------------------------------------|
| **GET** | `/tasks`     | Récupérer la liste de toutes les tâches. |
| **POST**| `/tasks`     | Ajouter une nouvelle tâche.          |
| **PUT** | `/tasks/:id` | Modifier une tâche existante.        |
| **PATCH** | `/tasks/:id` | Mettre à jour partiellement une tâche. |
| **DELETE** | `/tasks/:id` | Supprimer une tâche.                |

---

### Détails des Endpoints

#### **GET /tasks**
- **Description** : Récupère toutes les tâches.
- **Exemple de requête** :
  ```bash
  curl -X GET http://localhost:3000/tasks

## Fonctionnalités principales

1. **Ajout de tâches**
   - Les utilisateurs peuvent ajouter une nouvelle tâche via le champ de saisie et le bouton "Ajouter" ou en appuyant sur la touche "Entrée".
   - Une notification Toastify s'affiche pour confirmer l'ajout.

2. **Filtrage des tâches**
   - Trois filtres sont disponibles :
     - **Toutes** : Affiche toutes les tâches.
     - **En cours** : Affiche uniquement les tâches non terminées.
     - **Terminées** : Affiche uniquement les tâches terminées.

3. **Tri des tâches**
   - Les tâches peuvent être triées selon trois critères :
     - **Date** : Par ordre de création.
     - **Alphabétique** : Par ordre alphabétique.
     - **Statut** : Les tâches terminées apparaissent en bas.

4. **Mode sombre**
   - Les utilisateurs peuvent basculer entre le mode clair et le mode sombre.
   - Le mode sélectionné est sauvegardé dans le localStorage et restauré au rechargement de la page.

5. **Modification et suppression**
   - Double-cliquez sur une tâche pour modifier son nom.
   - Cliquez sur l'icône de la corbeille pour supprimer une tâche.

---

## Gestion des erreurs

1. **Erreur 400** :
   - Si une tâche est ajoutée sans nom valide, une page d'erreur personnalisée `400.html` est affichée.

2. **Erreur 404** :
   - Si une ressource ou une page est introuvable, une page d'erreur personnalisée `404.html` est affichée.

---

## Notes techniques

- **Framework utilisé** : Express.js pour le backend.
- **Notifications** : Toastify.js pour les notifications utilisateur.
- **Mode sombre** : Géré via des variables CSS et localStorage.
- **Tri et filtres** : Implémentés en JavaScript côté client.
