import Player from "./Player.js";
import Ground from "./ground.js";
import CactusController from "./CactusController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
const PLAYER_WIDTH = 88 / 1.5;
const PLAYER_HEIGHT = 94 / 1.5;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_CACTUS_SPEED = 0.5;
const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;
const CACTUS_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: "images/cactus_1.png" },
  { width: 98 / 1.5, height: 100 / 1.5, image: "images/cactus_2.png" },
  { width: 68 / 1.5, height: 70 / 1.5, image: "images/cactus_3.png" },
];
let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let player = null;
let ground = null;
let cactusController = null;
let gameOver = false;
let hasAddedEventListenerForRestart = false;
let waitingToStart = true;
function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;
  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );
  ground = new Ground(
    ctx,
    groundWidthInGame,
    groundHeightInGame,
    GROUND_AND_CACTUS_SPEED,
    scaleRatio,
  );
  const CactusImages = CACTUS_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image: image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });
  cactusController = new CactusController(
    ctx,
    CactusImages,
    scaleRatio,
    GROUND_AND_CACTUS_SPEED,
  );
}
function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}
setScreen();
window.addEventListener("resize", () => setTimeout(setScreen, 500));
if (screen.orientation) {
  screen.orientation.addEventListener("change", setScreen);
}
function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight,
  );
  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth,
  );
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}
function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "red";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);
}
function setupGameReset() {
  if (!hasAddedEventListenerForRestart) {
    hasAddedEventListenerForRestart = true;
    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}
function reset() {
  hasAddedEventListenerForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  cactusController.reset();
  gameSpeed = GAME_SPEED_START;
}
function clearScreen() {
  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;
  clearScreen();
  if (!gameOver && !waitingToStart) {
    ground.update(gameSpeed, frameTimeDelta);
    cactusController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }
  if (!gameOver && cactusController.collideWith(player)) {
    gameOver = true;
    setupGameReset();
  }
  ground.draw();
  cactusController.draw();
  player.draw();
  if (gameOver) {
    showGameOver();
  }
  if (waitingToStart) {
    showStartGameText();
  }
  function showStartGameText() {
    const fontSize = 40 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "red";
    const x = canvas.width / 14;
    const y = canvas.height / 2;
    ctx.fillText("Tap Screen or Press Space To Start", x, y);
  }
  function updateGameSpeed() {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
  }
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });
