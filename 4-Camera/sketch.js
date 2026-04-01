let camera;
let oceanBg;
let gameManager;
let hud;
let zoneManager;

function setup() {
  createCanvas(windowWidth, windowHeight);

  zoneManager = new ZoneManager();
  camera = new Camera(1000, 1500);
  oceanBg = new OceanBackground();
  gameManager = new GameManager(zoneManager);
  hud = new HUD(zoneManager, gameManager);
}

function draw() {
  background(10, 42, 74);

  // Update game
  let mouseWorldPos = getMouseWorldPos();
  gameManager.update(mouseWorldPos);
  hud.update(gameManager.getPlayer());

  // Apply camera
  push();
  camera.apply();

  // Draw world
  oceanBg.show();
  gameManager.show();

  pop();

  // Camera follows player
  if (!gameManager.isGameOver()) {
    camera.follow(gameManager.getPlayer());
  }

  // Draw HUD
  hud.show();
}

function getMouseWorldPos() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    let worldX = mouseX + (camera.pos.x - width / 2);
    let worldY = mouseY + (camera.pos.y - height / 2);
    return createVector(worldX, worldY);
  }
  return null;
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    Vehicle.debug = !Vehicle.debug;
  }
  if ((key === 'r' || key === 'R') && gameManager.isGameOver()) {
    gameManager.restart();
    camera.pos.set(gameManager.getPlayer().pos.x, gameManager.getPlayer().pos.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
