// GameManager.js
// Manages score, lives, state, and collision checks.

class GameManager {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.gameState = 'playing'; // playing / gameover / paused
    this.level = 1;
    this.bg = null;
  }

  checkFoodCollision(snake, foods) {
    if (this.gameState !== 'playing') return;

    let head = snake.segments[0];
    for (let i = foods.length - 1; i >= 0; i--) {
      let food = foods[i];
      if (p5.Vector.dist(head.pos, food.pos) < food.r + head.r) {
        foods.splice(i, 1);
        this.score += food.value || 10;
        if (this.bg) this.bg.pulse(food.pos.x, food.pos.y, 'cyan');
        if (snake.grow) snake.grow();
      }
    }

    if (foods.length === 0) {
      this.gameState = 'levelcomplete';
    }
  }

  checkEnemyCollision(snake, enemies) {
    if (this.gameState !== 'playing') return;
    if (this.lives <= 0) return;

    let head = snake.segments[0];
    for (let enemy of enemies) {
      if (p5.Vector.dist(head.pos, enemy.pos) < head.r + enemy.r) {
        this.lives -= 1;
        if (this.lives <= 0) {
          this.gameState = 'gameover';
        }
        break;
      }
    }
  }

  spawnFood(n, foods) {
    for (let i = 0; i < n; i++) {
      let x = random(width);
      let y = random(height);
      foods.push(new Food(x, y));
    }
  }

  update(snake, foods, enemies, powerups) {
    if (this.gameState !== 'playing') return;

    this.checkFoodCollision(snake, foods);
    this.checkEnemyCollision(snake, enemies);

    // future collisions for powerups etc can be added here
    if (powerups) {
      let head = snake.segments[0];
      for (let i = powerups.length - 1; i >= 0; i--) {
        let p = powerups[i];
        if (p5.Vector.dist(head.pos, p.pos) < p.r + head.r) {
          p.applyToSnake?.(snake);
          powerups.splice(i, 1);
        }
      }
    }
  }

  nextLevel(snake, foods, enemies) {
    this.level++;
    this.gameState = 'playing';

    // Spawn foods: 5 + level * 2
    for (let i = 0; i < 5 + this.level * 2; i++) {
      foods.push(new Food(random(width), random(height)));
    }

    // Spawn enemies: level
    for (let i = 0; i < this.level; i++) {
      enemies.push(new Enemy(random(width), random(height), snake.segments[0]));
    }

    // Increase snake maxSpeed
    snake.segments.forEach(s => s.maxSpeed += 0.3);
  }
}
