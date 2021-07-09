export const mediation = {
    'grid-strat': {
        step1: { // battue
            text: "Si on a un nombre de gendarme égal à une largeur de la grille, on peut alors former un mur qui va contraindre le voleur à se retrouver coincé sur un bord de la grille.<br><br>Cependant, il est possible d'optimiser la stratégie.",
            img: 'assets/mediation/classic_beat.gif'
        },
        step2: { // Battue minimisé
            text: "Si on a un nombre de gendarme égal à la moitié de la largeur de la grille, on peut tout de même appliquer un stratégie similaire à la stratégie précédente afin de gagner. En effet, même si le mur formé par les gendarmes est \"troué\", le voleur va quand même devoir reculer jusqu'au bord de la grille. Et si ce dernier, essaie de passer dans un des trous du mur, alors un des gendarmes peut monter ou descendre afin de l'arrêter.<br><br>Même si cette stratégie est plus optimisé que la précédente, elle reste encore très loin d'être optimale notamment pour les très grandes grille.",
            img: 'assets/mediation/upgrade_beat.gif'
        },
        step3: { // Blocage de tous les mouvements
            text: "En ayant seulement 4 gendarmes, on peut finir par bloquer tous les mouvements possibles du voleur. En effet sur une grille un voleur va, au plus, avoir 4 sommets atteignable. Si on poste les gendarmes sur les sommets atteignable par le voleur alors ce dernier sera immobilisé ainsi au tour suivant un des gendarmes pourra arrêter le voleur.<br><br>Bien que cette stratégie soit nettement meilleur que les précédentes (avec cette stratégie on arrive à gagner quelque soit la taille de la grille avec 4 gendarmes), il est encore possible de l'améliorer.",
            img: 'assets/mediation/blocking.gif'
        },
        step4: { // Strat opti
            text: "On peut sur une grille, et ceux quelque soit sa taille, gagner avec seulement 2 gendarmes. En effet, il suffit pour cela que l'un des gendarme contrôle la ligne sur laquelle se trouve le voleur tandis que l'autre gendarme contrôle la colonne sur laquelle se trouve le voleur. Pour \"contrôler\" la ligne (respectivement la colonne) du voleur, il faut que le gendarme commence par se placer sur la ligne (respectivement la colonne) sur laquelle est le voleur, puis s'il est déjà sur cette dernière alors il rapproche du voleur.",
            img: 'assets/mediation/control.gif'
        },
        step5: { // Vitesse 2
            text: "Bien que l'ordinateur ait joué avec la stratégie optimale sur une grille, le voleur a pu gagner. Cela est du au fait qu'une stratégie est \"optimale\" dans une configuration de graphe donnée. La stratégie optimale que vous avez apprise dans ce monde, est optimale sur les grilles avec un voleur ayant une vitesse (nombre de sommet qu'il peut parcourir en 1 tour) de 1. Si on change le type de graphe ou la vitesse du voleur la stratégie optimale change aussi.<br><br>Pensez-vous pouvoir trouver la stratégie optimal pour des grilles avec un voleur à vitesse 2 ?",
            img: undefined
        }
    }
}