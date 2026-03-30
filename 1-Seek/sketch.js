let target
let maxSpeedSlider, maxForceSlider

function creerVehicules(nb) {
  let vehicles = [];
  for (let i = 0; i < nb; i++) {
    let x = random(width);
    let y = random(height);
    if (random() < 0.5) {
      vehicles.push(new SeekingVehicle(x, y));
    } else {
      vehicles.push(new FleeingVehicle(x, y));
    } 
  }
  return vehicles;
}


// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  // on crée un canvas de 800px par 800px
  createCanvas(windowWidth, windowHeight);

  // On crée 10 véhicules à des positions aléatoires dans le canvas
  vehicles = creerVehicules(10);

  // Sliders pour la vitesse max et la force max
  maxSpeedSlider = createSlider(1, 20, 4, 0.1);
  maxSpeedSlider.position(20, 20);
  maxSpeedSlider.style('width', '180px');

  maxForceSlider = createSlider(0.01, 1, 0.1, 0.01);
  maxForceSlider.position(20, 50);
  maxForceSlider.style('width', '180px');

  // TODO: créer un tableau de véhicules en global
  // ajouter nb vehicules au tableau dans une boucle
  // avec une position random dans le canvas

  // La cible est un vecteur avec une position aléatoire dans le canvas
  // dirigée par la souris ensuite dans draw()
  target = createVector(random(width), random(height));
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  // fond noir pour le canvas
  background("black");

  // Récupère les valeurs des sliders et les applique aux véhicules
  let maxSpeed = maxSpeedSlider.value();
  let maxForce = maxForceSlider.value();
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].maxSpeed = maxSpeed;
    vehicles[i].maxForce = maxForce;
  }

  // Affiche les valeurs des sliders à l'écran
  noStroke();
  fill(255);
  textSize(14);
  text(`Max Speed : ${maxSpeed.toFixed(1)}`, 220, 35);
  text(`Max Force : ${maxForce.toFixed(2)}`, 220, 65);

  // A partir de maintenant toutes les formes pleines seront en rouge
  fill("red");
  // pas de contours pour les formes.
  noStroke();

  // mouseX et mouseY sont des variables globales de p5.js, elles correspondent à la position de la souris
  // on les stocke dans un vecteur pour pouvoir les utiliser avec la méthode seek (un peu plus loin)
  // du vehicule
  target.x = mouseX;
  target.y = mouseY;

  // Dessine un cercle de rayon 32px à la position de la souris
  // la couleur de remplissage est rouge car on a appelé fill(255, 0, 0) plus haut
  // pas de contours car on a appelé noStroke() plus haut
  circle(target.x, target.y, 32);

  // je déplace et dessine les véhicules
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].applyBehaviors(target);
    vehicles[i].edges()
    vehicles[i].update();
    vehicles[i].show();
  }

}
