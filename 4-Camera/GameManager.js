class GameManager {
  constructor(zoneManager) {
    this.zoneManager = zoneManager;
    this.player = new PlayerFish(1000, 1500);
    this.aiFish = [];
    this.current = createVector(0.3, 0.1); // gentle ocean current drift
    this.gameState = 'start'; // 'start', 'playing', 'gameover', 'won'
    this.initialFishCount = 20;
    this.maxFishCount = 25;
    this.winSize = 80;
    this.eatEvents = [];
    this.currentZone = this.zoneManager.getZoneName(this.player.pos.y);
    this.zoneTransitionMessage = '';
    this.zoneTransitionTimer = 0;
    this.obstacles = [];
    this.decorations = new Decoration();
    this.spawnFish();
    this.spawnObstacles();
  }

  spawnFish() {
    // Divide world into 4 depth bands matching zones
    let bands = [
      { min: 0, max: 700 },      // Surface
      { min: 700, max: 1500 },   // Twilight
      { min: 1500, max: 2300 },  // Midnight
      { min: 2300, max: 3000 }   // Abyss
    ];
    let fishPerBand = Math.floor(this.initialFishCount / 4);
    let remainder = this.initialFishCount % 4;

    // Spawn roughly equal counts per band
    for (let b = 0; b < bands.length; b++) {
      let count = fishPerBand + (b < remainder ? 1 : 0);
      for (let i = 0; i < count; i++) {
        let x = random(0, 2000);
        let y = random(bands[b].min, bands[b].max);
        let fish = this.createFishForDepth(x, y);
        this.aiFish.push(fish);
      }
    }
  }

  createFishForDepth(x, y) {
    let zone = this.zoneManager.getZone(y);
    let type, size;
    if (zone.name === 'Surface') {
      type = random(['prey', 'prey', 'neutral']); // mostly prey
      size = random(10, 20);
    } else if (zone.name === 'Twilight') {
      type = random(['prey', 'neutral', 'predator']); // mix
      size = random(15, 25);
    } else if (zone.name === 'Midnight') {
      type = random(['neutral', 'predator', 'predator']); // more predator
      size = random(20, 30);
    } else { // Abyss
      type = random(['predator', 'predator']); // mostly predator
      size = random(25, 35);
    }
    let depthFactor = y / 3000;
    return new AIFish(x, y, type, size, depthFactor);
  }

  spawnObstacles() {
    this.obstacles = [];
    for (let i = 0; i < 15; i++) {
      let x, y;
      do {
        x = random(0, 2000);
        y = random(0, 3000);
      } while (x > 900 && x < 1100 && y > 1400 && y < 1600);
      let radius = random(20, 40);
      this.obstacles.push(new Obstacle(x, y, radius));
    }
  }

  update(mouseWorldPos) {
    if (this.gameState !== 'playing') return;

    // Track zone transitions
    let newZone = this.zoneManager.getZoneName(this.player.pos.y);
    if (newZone !== this.currentZone) {
      this.currentZone = newZone;
      this.zoneTransitionMessage = newZone;
      this.zoneTransitionTimer = 180; // 3 seconds at 60fps
    }

    // Decrement zone transition timer
    if (this.zoneTransitionTimer > 0) {
      this.zoneTransitionTimer--;
    }

    // Player: apply arrive and boundary, then update
    if (mouseWorldPos) {
      let arriveForce = this.player.arrive(mouseWorldPos);
      this.player.applyForce(arriveForce);
    }
    let boundaryForce = this.player.boundaries(0, 0, 2000, 3000, 50);
    this.player.applyForce(boundaryForce);
    this.player.update();

    // AI fish: apply current + behavior + boundary, then update
    let preyFish = this.aiFish.filter(f => f.type === 'prey');
    for (let fish of this.aiFish) {
      // Apply gentle ocean current to AI fish only
      fish.applyForce(this.current);

      let preyArray = (fish.type === 'prey') ? preyFish : null;
      let behaviorForce = fish.computeBehaviorForce(this.player, preyArray);
      fish.applyForce(behaviorForce);
      let bForce = fish.boundaries(0, 0, 2000, 3000, 50);
      fish.applyForce(bForce);
      fish.update();
    }

    // Check collisions
    this.checkCollisions();

    // Gradual refill
    if (this.aiFish.length < this.maxFishCount) {
      let x = random(0, 2000);
      let y = random(0, 3000);
      let fish = this.createFishForDepth(x, y);
      this.aiFish.push(fish);
    }
  }

  checkCollisions() {
    for (let i = this.aiFish.length - 1; i >= 0; i--) {
      let fish = this.aiFish[i];
      let dist = p5.Vector.dist(this.player.pos, fish.pos);
      let combinedRadius = this.player.getRadius() + fish.getRadius();

      if (dist < combinedRadius) {
        if (this.player.getRadius() > fish.getRadius() * 1.2) {
          // Player eats fish with curve-based growth
          let ratio = fish.getRadius() / this.player.getRadius();
          let growAmount = fish.getRadius() * 0.1 + ratio * fish.getRadius() * 0.4;
          this.player.grow(growAmount);
          
          // Check win condition
          if (this.player.getRadius() >= this.winSize) {
            this.gameState = 'won';
          }
          
          this.eatEvents.push({
            x: fish.pos.x,
            y: fish.pos.y,
            timer: 20
          });
          this.aiFish.splice(i, 1);
        } else if (fish.type === 'predator' && fish.getRadius() > this.player.getRadius() * 1.2) {
          // Predator eats player
          this.gameState = 'gameover';
        }
      }
    }

    // Obstacle collision check
    for (let obs of this.obstacles) {
      if (p5.Vector.dist(this.player.pos, createVector(obs.x, obs.y)) < this.player.getRadius() + obs.radius) {
        this.gameState = 'gameover';
        break;
      }
    }
  }

  show() {
    this.decorations.show();
    for (let obs of this.obstacles) {
      obs.show();
    }
    this.player.show();
    for (let fish of this.aiFish) {
      fish.show(this.player.getRadius());
    }
    
    // Draw and update eat events
    for (let i = this.eatEvents.length - 1; i >= 0; i--) {
      let event = this.eatEvents[i];
      let alpha = map(event.timer, 0, 20, 0, 100);
      let radius = map(event.timer, 0, 20, 20, 5);
      
      push();
      fill(100, 255, 150, alpha);
      noStroke();
      circle(event.x, event.y, radius * 2);
      pop();
      
      event.timer--;
      if (event.timer < 0) {
        this.eatEvents.splice(i, 1);
      }
    }
  }

  getPlayer() {
    return this.player;
  }

  isGameOver() {
    return this.gameState === 'gameover';
  }

  isStartScreen() {
    return this.gameState === 'start';
  }

  isWon() {
    return this.gameState === 'won';
  }

  startGame() {
    this.gameState = 'playing';
  }

  restart() {
    this.player = new PlayerFish(1000, 1500);
    this.aiFish = [];
    this.eatEvents = [];
    this.gameState = 'playing';
    this.currentZone = this.zoneManager.getZoneName(this.player.pos.y);
    this.zoneTransitionMessage = '';
    this.zoneTransitionTimer = 0;
    this.spawnFish();
    this.spawnObstacles();
  }
}