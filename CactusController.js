import Cactus from "./Cactus.js";
export default class CactusController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;
  nextCactusInterval = null;
  cactus = [];
  constructor(ctx, cactusImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactusImages = cactusImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
  }
  setNextCactusTime() {
    const num = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX,
    );
    this.nextCactusInterval = num;
  }
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  createCactus() {
    const index = this.getRandomNumber(0, this.cactusImages.length - 1);
    const cactusImage = this.cactusImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - cactusImage.height;
    const cactus = new Cactus(
      this.ctx,
      x,
      y,
      cactusImage.width,
      cactusImage.height,
      cactusImage.image,
    );
    this.cactus.push(cactus);
  }
  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactusInterval === null || this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;
    this.cactus.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });
    this.cactus = this.cactus.filter((cactus) => cactus.x > -cactus.width);
  }
  draw() {
    this.cactus.forEach((cactus) => cactus.draw());
  }
  collideWith(sprite) {
    return this.cactus.some((cactus) => cactus.collideWith(sprite));
  }
}
