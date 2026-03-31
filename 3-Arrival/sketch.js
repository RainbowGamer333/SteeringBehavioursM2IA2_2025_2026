let target;
let vehicles = [];
let points = [];
let snake = true;
let word = false;
SNAKE_VEHICLE_AMOUNT = 10;


// Appelée avant de démarrer l'animation
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont('./assets/inconsolata.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // La cible, ce sera la position de la souris
  target = createVector(random(width), random(height));
  creerVehicules(SNAKE_VEHICLE_AMOUNT);
}

function creerPoints(word) {
  let textPoints = font.textToPoints(word, 100, 200, 256, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });
  points = [];
  for (let pt of textPoints) {
    points.push(createVector(pt.x, pt.y));
  }
}

function creerVehicules(n) {
  vehicles = [];
  for (let i = 0; i < n; i++) {
    let v = new Vehicle(random(width), random(height));
    v.maxSpeed = 4;
    vehicles.push(v);
  }
}

// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);


  target.x = mouseX;
  target.y = mouseY;

  // dessin de la cible à la position de la souris
  push();
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);
  pop();

  // dessine une ligne entre chaque véhicule adjacents
  if (snake) {
    stroke(255, 150);
    strokeWeight(2);
    noFill();
    for (let i = 0; i < vehicles.length - 1; i++) {
      line(vehicles[i].pos.x, vehicles[i].pos.y, vehicles[i + 1].pos.x, vehicles[i + 1].pos.y);
    }
  }

  // si on a affaire au premier véhicule
  // alors il suit la souris (target)
  let steeringForce;
  for (let i = 0; i < vehicles.length; i++) {
    // Snake method
    if (snake) {
      if (i === 0) {
        // le premier véhicule suit la souris avec arrivée
         steeringForce = vehicles[i].arrive(target, 0);
      } else {
        // les autres véhicules suivent le premier véhicule avec arrivée
        steeringForce = vehicles[i].arrive(vehicles[i - 1].pos, 0);
      }
    }
    // Word method
    else {
      steeringForce = vehicles[i].arrive(points[i % points.length], 0);
    }
    
    vehicles[i].applyForce(steeringForce);
    vehicles[i].update();
    vehicles[i].show();
  }

  // for (let p of points) {
  //   stroke(255, 0, 255);
  //   strokeWeight(4);
  //   point(p.x, p.y);
  // }
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
  else if (key === 'F1') {
    snake = true;
    creerVehicules(SNAKE_VEHICLE_AMOUNT);
  }
  else {
    snake = false;
    creerPoints(key);
    creerVehicules(points.length);
  }
}