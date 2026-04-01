class GameManager {
  constructor(zoneManager) {
    this.zoneManager = zoneManager;
    this.player = new PlayerFish(1000, 1500);
    this.aiFish = [];
    this.gameOver = false;
    this.initialFishCount = 20;
    this.maxFishCount = 25;
    this.spawnFish();
  }

  spawnFish() {
    // Initial spawn
    for (let i = 0; i < this.initialFishCount; i++) {
      let x = random(0, 2000);
      let y = random(0, 3000);
      let fish = this.createFishForDepth(x, y);
      this.aiFish.push(fish);
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
    return new AIFish(x, y, type, size);
  }

  update(mouseWorldPos) {
    if (this.gameOver) return;

    // Player: apply arrive and boundary, then update
    if (mouseWorldPos) {
      let arriveForce = this.player.arrive(mouseWorldPos);
      this.player.applyForce(arriveForce);
    }
    let boundaryForce = this.player.boundaries(0, 0, 2000, 3000, 50);
    this.player.applyForce(boundaryForce);
    this.player.update();

    // AI fish: apply behavior and boundary, then update
    let preyFish = this.aiFish.filter(f => f.type === 'prey');
    for (let fish of this.aiFish) {
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
          // Player eats fish
          this.player.grow(fish.getRadius() * 0.5);
          this.aiFish.splice(i, 1);
        } else if (fish.type === 'predator' && fish.getRadius() > this.player.getRadius() * 1.2) {
          // Predator eats player
          this.gameOver = true;
        }
      }
    }
  }

  show() {
    this.player.show();
    for (let fish of this.aiFish) {
      fish.show();
    }
  }

  getPlayer() {
    return this.player;
  }

  isGameOver() {
    return this.gameOver;
  }

  restart() {
    this.player = new PlayerFish(1000, 1500);
    this.aiFish = [];
    this.gameOver = false;
    this.spawnFish();
  }
}