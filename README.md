# PATUREAU Romain IA2 - Steering Behaviours
La totalité du README.md a été écrit personnellement. En revanche je vais peut-etre utiliser un correcteur de grammaire. J'espère que vous ne déduirez pas de points la dessus 🙏.
<br><br>
Projet deployé : https://rainbowgamer333.github.io/SteeringBehavioursM2IA2_2025_2026/
<br>
IDE : Visual Studio Code
<br>
Mode debug : Appuyez sur "d"


##  Dungeon Escape
**Vous** (cercle vert) êtes placés à la **case de départ** (case verte) d'un donjon. Dans ce donjon, plusieurs **gardes** effectuent des patrouilles. Si vous arrivés dans le champ de vision d'un garde, il va essayer de vous **attraper**. Il est plus rapide que vous, mais pas très intelligent. Si vous sortez de son champ de vision, il va vous perdre et va continuer dans son chemin. Votre objectif est d'arriver à la **case de sortie** (case rouge) sans se faire attrapé par les gardes.

## Steering Behaviours
**Joueur :**
- **Seek** sur la souris

**Garde :**
- **Pseudo-Wander**
  - Une cible est généré à une case ouverte adjacente au garde.
  - Le garde réalise un **Seek** sur cette cible
  - Une fois suffisamment proche, la cible change de case, encore adjacente et évitant la case précédente si possible.
- **Seek** sur le joueur

## IAs utilisés
Claude version web (Sonnet 4.6) :
- Génération d'algorithmes non pertinents au cours (algorithme de génération du labyrinthe, ray tracing pour le champ de vision des gardes, etc...)
- Génération du fichier `deploy.yml` pour deployer depuis un dossier intérieur du répositoire

Copilot :
- Résolution de bugs

## Difficultés rencontrés
La gestion de la collision avec les murs étaient une étape complèxe, qui nécessitait l'analyse de quand un véhicule passe à la case suivante, ainsi que d'appliquer les bonnes forces pour qu'il soit "repoussé" par le mur.
<br>
De plus, le règlage des coefficients pour chaque force était un petit défi, afin qu'à la fois les véhicules évitent de passer à travers les murs, mais aussi de rendre le jeu agréable.

## Mon experience
En écoutant les cours sur les Steering Behaviours, je me suis mis a penser à un jeu de mon enfance : *The Legend of Zelda: Phantom Hourglass* et comment les phantomes dans un des donjons effectuaient des patrouilles autour d'une salle. Si le joueur est repéré, les guardes le poursuivent et l'attaquent. Je me suis même fait la blague que les gardes utilisaient le comportement **seek** sur le joueur. J'ai donc décidé de développer ce jeu pour recréer cette experience.