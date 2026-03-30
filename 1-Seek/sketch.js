let target
let maxSpeedSlider, maxForceSlider

function creerVehicules(nb) {
  let vehicles = [];
  for (let i = 0; i < nb; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new SeekingVehicle(x, y));
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

  // La cible est un objet Target initialisé aléatoirement dans le canvas
  target = new Target(random(width), random(height));
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  // fond noir pour le canvas
  background("black");

  // Récupère les valeurs des sliders et les applique aux véhicules
  let maxSpeed = maxSpeedSlider.value();
  let maxForce = maxForceSlider.value();
  for (let vehicle of vehicles) {
    vehicle.maxSpeed = maxSpeed;
    vehicle.maxForce = maxForce;
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

  // Met à jour et dessine la cible auto-mobile
  target.update();
  target.edges();
  target.show();

  // je déplace et dessine les véhicules
  for (let vehicle of vehicles) {
    vehicle.applyBehaviors(target.pos);
    vehicle.edges();
    vehicle.update();
    vehicle.show();

    if (vehicle.pos.dist(target.pos) < 20) {
      // Si le véhicule est proche de la cible, on le téléporte à une position aléatoire
      vehicle.pos = createVector(random(width), random(height));
      vehicle.vel = createVector(0, 0);
    }
  }
}
