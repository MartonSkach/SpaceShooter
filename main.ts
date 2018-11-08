'use strict';

window.onload = function () {
  titleScreen();
}

const backbgCanvas = document.querySelector('.back-bg') as HTMLCanvasElement;
const frontbgCanvas = document.querySelector('.front-bg') as HTMLCanvasElement;
const playerCanvas = document.querySelector('.player-area') as HTMLCanvasElement;
const enemyCanvas = document.querySelector('.enemy-area') as HTMLCanvasElement;
const explosionCanvas = document.querySelector('.explosion-area') as HTMLCanvasElement;
const bbgC = backbgCanvas.getContext('2d');
const fbgC = frontbgCanvas.getContext('2d');
const pC = playerCanvas.getContext('2d');
const eC = enemyCanvas.getContext('2d');
const explosionC = explosionCanvas.getContext('2d');
const backBg = document.getElementById('back-bg') as HTMLImageElement;
const frontBg = document.getElementById('front-bg') as HTMLImageElement;
const playerCharacter = document.getElementById('player') as HTMLImageElement;
const playerLaser = document.getElementById('player-laser') as HTMLImageElement;
const enemyCharacter = document.getElementById('enemy') as HTMLImageElement;
const enemyLaser = document.getElementById('enemy-laser') as HTMLImageElement;
const explosionSprite = document.getElementById('explosion_sprite') as HTMLImageElement;
const title = document.getElementById('title') as HTMLImageElement;

const startButton1 = document.querySelector('#button1') as HTMLBodyElement;
const startButton2 = document.querySelector('#button2') as HTMLBodyElement;
const startButton3 = document.querySelector('#button3') as HTMLBodyElement;
const exitButton = document.querySelector('.exitButton') as HTMLBodyElement;
const buttonHolder = document.querySelector('.button-holder') as HTMLDivElement;

document.body.addEventListener('keydown', onKeyPress);
let backBackgroundPosition1 = 0;
let backBackgroundPosition2 = 800;
let frontBackgroundPosition1 = 0;
let frontBackgroundPosition2 = 800;

// ----------------------------------------------------------------
// Game Objects
// ----------------------------------------------------------------

abstract class gameObjects {
  type: string;
  isAlive: boolean;
  constructor(type: string) {
    this.type = type;
    this.isAlive = true;
  }
}

// ----------------------------------------------------------------
// Player Objects
// ----------------------------------------------------------------

class Player extends gameObjects {
  positionX: number;
  positionY: number;
  constructor() {
    super('Player');
    this.positionX = 50;
    this.positionY = 290;
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
  drawable: boolean;
  constructor() {
    this.positionX = player.positionX + 40;
    this.positionY = player.positionY + 30;
    this.drawable = true;
  };
  drawPlayerLaser() {
    pC.drawImage(playerLaser, this.positionX, this.positionY);
    this.positionX += 10;
  };
}

function shootLaser() {
  playerLasers.push(`playerLaserElement${pl}`);
  playerLasers[pl] = new PlayerLaser();
  pl++;
}

// ----------------------------------------------------------------
// Enemy objects
// ----------------------------------------------------------------

class Enemy extends gameObjects {
  positionX: number;
  positionY: number;
  speedX: number;
  speedY: number;
  randomizer: number;
  constructor() {
    super('Enemy');
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
    if (this.positionY - player.positionY <= 25 && this.positionY - player.positionY >= -25) {
      enemyLasers.push(`enemyLaserElement${el}`);
      enemyLasers[el] = new EnemyLaser(this.positionX, this.positionY);
      el++;
    }
  }
  isAliveCheck() {
    playerLasers.forEach(element => {
      if ((element.positionX - this.positionX >= -20 && element.positionX - this.positionX <= 10) &&
        (element.positionY - this.positionY >= -10 && element.positionY - this.positionY <= 40) &&
        element.drawable) {
        this.isAlive = false;
        element.drawable = false;
        explosion(this.positionX - 40, this.positionY - 40, 0);
        playerPoints++;
      }
    });
    if ((player.positionX - this.positionX >= -45 && player.positionX - this.positionX <= 55) &&
      (player.positionY - this.positionY >= -45 && player.positionY - this.positionY <= 20) &&
      player.isAlive) {
      this.isAlive = false;
      player.isAlive = false;
      explosion(this.positionX - 40, this.positionY - 40, 0);
      explosion(player.positionX - 40, player.positionY - 40, 0);
      playerPoints++;
    }
  }
}

class EnemyLaser {
  positionX: number;
  positionY: number;
  drawable: boolean;
  constructor(positionX: number, positionY: number) {
    this.positionX = positionX - 20;
    this.positionY = positionY + 20;
    this.drawable = true;
  }
  drawEnemyLaser() {
    eC.drawImage(enemyLaser, this.positionX, this.positionY);
    this.positionX -= 8;
  }
  drawableCheck() {
    if ((this.positionX - player.positionX <= 50 && this.positionX - player.positionX >= 0) &&
      (this.positionY - player.positionY >= 0 && this.positionY - player.positionY <= 42) &&
      player.isAlive) {
      this.drawable = false
      player.isAlive = false;
      explosion(player.positionX - 40, player.positionY - 40, 0);
    }
  }
}

let player = new Player();
let spawnerSpeed: number = 2000;
let e: number = 0;
let enemies: any = [];
let pl: number = 0;
let playerLasers: any = [];
let el: number = 0;
let enemyLasers: any = [];
let playerPoints: number = 0;

// ----------------------------------------------------------------
// Auto update functions
// ----------------------------------------------------------------

function titleScreen() {
  explosionC.drawImage(title, 0, 0);
  setTimeout(function () {
    explosionC.clearRect(0, 0, 800, 600);
    menuScreen();
  }, 2000);
}

function menuScreen() {
  bbgC.clearRect(0, 0, 800, 600);
  fbgC.clearRect(0, 0, 800, 600);
  pC.clearRect(0, 0, 800, 600);
  eC.clearRect(0, 0, 800, 600);
  explosionC.clearRect(0, 0, 800, 600);
  bbgC.fillStyle = "#282b47";
  bbgC.fillRect(0, 0, 800, 600);
  bbgC.font = "30px Impact";
  bbgC.fillStyle = '#F4861F';
  bbgC.fillText(`Use the arrow keys for movement and R to shoot`, 120, 100);
  buttonHolder.style.zIndex = '1';
  backbgCanvas.style.zIndex = '-1';
  frontbgCanvas.style.zIndex = '-1';
  playerCanvas.style.zIndex = '-1';
  enemyCanvas.style.zIndex = '-1';
  explosionCanvas.style.zIndex = '-1';
}

function startGame() {
  buttonHolder.style.zIndex = '-1';
  backbgCanvas.style.zIndex = '1';
  frontbgCanvas.style.zIndex = '1';
  playerCanvas.style.zIndex = '1';
  enemyCanvas.style.zIndex = '1';
  explosionCanvas.style.zIndex = '1';
  setInterval(update, 1000 / 30);
  setInterval(spawnEnemy, spawnerSpeed);
  setInterval(enemyFire, 1000);
}

function update() {
  if (playerPoints >= 50) {
    spawnerSpeed = 500;
  } else if (playerPoints >= 25) {
    spawnerSpeed = 1000;
  }

  if (!player.isAlive) {
    explosionC.font = "70px Impact";
    explosionC.fillStyle = '#F4861F';
    explosionC.fillText(`GAME OVER`, 380, 250);
    explosionC.font = "30px Impact";
    explosionC.fillText(`Press R to return to Main Menu`, 345, 320);
  }

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

  pC.clearRect(0, 0, 800, 600);
  eC.clearRect(0, 0, 800, 600);
  if (player.isAlive) {
    player.createPlayer();
  }
  eC.font = "30px Impact";
  eC.fillStyle = '#F4861F';
  eC.fillText(`Invaders destroyed: ${playerPoints}`, 30, 50);

  playerLasers.forEach(element => {
    if (element.positionX > 800) {
      element.drawable = false;
    }
    if (element.drawable) {
      element.drawPlayerLaser();
    };
  });

  enemies.forEach(element => {
    if ((element.positionX <= -40 && element.positionY <= 630) ||
      (element.positionX <= -40 && element.positionY >= -30)) {
      element.isAlive = false
    }
    if (element.isAlive) {
      element.isAliveCheck();
      element.drawEnemy();
    }
  });

  enemyLasers.forEach(element => {
    if (element.positionX < -20) {
      element.drawable = false;
    }
    if (element.drawable) {
      element.drawableCheck();
      element.drawEnemyLaser();
    }
  });
}

function spawnEnemy() {
  enemies.push(`enemyShip${e}`);
  enemies[e] = new Enemy();
  e++;
}

function enemyFire() {
  enemies.forEach(element => {
    if (element.isAlive) {
      element.fireLaser();
    }
  });
}

function explosion(x: number, y: number, i: number) {
  let LoopCount: number = 8;
  explosionC.drawImage(explosionSprite, i * 64, 0, 64, 64, x, y, 128, 128);
  setTimeout(function () {
    explosionC.clearRect(0, 0, 800, 600);
  }, 75)
  i++;
  if (i < LoopCount) {
    setTimeout(explosion, 75, x, y, i)
  }
}

// ----------------------------------------------------------------
// Input controls
// ----------------------------------------------------------------

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
    case 82:
      if (player.isAlive) {
        shootLaser();
      } else {
        location.reload();
      }
      break;
  }
}

startButton1.addEventListener('click', startGame);
startButton2.addEventListener('click', startGame);
startButton3.addEventListener('click', startGame);
exitButton.onclick = function () {
  location.href = 'https://playerdrivendevelopment.wordpress.com/';
};

