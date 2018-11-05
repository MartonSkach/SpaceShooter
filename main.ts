"use strict";

window.onload = function () {
  setInterval(update, 1000 / 30);
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
  player.createPlayer();

  playerLasers.forEach(element => {
    element.drawPlayerLaser();
  });
}

abstract class gameObjects {
  type: string;
  isAlive: boolean;
  constructor(type: string, isAlive: boolean) {
    this.type = type;
    this.isAlive = isAlive;
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

class EnemyLaser {
  positionX: number;
  positionY: number;
  constructor() {
    this.positionX = enemyArray[e].positionX - 40;
    this.positionY = enemyArray[e].positionY + 30;
  }
  drawPlayerLaser() {
    if (this.positionX > -20) {
      pC.drawImage(playerLaser, this.positionX, this.positionY);
      this.positionX -= 10;
    }
  }
}

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

let player = new Player();
let l: number = 0;
let playerLasers: any = [];

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
      console.log('space');
      playerLasers.push(`playerLaserElement${l}`);
      playerLasers[l] = new PlayerLaser();
      console.log(playerLasers[l]);
      l++;
      break;
  }
}


