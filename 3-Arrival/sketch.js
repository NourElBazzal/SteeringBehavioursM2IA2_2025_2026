let snake;
let font;
let speedSlider;
let gm;
let foods = [];
let enemies = [];
let powerups = [];
let levelCompleteTime = 0;
let bg;

// Appelée avant de démarrer l'animation
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont("./assets/inconsolata.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg = new Background();
  snake = new Snake(width / 2, height / 2, 20, 20);

  gm = new GameManager();
  gm.bg = bg;
  gm.spawnFood(5, foods);
  for (let i = 0; i < 2; i++) {
    enemies.push(new Enemy(random(width), random(height), snake.segments[0]));
  }

  speedSlider = createSlider(1, 10, 5, 0.5);
  speedSlider.position(width - 120, height - 30);

  speedSlider.style('appearance', 'none');
  speedSlider.style('-webkit-appearance', 'none');
  speedSlider.style('background', '#0ff3');
  speedSlider.style('outline', 'none');
  speedSlider.style('border', 'none');
  speedSlider.style('height', '3px');
  speedSlider.style('cursor', 'pointer');

  // La cible, ce sera la position de la souris
  //target = createVector(random(width), random(height));

  // On générer une chaine de caractères et on va utiliser la fonction text2points
  // pour obtenir une liste de points à partir de cette chaine de caractères
  // Paramètres = texte, position x, position y, taille du texte,
  // paramètres optionnels (sampleFactor = 0.1, simplifyThreshold = 0)
  points = font.textToPoints("IA2", 100, 400, 512, { sampleFactor: 0.03 });

  // on cree des vehicules, autant que de points
  //creerVehicules(20);
}

/*
function creerVehicules(n) {
  for (let i = 0; i < n; i++) {
    let v = new Vehicle(random(width), random(height));
    vehicles.push(v);
  }
}*/

// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  bg.show();
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  let speed = speedSlider.value();
  snake.segments.forEach(s => s.maxSpeed = speed);

  if (gm.gameState === 'playing') {
    snake.update();
    gm.update(snake, foods, enemies, powerups);
  }

  snake.show();

  for (let food of foods) food.show();
  for (let enemy of enemies) {
    enemy.update();
    enemy.show();
  }
  for (let p of powerups) {
    p.update();
    p.show();
  }

  // Draw score HUD at top-center
  if (font) {
    push();
    textFont(font);
    textSize(20);
    fill(120, 255, 140);
    noStroke();
    textAlign(CENTER, CENTER);
    text(`Score: ${gm.score}  |  Lives: ${gm.lives}`, width / 2, 30);
    pop();
  }

  if (gm.gameState === 'gameover') {
    push();
    textAlign(CENTER, CENTER);
    textFont(font);
    textSize(52);
    fill(255, 30, 30);
    text('GAME OVER', width / 2, height / 2 - 30);
    textSize(24);
    fill(255);
    text(`Final Score: ${gm.score}`, width / 2, height / 2 + 20);
    text('Press [R] to restart', width / 2, height / 2 + 60);
    pop();
  }

  if (gm.gameState === 'levelcomplete') {
    if (levelCompleteTime === 0) {
      levelCompleteTime = millis();
    }
    if (millis() - levelCompleteTime > 2000) {
      gm.nextLevel(snake, foods, enemies);
      levelCompleteTime = 0;
    }

    push();
    textAlign(CENTER, CENTER);
    textFont(font);
    textSize(52);
    fill(120, 255, 140); // neon green
    text('LEVEL ' + gm.level + ' COMPLETE!', width / 2, height / 2 - 30);
    textSize(24);
    fill(255);
    text(`Score: ${gm.score}`, width / 2, height / 2 + 20);
    pop();
  }

  // slider label at bottom-right
  push();
  noStroke();
  fill(255);
  textSize(14);
  textAlign(RIGHT, CENTER);
  text(`Vitesse Max: ${speed}`, width - 20, height - 40);
  pop();
}

function keyPressed() {
  let x = 0;
  let y = 0;

  if (key === 'f' || key === 'F') {
    Vehicle.debug = !Vehicle.debug;
  } else if (key === 'r' || key === 'R') {
    resetGame();
  } else if (key === 'w' || key === 'W' || keyCode === UP_ARROW) {
    y = -1;
  } else if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) {
    y = 1;
  } else if (key === 'a' || key === 'A' || keyCode === LEFT_ARROW) {
    x = -1;
  } else if (key === 'd' || key === 'D' || keyCode === RIGHT_ARROW) {
    x = 1;
  }

  if (x !== 0 || y !== 0) {
    snake.setDirection(x, y);
  }
}

function resetGame() {
  gm = new GameManager();
  gm.bg = bg;
  foods = [];
  enemies = [];
  powerups = [];
  gm.spawnFood(5, foods);
  snake = new Snake(width / 2, height / 2, 20, 20);
  for (let i = 0; i < 2; i++) {
    enemies.push(new Enemy(random(width), random(height), snake.segments[0]));
  }
  levelCompleteTime = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  speedSlider.position(width - 120, height - 30);
}
