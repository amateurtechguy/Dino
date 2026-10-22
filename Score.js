export default class Score {
  score = 0;
  HIGH_SCORE_KEY = "highScore";
  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }
  update(frameTimeDelta) {
    this.score += frameTimeDelta * 0.01;
  }
  reset() {
    this.score = 0;
  }
  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }
  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 24 * this.scaleRatio;
    const fontSize = 18 * this.scaleRatio;
    const margin = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = "#020202";
    const scorePadded = Math.floor(this.score).toString().padStart(6, "0");
    const highScorePadded = highScore.toString().padStart(6, "0");
    this.ctx.textAlign = "left";
    this.ctx.fillText(`HIGHSCORE ${highScorePadded}`, margin, y);
    this.ctx.textAlign = "right";
    this.ctx.fillText(scorePadded, this.canvas.width - margin, y);
    this.ctx.textAlign = "left";
  }
}
