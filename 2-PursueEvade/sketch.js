let pursuer;
let targets = [];
let sliderVitesseMaxCible;

function createTargets(nb) {
  let targets = [];
  for (let i = 0; i < nb; i++) {
    target = new Target(random(width), random(height));
    target.maxSpeed = 3;
    target.maxForce = 1;
    targets.push(target);
  }
  return targets;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Poursuiveur
  pursuer = new Vehicle(random(width), random(height));
  //pursuer.maxSpeed = 10;
  //pursuer.maxForce = 0.4;
  //pursuer.vel = createVector(2, 4)

  // Cible
  targets = createTargets(3);

  // Slider pour la vitesse max de la cible
  sliderVitesseMaxCible = createSlider(1, 10, 3, 0.1);
  sliderVitesseMaxCible.position(20, 20);
  sliderVitesseMaxCible.style('width', '180px');

  // Slider pour la force max de la cible
  sliderForceMaxCible = createSlider(0.01, 1, 0.1, 0.01);
  sliderForceMaxCible.position(20, 50);
  sliderForceMaxCible.style('width', '180px');

  // Slider pour la vitesse max du poursuiveur
  sliderVitesseMaxPoursuiveur = createSlider(1, 10, 4, 0.1);
  sliderVitesseMaxPoursuiveur.position(20, 80);
  sliderVitesseMaxPoursuiveur.style('width', '180px');

  // Slider pour la force max du poursuiveur
  sliderForceMaxPoursuiveur = createSlider(0.01, 1, 0.1, 0.01);
  sliderForceMaxPoursuiveur.position(20, 110);
  sliderForceMaxPoursuiveur.style('width', '180px');
}

let oldMousePos;

function draw() {
  background(0);

  // Récupère les valeurs des sliders et les applique aux véhicules
  let maxSpeedCible = sliderVitesseMaxCible.value();
  let maxForceCible = sliderForceMaxCible.value();
  let maxSpeedPoursuiveur = sliderVitesseMaxPoursuiveur.value();
  let maxForcePoursuiveur = sliderForceMaxPoursuiveur.value();

  pursuer.maxSpeed = maxSpeedPoursuiveur;
  pursuer.maxForce = maxForcePoursuiveur;
  targets.forEach(target => {
    target.maxSpeed = maxSpeedCible;
    target.maxForce = maxForceCible;
  });

  // Affiche les valeurs des sliders à l'écran
  noStroke();
  fill(255);
  textSize(14);
  text(`Vitesse max cible : ${maxSpeedCible.toFixed(1)}`, 220, 35);
  text(`Force max cible : ${maxForceCible.toFixed(2)}`, 220, 65);
  text(`Vitesse max poursuiveur : ${maxSpeedPoursuiveur.toFixed(1)}`, 220, 95);
  text(`Force max poursuiveur : ${maxForcePoursuiveur.toFixed(2)}`, 220, 125);

  // pursuer = le véhicule poursuiveur, il vise un point devant la cible
  target = cibleLaPlusProche(pursuer, targets);

  //let force = pursuer.pursuePerfect(target);
  let force = pursuer.pursue(target);
  pursuer.applyForce(force);

  // déplacement et dessin du véhicule et de la target
  pursuer.update();
  pursuer.show();

  // on déplace et on dessine toutes les targets
  targets.forEach(target => {
    // lorsque la target atteint un bord du canvas elle ré-apparait de l'autre côté
    target.edges();

    // TODO : si le poursuiveur est à moins de target.rayonDetection
    // alors la target s'évade (evade = fuite avec prédiction) du
    // poursuiveur

    // mettre en commentaire la ligne suivante
    // si cible controlée à la souris
    target.applyForce(target.evade(pursuer));
    target.update();
    target.show();
  });
}

function cibleLaPlusProche(vehicle, targets) {
  let cibleProche = null;
  let distanceMin = Infinity;

  targets.forEach(target => {
    let d = p5.Vector.dist(vehicle.pos, target.pos);
    if (d < distanceMin) {
      distanceMin = d;
      cibleProche = target;
    }
  });

  return cibleProche;
}

// detection click souris
function mouseClicked() {
 // on déplace le poursuiveur à la position de la souris
  pursuer.pos = createVector(mouseX, mouseY);
}
