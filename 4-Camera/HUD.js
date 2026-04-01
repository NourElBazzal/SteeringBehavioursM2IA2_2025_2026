class HUD {
  constructor(zoneManager, gameManager) {
    this.zoneManager = zoneManager;
    this.gameManager = gameManager;
  }

  update(player) {
    this.player = player;
  }

  show() {
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
  }
}