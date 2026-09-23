/* =================================
SETH PERCIVAL — THE COOLNESS GAME
================================= */

/* =================================
CURSOR GLOW
================================= */

const cursor = document.getElementById("cursor");

if (cursor) {
document.addEventListener("mousemove", (event) => {
cursor.style.left = event.clientX + "px";
cursor.style.top = event.clientY + "px";
});
}

/* =================================
3D CARD TILT
================================= */

const cards = document.querySelectorAll(".tilt");

cards.forEach((card) => {

card.addEventListener("mousemove", (event) => {

const rect = card.getBoundingClientRect();

const x = event.clientX - rect.left;
const y = event.clientY - rect.top;

const rotateX =
  ((y / rect.height) - 0.5) * -12;

const rotateY =
  ((x / rect.width) - 0.5) * 12;

card.style.transform = `
  perspective(800px)
  rotateX(${rotateX}deg)
  rotateY(${rotateY}deg)
  scale(1.03)
`;


});

card.addEventListener("mouseleave", () => {

card.style.transform = `
  perspective(800px)
  rotateX(0deg)
  rotateY(0deg)
  scale(1)
`;


});

});

/* =================================
GAME ELEMENTS
================================= */

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const startScreen = document.getElementById("startScreen");
const startGameButton = document.getElementById("startGame");

const playAgainButton = document.getElementById("playAgain");

const gameScore = document.getElementById("gameScore");
const comboDisplay = document.getElementById("combo");
const livesDisplay = document.getElementById("lives");
const highScoreDisplay = document.getElementById("highScore");

const finalScore = document.getElementById("finalScore");
const meterFill = document.getElementById("meterFill");
const rankDisplay = document.getElementById("rank");

const gameStatus = document.getElementById("gameStatus");

/* =================================
GAME STATE
================================= */

let gameRunning = false;

let score = 0;
let lives = 3;
let combo = 0;

let playerX = 50;
let playerY = 50;

let keys = {};

let objects = [];

let spawnTimer = null;
let gameLoop = null;

let difficulty = 1;

let highScore =
Number(localStorage.getItem("sethHighScore")) || 0;

/* =================================
INITIAL HUD
================================= */

if (highScoreDisplay) {
highScoreDisplay.textContent = highScore;
}

if (finalScore) {
finalScore.textContent = "0";
}

if (rankDisplay) {
rankDisplay.textContent = "UNRANKED";
}

/* =================================
KEYBOARD CONTROLS
================================= */

document.addEventListener("keydown", (event) => {

const key = event.key.toLowerCase();

if (
[
"arrowup",
"arrowdown",
"arrowleft",
"arrowright",
"w",
"a",
"s",
"d"
].includes(key)
) {
event.preventDefault();
}

keys[key] = true;

});

document.addEventListener("keyup", (event) => {

keys[event.key.toLowerCase()] = false;

});

/* =================================
START GAME
================================= */

if (startGameButton) {

startGameButton.addEventListener(
"click",
startGame
);

}

if (playAgainButton) {

playAgainButton.addEventListener(
"click",
startGame
);

}

function startGame() {

if (!gameArea || !player) return;

stopGame();

gameRunning = true;

score = 0;
lives = 3;
combo = 0;
difficulty = 1;

playerX = 50;
playerY = 50;

player.style.left = playerX + "%";
player.style.top = playerY + "%";

startScreen.style.display = "none";

gameStatus.textContent =
"GO! Collect coolness and avoid the cringe.";

updateHUD();

clearObjects();

gameLoop = requestAnimationFrame(updateGame);

startSpawning();

}

/* =================================
STOP GAME
================================= */

function stopGame() {

gameRunning = false;

if (spawnTimer) {
clearTimeout(spawnTimer);
spawnTimer = null;
}

if (gameLoop) {
cancelAnimationFrame(gameLoop);
gameLoop = null;
}

}

/* =================================
GAME LOOP
================================= */

function updateGame() {

if (!gameRunning) return;

movePlayer();

moveObjects();

checkCollisions();

difficulty =
1 + Math.floor(score / 250);

gameLoop =
requestAnimationFrame(updateGame);

}

/* =================================
PLAYER MOVEMENT
================================= */

function movePlayer() {

const speed = 0.65;

if (
keys["arrowleft"] ||
keys["a"]
) {
playerX -= speed;
}

if (
keys["arrowright"] ||
keys["d"]
) {
playerX += speed;
}

if (
keys["arrowup"] ||
keys["w"]
) {
playerY -= speed;
}

if (
keys["arrowdown"] ||
keys["s"]
) {
playerY += speed;
}

/*
Keep player inside the arena.
*/

playerX =
Math.max(
4,
Math.min(96, playerX)
);

playerY =
Math.max(
8,
Math.min(92, playerY)
);

player.style.left =
playerX + "%";

player.style.top =
playerY + "%";

}

/* =================================
SPAWN OBJECTS
================================= */

function startSpawning() {

if (!gameRunning) return;

spawnObject();

const delay =
Math.max(
250,
850 - difficulty * 70
);

spawnTimer =
setTimeout(
startSpawning,
delay
);

}

/* =================================
CREATE OBJECT
================================= */

function spawnObject() {

if (!gameArea || !gameRunning) return;

const object =
document.createElement("div");

const isBad =
Math.random() < 0.27;

let emoji;

if (isBad) {

const badEmojis = [
  "💀",
  "🤡",
  "🤢",
  "🥱",
  "📉",
  "🙃"
];

emoji =
  badEmojis[
    Math.floor(
      Math.random() * badEmojis.length
    )
  ];


} else {

const goodEmojis = [
  "😎",
  "🔥",
  "⚡",
  "🏆",
  "✨",
  "🚀",
  "👑",
  "💎"
];

emoji =
  goodEmojis[
    Math.floor(
      Math.random() * goodEmojis.length
    )
  ];


}

object.textContent = emoji;

object.className =
isBad
? "game-object bad-object"
: "game-object good-object";

/*
Random starting position.
*/

const x =
7 + Math.random() * 86;

const y = -8;

object.style.left =
x + "%";

object.style.top =
y + "%";

gameArea.appendChild(object);

const gameObject = {
element: object,
x: x,
y: y,
speed:
0.12 +
Math.random() * 0.12 +
difficulty * 0.018,
bad: isBad
};

objects.push(gameObject);

}

/* =================================
MOVE OBJECTS
================================= */

function moveObjects() {

objects.forEach((object) => {

object.y += object.speed;

object.element.style.top =
  object.y + "%";


});

/*
Remove objects that leave
the bottom of the arena.
*/

objects =
objects.filter((object) => {

  if (object.y > 110) {

    object.element.remove();

    return false;
  }

  return true;

});


}

/* =================================
COLLISION DETECTION
================================= */

function checkCollisions() {

const playerSize = 6;

objects.forEach((object) => {

const distance =
  Math.sqrt(
    Math.pow(
      playerX - object.x,
      2
    ) +
    Math.pow(
      playerY - object.y,
      2
    )
  );


if (distance < playerSize) {

  collectObject(object);

}


});

}

/* =================================
COLLECT OBJECT
================================= */

function collectObject(object) {

if (!object.element.parentNode) {
return;
}

object.element.remove();

if (object.bad) {

/*
   HIT BY CRINGE
*/

lives--;

combo = 0;

gameStatus.textContent =
  "💀 CRINGE DETECTED! COMBO DESTROYED.";

flashGame("red");

updateHUD();


if (lives <= 0) {

  endGame();

}


} else {

/*
   COLLECT COOLNESS
*/

combo++;

const multiplier =
  Math.min(
    10,
    Math.max(
      1,
      Math.floor(combo / 3) + 1
    )
  );

const points =
  10 * multiplier;

score += points;

gameStatus.textContent =
  `🔥 +${points} COOLNESS! ${multiplier}x MULTIPLIER`;

flashGame("cyan");

updateHUD();


}

objects =
objects.filter(
item => item !== object
);

}

/* =================================
GAME FLASH
================================= */

function flashGame(color) {

if (!gameArea) return;

gameArea.classList.remove(
"flash-red",
"flash-cyan"
);

void gameArea.offsetWidth;

gameArea.classList.add(
color === "red"
? "flash-red"
: "flash-cyan"
);

}

/* =================================
UPDATE HUD
================================= */

function updateHUD() {

if (gameScore) {
gameScore.textContent =
score;
}

if (comboDisplay) {
comboDisplay.textContent =
combo + "x";
}

if (livesDisplay) {
livesDisplay.textContent =
lives;
}

if (highScoreDisplay) {
highScoreDisplay.textContent =
highScore;
}

}

/* =================================
END GAME
================================= */

function endGame() {

stopGame();

clearObjects();

gameStatus.textContent =
"💀 GAME OVER. The cringe was too powerful.";

if (score > highScore) {

highScore = score;

localStorage.setItem(
  "sethHighScore",
  highScore
);

gameStatus.textContent =
  "🏆 NEW HIGH SCORE! SETH HAS ASCENDED.";


}

updateHUD();

showFinalScore();

}

/* =================================
FINAL SCORE
================================= */

function showFinalScore() {

if (finalScore) {

finalScore.textContent =
  score;


}

if (meterFill) {

/*
   Convert score into a percentage.
   1000 points = maximum meter.
*/

const percentage =
  Math.min(
    100,
    Math.round(
      (score / 1000) * 100
    )
  );

meterFill.style.width =
  percentage + "%";


}

if (rankDisplay) {

rankDisplay.textContent =
  getRank(score);


}

}

/* =================================
RANK SYSTEM
================================= */

function getRank(score) {

if (score >= 2500) {
return "👑 SETH GOD";
}

if (score >= 1500) {
return "🔥 CERTIFIED LEGEND";
}

if (score >= 1000) {
return "😎 EXTREMELY COOL";
}

if (score >= 750) {
return "⚡ VERY COOL";
}

if (score >= 500) {
return "🔥 COOL";
}

if (score >= 250) {
return "🙂 KINDA COOL";
}

if (score > 0) {
return "🥴 GETTING THERE";
}

return "💀 UNRANKED";

}

/* =================================
CLEAR OBJECTS
================================= */

function clearObjects() {

objects.forEach((object) => {

if (object.element) {
  object.element.remove();
}


});

objects = [];

}

/* =================================
SECRET BUTTON
================================= */

const secretButton =
document.getElementById(
"secretButton"
);

const secretMessage =
document.getElementById(
"secretMessage"
);

if (
secretButton &&
secretMessage
) {

secretButton.addEventListener(
"click",
revealSecret
);

}

function revealSecret() {

secretMessage.style.display =
"block";

document.body.classList.add(
"rainbow-mode"
);

secretButton.textContent =
"😎 YOU HAVE BEEN WARNED 😎";

secretButton.disabled =
true;

createEmojiExplosion();

}

/* =================================
EMOJI EXPLOSION
================================= */

function createEmojiExplosion() {

const emojis = [
"😎",
"🔥",
"⚡",
"🗿",
"🚀",
"✨",
"💀",
"🏆",
"👑",
"💎"
];

for (let i = 0; i < 50; i++) {

const emoji =
  document.createElement("div");

emoji.textContent =
  emojis[
    Math.floor(
      Math.random() *
      emojis.length
    )
  ];

emoji.style.position =
  "fixed";

emoji.style.left =
  Math.random() * 100 +
  "vw";

emoji.style.top =
  "-50px";

emoji.style.fontSize =
  20 +
  Math.random() * 35 +
  "px";

emoji.style.zIndex =
  "9999";

emoji.style.pointerEvents =
  "none";


document.body.appendChild(
  emoji
);


const duration =
  2000 +
  Math.random() * 3000;

const rotation =
  360 +
  Math.random() * 720;


const animation =
  emoji.animate(
    [
      {
        transform:
          "translateY(0) rotate(0deg)",
        opacity: 1
      },

      {
        transform:
          `translateY(110vh) rotate(${rotation}deg)`,
        opacity: 0
      }
    ],
    {
      duration,
      easing: "linear"
    }
  );


animation.onfinish = () => {
  emoji.remove();
};


}

}

/* =================================
SMOOTH NAVIGATION
================================= */

document
.querySelectorAll(
'a[href^="#"]'
)
.forEach((link) => {

link.addEventListener(
  "click",
  (event) => {

    const targetId =
      link.getAttribute("href");

    const target =
      document.querySelector(
        targetId
      );

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }
);


});

/* =================================
EXTRA CARD GLOW
================================= */

cards.forEach((card) => {

card.addEventListener(
"mouseenter",
() => {

  card.style.boxShadow =
    "0 20px 60px rgba(0, 234, 255, 0.2)";

}


);

card.addEventListener(
"mouseleave",
() => {

  card.style.boxShadow =
    "";

}


);

});

/* =================================
CONSOLE EASTER EGG
================================= */

console.log(
"%c😎 SETH PERCIVAL 😎",
"font-size: 30px; font-weight: bold; color: #ff32d0;"
);

console.log(
"%cSETH SURVIVAL SYSTEM ONLINE.",
"font-size: 16px; color: #00eaff;"
);

console.log(
"%cObjective: Become ridiculously cool.",
"font-size: 14px; color: #ffea00;"
);

console.log(
"%cControls: WASD / Arrow Keys",
"font-size: 14px; color: #7c3cff;"
);
