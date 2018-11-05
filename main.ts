"use strict";

window.onload = function () {
  setInterval(update, 1000 / 30);
  setInterval(spawnEnemy, 2000);
  setInterval(enemyFire, 1000);
}

const backbgCanvas = document.querySelector('.back-bg') as HTMLCanvasElement;
const frontbgCanvas = document.querySelector('.front-bg') as HTMLCanvasElement;
const playerCanvas = document.querySelector('.player-area') as HTMLCanvasElement;
const enemyCanvas = document.querySelector('.enemy-area') as HTMLCanvasElement;
const bbgC = backbgCanvas.getContext('2d');
const fbgC = frontbgCanvas.getContext('2d');
const pC = playerCanvas.getContext('2d');
const eC = enemyCanvas.getContext('2d');
const backBg = document.getElementById('back-bg') as HTMLImageElement;
const frontBg = document.getElementById('front-bg') as HTMLImageElement;
const playerCharacter = document.getElementById('player') as HTMLImageElement;
const playerLaser = document.getElementById('player-laser') as HTMLImageElement;
const enemyCharacter = document.getElementById('enemy') as HTMLImageElement;
const enemyLaser = document.getElementById('enemy-laser') as HTMLImageElement;

document.body.addEventListener('keydown', onKeyPress);
let backBackgroundPosition1 = 0;
let backBackgroundPosition2 = 800;
let frontBackgroundPosition1 = 0;
let frontBackgroundPosition2 = 800;

// ----------------------------------------------------------------
// Auto update functions
// ----------------------------------------------------------------

function update() {

  // Drawing the slower moving, back layer of the background
  if (backBackgroundPosition1 >= -1600) {
    bbgC.drawImage(backBg, backBackgroundPosition1, 0);
  } else if (backBackgroundPosition1 <= -1600 &&
    backBackgroundPosition1 >= -2400) {
    bbgC.drawImage(backBg, backBackgroundPosition1, 0);
    bbgC.drawImage(backBg, backBackgroundPosition2, 0);
    backBackgroundPosition2 -= 0.5;
  } else if (backBackgroundPosition1 <= -2400) {
    backBackgroundPosition1 = 0;
    backBackgroundPosition2 = 800;
    bbgC.drawImage(backBg, backBackgroundPosition1, 0);
  }
  backBackgroundPosition1 -= 0.5;

  // Drawing the faster moving, front layer of the background
  if (frontBackgroundPosition1 >= -1600) {
    fbgC.drawImage(frontBg, frontBackgroundPosition1, 0);
  } else if (frontBackgroundPosition1 <= -1600 &&
    frontBackgroundPosition1 >= -2400) {
    fbgC.drawImage(frontBg, frontBackgroundPosition1, 0);
    fbgC.drawImage(frontBg, frontBackgroundPosition2, 0);
    frontBackgroundPosition2 -= 2.5;
  } else if (frontBackgroundPosition1 <= -2400) {
    frontBackgroundPosition1 = 0;
    frontBackgroundPosition2 = 800;
    fbgC.drawImage(frontBg, frontBackgroundPosition1, 0);
  }
  frontBackgroundPosition1 -= 2.5;

  pC.clearRect(0, 0, 800, 600)
  eC.clearRect(0, 0, 800, 600)
  player.createPlayer();

  playerLasers.forEach(element => {
    element.drawPlayerLaser();
  });

  enemies.forEach(element => {
    element.drawEnemy();
  });
  enemyLasers.forEach(element => {
    element.drawEnemyLaser();
  });
}

let e: number = 0;
let enemies: any = [];

function spawnEnemy() {
  enemies.push(`enemyShip${e}`);
  enemies[e] = new Enemy();
  e++;
}

function enemyFire() {
  enemies.forEach(element => {
    element.fireLaser();
  });
}

// ----------------------------------------------------------------
// Game Objects
// ----------------------------------------------------------------

abstract class gameObjects {
  type: string;
  isAlive: boolean;
  constructor(type: string, isAlive: boolean) {
    this.type = type;
    this.isAlive = isAlive;
  }
}

// ----------------------------------------------------------------
// Player Objects
// ----------------------------------------------------------------

class Player extends gameObjects {
  positionX: number;
  positionY: number;
  constructor() {
    super('Player', true);
    this.positionX = 280;
    this.positionY = 20;
  }
  createPlayer() {
    pC.drawImage(playerCharacter, this.positionX, this.positionY);
  }
  movementUp() {
    if (this.positionY - 5 > -20) {
      this.positionY = this.positionY - 5;
    }
  }
  movementDown() {
    if (this.positionY + 5 < 555) {
      this.positionY = this.positionY + 5;
    }
  }
  movementLeft() {
    if (this.positionX - 5 > -10) {
      this.positionX = this.positionX - 5;
    }
  }
  movementRight() {
    if (this.positionX + 5 < 755) {
      this.positionX = this.positionX + 5;
    }
  }
}

class PlayerLaser {
  positionX: number;
  positionY: number;
  constructor() {
    this.positionX = player.positionX + 40;
    this.positionY = player.positionY + 30;
  }
  drawPlayerLaser() {
    if (this.positionX < 800) {
      pC.drawImage(playerLaser, this.positionX, this.positionY);
      this.positionX += 10;
    }
  }
}

let player = new Player();
let pl: number = 0;
let playerLasers: any = [];

// ----------------------------------------------------------------
// Enemy objects
// ----------------------------------------------------------------

let el: number = 0;
let enemyLasers: any = [];

class Enemy extends gameObjects {
  positionX: number;
  positionY: number;
  speedX: number;
  speedY: number;
  randomizer: number;
  constructor() {
    super('Enemy', true);
    this.positionX = 840;
    this.positionY = Math.floor(Math.random() * (555 - (-20))) + (-20);
    this.speedX = Math.random() * (3 - 1) + 1;
    this.speedY = Math.random() * (1 - 0) + 0;
    this.randomizer = Math.floor(Math.random() * (100 - 0)) + 0;
  }
  drawEnemy() {
    eC.drawImage(enemyCharacter, this.positionX, this.positionY);
    this.positionX = this.positionX - this.speedX;
    if (this.randomizer >= 50) {
      this.positionY = this.positionY - this.speedY;
    } else {
      this.positionY = this.positionY + this.speedY
    }
  }
  fireLaser() {
    if (this.positionY - player.positionY <= 20 && this.positionY - player.positionY >= -20) {
      enemyLasers.push(`enemyLaserElement${el}`);
      enemyLasers[el] = new EnemyLaser(this.positionX, this.positionY);
      el++;
    }
  }
}

class EnemyLaser {
  positionX: number;
  positionY: number;
  constructor(positionX: number, positionY: number) {
    this.positionX = positionX - 20;
    this.positionY = positionY + 20;
  }
  drawEnemyLaser() {
    if (this.positionX > -20) {
      eC.drawImage(enemyLaser, this.positionX, this.positionY);
      this.positionX -= 8;
    }
  }
}

// Input controls

function onKeyPress(event: KeyboardEvent) {
  switch (event.keyCode) {
    case 38:
      player.movementUp();
      break;
    case 40:
      player.movementDown();
      break;
    case 37:
      player.movementLeft();
      break;
    case 39:
      player.movementRight();
      break;
    case 32:
      playerLasers.push(`playerLaserElement${pl}`);
      playerLasers[pl] = new PlayerLaser();
      pl++;
      break;
  }
}


