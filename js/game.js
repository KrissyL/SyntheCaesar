let config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [SceneMainMenu, SceneMain, SceneGameOver],
  pixelArt: true,
  roundPixels: true
};

let game = new Phaser.Game(config);
