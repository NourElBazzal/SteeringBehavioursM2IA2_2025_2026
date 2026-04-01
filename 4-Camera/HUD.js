class HUD {
  constructor(zoneManager, gameManager) {
    this.zoneManager = zoneManager;
    this.gameManager = gameManager;
    // Zone colors
    this.zoneColors = {
      'Surface': color(100, 200, 255),    // cyan
      'Twilight': color(100, 180, 200),   // teal
      'Midnight': color(60, 100, 160),    // dark blue
      'Abyss': color(120, 80, 160)        // deep purple
    };
  }

  update(player) {
    this.player = player;
  }

  showStartScreen() {
    push();
    // Dark overlay
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, width, height);

    // Title
    fill(100, 200, 255);
    textAlign(CENTER, CENTER);
    textSize(64);
    text("Deep Descent", width / 2, height / 2 - 100);

    // Subtitle
    fill(200, 200, 255);
    textSize(28);
    text("Click to begin", width / 2, height / 2 - 20);

    // Instructions
    fill(150, 200, 200);
    textSize(16);
    text("Eat smaller fish to grow — avoid larger predators", width / 2, height / 2 + 60);

    pop();
  }

  showWinScreen() {
    push();
    // Dark overlay
    fill(0, 0, 0, 200);
    noStroke();
    rect(0, 0, width, height);

    // Title
    fill(100, 255, 150);
    textAlign(CENTER, CENTER);
    textSize(56);
    text("You reached the top", width / 2, height / 2 - 60);
    text("of the food chain!", width / 2, height / 2 - 10);

    // Final size
    fill(200, 255, 200);
    textSize(32);
    text(`Final Size: ${this.player.getRadius().toFixed(1)}`, width / 2, height / 2 + 60);

    // Instructions
    fill(150, 255, 200);
    textSize(16);
    text("Press R to restart", width / 2, height / 2 + 120);

    pop();
  }

  show() {
    if (this.gameManager.isStartScreen()) {
      this.showStartScreen();
      return;
    }

    if (this.gameManager.isWon()) {
      this.showWinScreen();
      return;
    }

    if (this.gameManager.isGameOver()) {
      push();
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("GAME OVER", width / 2, height / 2);
      textSize(24);
      text("Press R to restart", width / 2, height / 2 + 60);
      pop();
      return;
    }

    if (!this.player) return;

    // Draw zone transition message if active
    if (this.gameManager.zoneTransitionTimer > 0) {
      push();
      let zoneColor = this.zoneColors[this.gameManager.zoneTransitionMessage];
      let alpha = map(this.gameManager.zoneTransitionTimer, 0, 180, 0, 255);
      let c = color(red(zoneColor), green(zoneColor), blue(zoneColor), alpha);
      fill(c);
      textAlign(CENTER, CENTER);
      textSize(56);
      text(this.gameManager.zoneTransitionMessage, width / 2, height / 2);
      pop();
    }

    push();
    // Screen space coordinates
    fill(255);
    textAlign(LEFT, TOP);
    textSize(16);

    let size = this.player.getRadius();
    let depth = Math.round(this.player.pos.y);
    let zone = this.zoneManager.getZoneName(this.player.pos.y);

    text(`Size: ${size.toFixed(1)}`, 10, 10);
    text(`Depth: ${depth}`, 10, 30);
    text(`Zone: ${zone}`, 10, 50);

    pop();

    // Draw progress bar
    push();
    let barWidth = 300;
    let barHeight = 8;
    let barX = width / 2 - barWidth / 2;
    let barY = height - 30;
    let progress = Math.min(size / this.gameManager.winSize, 1);

    // Background bar
    fill(60, 60, 60);
    noStroke();
    rect(barX, barY, barWidth, barHeight);

    // Progress bar
    fill(100, 200, 255);
    rect(barX, barY, barWidth * progress, barHeight);

    // Border
    stroke(150, 200, 255);
    strokeWeight(1);
    noFill();
    rect(barX, barY, barWidth, barHeight);

    // Label
    fill(200, 200, 255);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`Size: ${size.toFixed(1)} / ${this.gameManager.winSize}`, width / 2, barY - 5);

    pop();
  }

}