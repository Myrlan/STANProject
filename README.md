# STANProject

## Analyser

B.
Jeu en 2D de type hack and slash en temp réel.
L'écran sera divisé en plusieurs cases qui composeront la carte, pour changer de scène le personage doit dépasser la bordure de la scène actuelle.
L'utilisateur sera enregistré sous forme d'un username et un mot de passe dans la base de données.
Toutes les images et textes sont stockés dans la base de données.
Utilisation de Cookies pour faciliter la reconnection de l'utilisateur.


C.
Affichage de la carte:
	* Charger toutes les images de jeu
	* Selectionner les images correspondantes à la scène
	* Placer les images

Codage des interactions:
	* Mouvements possibles de l'utilisateur
	* Mouvements des enemies
	* Propriétés des objects
	* Changement de scène

Animations:
	* Création des sprites
	* Changement des sprites en fonctions des actions

Interface utilisateur:
	* Menu de démarage
	* Menu d'option 
	* Informations visuelles
	* Interface de sauvegarde

Interaction avec la base de données:
	* Dépôt des images dans la base de données 
	* Recuperation des images coté client
	* Enregistrer les données clients (nom, mot de passe, avancé sur le jeu)



## Concevoir

Affichage de la carte: on attribut des images à chaque case (tuile) du tableau de la scène.

Mouvements possibles de l'utilisateur: on associe à chaque direction des axes de la scène une touche de direction, et un bouton associé à l'utilisation d'un objet.

Mouvements des enemies: on associe au monstre un programme de detection du joueur et un programme de déplacement et d'attaque.

Propriétés des objets: On associe à chaque objet une ou plusieurs fonctions selon son type.



## Planifier:

Phase 1: Initialization du site web

Phase 2: Créations des fonctionalités du site

Phase 3: Récuperation des données du serveur

Phase 4: Affichage des scènes

Phase 5: Création des algorithmes de mouvements

Phase 6: Associations des objects à leurs propriétés

Phase 7: Animation

Phase 8: Système de sauvegarde



## Definir un prototype initial:

Les éléments essentiel sont: une map, un enemie, le personnage, une arme.
Le test de base est d'avoir le personnage ramase l'arme et tue l'enemie, la carte peur être blanche et l'enemie imobile.
