'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
window.onload = function () {
    titleScreen();
};
var backbgCanvas = document.querySelector('.back-bg');
var frontbgCanvas = document.querySelector('.front-bg');
var playerCanvas = document.querySelector('.player-area');
var enemyCanvas = document.querySelector('.enemy-area');
var explosionCanvas = document.querySelector('.explosion-area');
var bbgC = backbgCanvas.getContext('2d');
var fbgC = frontbgCanvas.getContext('2d');
var pC = playerCanvas.getContext('2d');
var eC = enemyCanvas.getContext('2d');
var explosionC = explosionCanvas.getContext('2d');
var backBg = document.getElementById('back-bg');
var frontBg = document.getElementById('front-bg');
var playerCharacter = document.getElementById('player');
var playerLaser = document.getElementById('player-laser');
var enemyCharacter = document.getElementById('enemy');
var enemyLaser = document.getElementById('enemy-laser');
var explosionSprite = document.getElementById('explosion_sprite');
var title = document.getElementById('title');
var startButton1 = document.querySelector('#button1');
var startButton2 = document.querySelector('#button2');
var startButton3 = document.querySelector('#button3');
var exitButton = document.querySelector('.exitButton');
var buttonHolder = document.querySelector('.button-holder');
var backBackgroundPosition1 = 0;
var backBackgroundPosition2 = 800;
var frontBackgroundPosition1 = 0;
var frontBackgroundPosition2 = 800;
// ----------------------------------------------------------------
// Game Objects
// ----------------------------------------------------------------
var gameObjects = /** @class */ (function () {
    function gameObjects(type) {
        this.type = type;
        this.isAlive = true;
    }
    return gameObjects;
}());
// ----------------------------------------------------------------
// Player Objects
// ----------------------------------------------------------------
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 'Player') || this;
        _this.positionX = 50;
        _this.positionY = 290;
        return _this;
    }
    Player.prototype.createPlayer = function () {
        pC.drawImage(playerCharacter, this.positionX, this.positionY);
    };
    Player.prototype.movementUp = function () {
        if (this.positionY - 5 > -20) {
            this.positionY = this.positionY - 4;
        }
    };
    Player.prototype.movementDown = function () {
        if (this.positionY + 5 < 555) {
            this.positionY = this.positionY + 4;
        }
    };
    Player.prototype.movementLeft = function () {
        if (this.positionX - 5 > -10) {
            this.positionX = this.positionX - 4;
        }
    };
    Player.prototype.movementRight = function () {
        if (this.positionX + 5 < 755) {
            this.positionX = this.positionX + 4;
        }
    };
    Player.prototype.Update = function () {
        if (Key.isDown(Key.UP))
            this.movementUp();
        if (Key.isDown(Key.LEFT))
            this.movementLeft();
        if (Key.isDown(Key.DOWN))
            this.movementDown();
        if (Key.isDown(Key.RIGHT))
            this.movementRight();
        if (Key.isDown(Key.SHOOT))
            shootLaser();
    };
    return Player;
}(gameObjects));
var PlayerLaser = /** @class */ (function () {
    function PlayerLaser() {
        this.positionX = player.positionX + 40;
        this.positionY = player.positionY + 30;
        this.drawable = true;
    }
    ;
    PlayerLaser.prototype.drawPlayerLaser = function () {
        pC.drawImage(playerLaser, this.positionX, this.positionY);
        this.positionX += 10;
    };
    ;
    return PlayerLaser;
}());
function shootLaser() {
    if (laserAvailable) {
        playerLasers.push("playerLaserElement" + pl);
        playerLasers[pl] = new PlayerLaser();
        pl++;
        laserAvailable = false;
    }
}
// ----------------------------------------------------------------
// Enemy objects
// ----------------------------------------------------------------
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super.call(this, 'Enemy') || this;
        _this.positionX = 840;
        _this.positionY = Math.floor(Math.random() * (555 - (-20))) + (-20);
        _this.speedX = Math.random() * (3 - 1) + 1;
        _this.speedY = Math.random() * (1 - 0) + 0;
        _this.randomizer = Math.floor(Math.random() * (100 - 0)) + 0;
        return _this;
    }
    Enemy.prototype.drawEnemy = function () {
        eC.drawImage(enemyCharacter, this.positionX, this.positionY);
        this.positionX = this.positionX - this.speedX;
        if (this.randomizer >= 50) {
            this.positionY = this.positionY - this.speedY;
        }
        else {
            this.positionY = this.positionY + this.speedY;
        }
    };
    Enemy.prototype.fireLaser = function () {
        if (this.positionY - player.positionY <= 25 && this.positionY - player.positionY >= -25) {
            enemyLasers.push("enemyLaserElement" + el);
            enemyLasers[el] = new EnemyLaser(this.positionX, this.positionY);
            el++;
        }
    };
    Enemy.prototype.isAliveCheck = function () {
        var _this = this;
        playerLasers.forEach(function (element) {
            if ((element.positionX - _this.positionX >= -20 && element.positionX - _this.positionX <= 10) &&
                (element.positionY - _this.positionY >= -10 && element.positionY - _this.positionY <= 40) &&
                element.drawable) {
                _this.isAlive = false;
                element.drawable = false;
                explosion(_this.positionX - 40, _this.positionY - 40, 0);
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
    };
    return Enemy;
}(gameObjects));
var EnemyLaser = /** @class */ (function () {
    function EnemyLaser(positionX, positionY) {
        this.positionX = positionX - 20;
        this.positionY = positionY + 20;
        this.drawable = true;
    }
    EnemyLaser.prototype.drawEnemyLaser = function () {
        eC.drawImage(enemyLaser, this.positionX, this.positionY);
        this.positionX -= 8;
    };
    EnemyLaser.prototype.drawableCheck = function () {
        if ((this.positionX - player.positionX <= 50 && this.positionX - player.positionX >= 0) &&
            (this.positionY - player.positionY >= 0 && this.positionY - player.positionY <= 42) &&
            player.isAlive) {
            this.drawable = false;
            player.isAlive = false;
            explosion(player.positionX - 40, player.positionY - 40, 0);
        }
    };
    return EnemyLaser;
}());
var player = new Player();
var spawnerSpeed = 2000;
var e = 0;
var enemies = [];
var pl = 0;
var playerLasers = [];
var el = 0;
var enemyLasers = [];
var playerPoints = 0;
var laserAvailable = true;
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
    bbgC.fillText("Use the arrow keys for movement and R to shoot", 120, 100);
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
    setInterval(checkAmmo, 400);
}
function reloadWeapon() {
    laserAvailable = true;
}
function checkAmmo() {
    if (!laserAvailable) {
        setTimeout(reloadWeapon, 400);
    }
}
function update() {
    player.Update();
    if (playerPoints >= 50) {
        spawnerSpeed = 500;
    }
    else if (playerPoints >= 25) {
        spawnerSpeed = 1000;
    }
    if (!player.isAlive) {
        explosionC.font = "70px Impact";
        explosionC.fillStyle = '#F4861F';
        explosionC.fillText("GAME OVER", 380, 250);
        explosionC.font = "30px Impact";
        explosionC.fillText("Press R to return to Main Menu", 345, 320);
    }
    // Drawing the slower moving, back layer of the background
    if (backBackgroundPosition1 >= -1600) {
        bbgC.drawImage(backBg, backBackgroundPosition1, 0);
    }
    else if (backBackgroundPosition1 <= -1600 &&
        backBackgroundPosition1 >= -2400) {
        bbgC.drawImage(backBg, backBackgroundPosition1, 0);
        bbgC.drawImage(backBg, backBackgroundPosition2, 0);
        backBackgroundPosition2 -= 0.5;
    }
    else if (backBackgroundPosition1 <= -2400) {
        backBackgroundPosition1 = 0;
        backBackgroundPosition2 = 800;
        bbgC.drawImage(backBg, backBackgroundPosition1, 0);
    }
    backBackgroundPosition1 -= 0.5;
    // Drawing the faster moving, front layer of the background
    if (frontBackgroundPosition1 >= -1600) {
        fbgC.drawImage(frontBg, frontBackgroundPosition1, 0);
    }
    else if (frontBackgroundPosition1 <= -1600 &&
        frontBackgroundPosition1 >= -2400) {
        fbgC.drawImage(frontBg, frontBackgroundPosition1, 0);
        fbgC.drawImage(frontBg, frontBackgroundPosition2, 0);
        frontBackgroundPosition2 -= 2.5;
    }
    else if (frontBackgroundPosition1 <= -2400) {
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
    eC.fillText("Invaders destroyed: " + playerPoints, 30, 50);
    playerLasers.forEach(function (element) {
        if (element.positionX > 800) {
            element.drawable = false;
        }
        if (element.drawable) {
            element.drawPlayerLaser();
        }
        ;
    });
    enemies.forEach(function (element) {
        if ((element.positionX <= -40 && element.positionY <= 630) ||
            (element.positionX <= -40 && element.positionY >= -30)) {
            element.isAlive = false;
        }
        if (element.isAlive) {
            element.isAliveCheck();
            element.drawEnemy();
        }
    });
    enemyLasers.forEach(function (element) {
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
    enemies.push("enemyShip" + e);
    enemies[e] = new Enemy();
    e++;
}
function enemyFire() {
    enemies.forEach(function (element) {
        if (element.isAlive) {
            element.fireLaser();
        }
    });
}
function explosion(x, y, i) {
    var LoopCount = 8;
    explosionC.drawImage(explosionSprite, i * 64, 0, 64, 64, x, y, 128, 128);
    setTimeout(function () {
        explosionC.clearRect(0, 0, 800, 600);
    }, 75);
    i++;
    if (i < LoopCount) {
        setTimeout(explosion, 75, x, y, i);
    }
}
// ----------------------------------------------------------------
// Input controls
// ----------------------------------------------------------------
/*
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
*/
window.addEventListener('keydown', function (event) {
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
            }
            else {
                location.reload();
            }
            break;
    }
}, false);
var Key = {
    _pressed: {},
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHOOT: 82,
    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function (event) {
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
    }
};
window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
startButton1.addEventListener('click', startGame);
exitButton.onclick = function () {
    location.href = 'https://playerdrivendevelopment.wordpress.com/';
};
