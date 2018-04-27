// Enemies our player must avoid
var Enemy = function(x, y, speed) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;
  this.speed = speed;
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += dt * this.speed;
  this.didCollide();
  // If enemy moves outside the screen, make him "reflow" back to the start
  if (this.x >= 505) {
    this.x = -70;
    // Randomizes speed of enemies as long as the speed is lower than 300
    while((this.speed = Math.random() * 400) < 300) {
      this.speed = Math.random() * 400;
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// If the enemy hits the player reset his position, score and remove additional enemies
// Collision algorithm 'Axis-Aligned Bounding Box' from:
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Enemy.prototype.didCollide = function() {
  if (player.x < this.x + 75 &&
      player.x + 60 > this.x &&
      player.y < this.y + 72 &&
      player.y + 78 > this.y) {
    console.log('U got hit!');
    player.x = 203;
    player.y = 390;
    lives--;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.x = 203;
  this.y = 390;
  this.sprite = 'images/char-boy.png';
};

// Update player's position, makes sure player can't move off screen,
// besides the top part. If player reached water call levelUp method
Player.prototype.update = function() {
  if ((this.x) <= 0) {
    this.x += 100;
  };
  if ((this.x) >= 420) {
    this.x -= 100;
  };
  if (this.y <= -30) {
    this.y += 83;
    this.levelUp();
    console.log('Next level');
  };
  if ((this.y) >= 400) {
    this.y -= 83;
  };
};

// Checks which key was pressed and moves the player in that direction
// Different values (horizontal/vertical) so player moves from middle to middle of the 'block'
// "R" to reset the game
Player.prototype.handleInput = function(pressedKey) {
  if (pressedKey === 'left') {
    this.x -= 100;
  };
  if (pressedKey === 'right') {
    this.x += 100;
  };
  if (pressedKey === 'up') {
    this.y -= 83;
  };
  if (pressedKey === 'down') {
    this.y += 83;
  };
  if (pressedKey === 'r') {
    this.reset(203, 390);
    allEnemies.push(enemy, enemy1, enemy2);
    score = 0;
    lvl = 1;
    lives = 2;
  }
};

// Small method that allows to move the player to x, y position, remove all enemies and collectibles
// Just so the code inside doesn't have to be repeated
Player.prototype.reset = function(x, y) {
  this.x = x;
  this.y = y;
  allEnemies = [];
  allCollectibles = [];
};

// Draw the player on the screen, current score, level and amount of lives
// In case of losing all lives/beating 10 levels, draw proper message and remove player off of canvas
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

  if (lvl > 10) {
    this.reset(700, 700);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 50, 505, 606);
    this.msgs('Your score: ' + score, '26px', '#FFF', 120, 200);
    this.msgs('You won!', '60px', '#00c30e', 65, 290);
    this.msgs('PRESS *R* TO PLAY AGAIN', '22px', '#00c30e', 50, 330);
  } else {
    this.msgs('Score: ' + score, '26px', '#FFF', 15, 90);
    this.msgs('Level: ' + lvl, '26px', '#FFF', 350, 90);
    this.msgs('Lives: ' + lives, '26px', '#FFF', 15, 530);
  };
  if (lives < 1) {
    this.reset(700, 700);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 50, 505, 606);
    this.msgs('You lost!', '60px', '#ab0000', 65, 290);
    this.msgs('PRESS *R* TO PLAY AGAIN', '22px', '#ab0000', 50, 330);
  };
};

// Generate text with border
Player.prototype.msgs = function(text, size, color, x, y) {
  ctx.font = size + ' Chango';
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
};

// Once player reaches water, reset his position, add 100 points
// and remove not picked up collectibles
// Every 2nd level add a gem, every 3rd level add a heart and another enemy
// Their positions are randomized from the arrays
Player.prototype.levelUp = function() {
  this.x = 203;
  this.y = 390;
  score = score + 100;
  lvl++;
  allCollectibles = [];

  var collectibleX = [25, 125, 225, 325, 425];
  var collectibleY = [115, 195, 280];
  var enemyPos = [140, 60, 220];

  if (lvl % 2 === 0) {
    var gemRandomX = collectibleX[Math.floor(Math.random() * collectibleX.length)];
    var gemRandomY = collectibleY[Math.floor(Math.random() * collectibleY.length)];
    var addGem = new Collectibles(gemRandomX, gemRandomY, 'gem');
    allCollectibles.push(addGem);
  };
  if (lvl % 3 === 0) {
    var randomPos = enemyPos[Math.floor(Math.random() * enemyPos.length)];
    var enemyX = new Enemy(-70, randomPos, 300);
    allEnemies.push(enemyX);

    var heartRandomX = collectibleX[Math.floor(Math.random() * collectibleX.length)];
    var heartRandomY = collectibleY[Math.floor(Math.random() * collectibleY.length)];
    var addHeart = new Collectibles(heartRandomX, heartRandomY, 'heart');
    allCollectibles.push(addHeart);
  };
};

// Collectibles class
// depending on which type is passed when creating new objects,
// chooses proper image to be rendered
var Collectibles = function(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
  if (type === 'gem') {
    this.sprite = 'images/gem-blue.png';
  };
  if (type === 'heart') {
    this.sprite = 'images/heart.png';
  };
};

// Render collectibles, resize them
Collectibles.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 55, 90);
};

Collectibles.prototype.update = function() {
  this.didCollide();
};

// Method that checks if collectible got picked up
// If it's a gem add 200 points, if heart add 1 life
// and remove them from canvas by getting their indexes
Collectibles.prototype.didCollide = function() {
  if (player.x < this.x + 75 &&
      player.x + 60 > this.x &&
      player.y < this.y &&
      player.y + 78 > this.y) {
        if (this.type === 'gem') {
          console.log('+200 points');
          score += 200;
          var gemIndex = allCollectibles.indexOf(this);
          allCollectibles.splice(gemIndex, 1);
        };
        if (this.type === 'heart') {
          console.log('+1 life');
          lives++;
          var heartIndex = allCollectibles.indexOf(this);
          allCollectibles.splice(heartIndex, 1);
        };
  }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy = new Enemy(150, 220, 350);
var enemy1 = new Enemy(-70, 140, 300);
var enemy2 = new Enemy(300, 60, 300);

var allEnemies = [];
var allCollectibles = [];

var player = new Player();

var score = 0;
var lvl = 1;
var lives = 2;

allEnemies.push(enemy, enemy1, enemy2);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        82: 'r'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
