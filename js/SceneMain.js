class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }

  preload() {
    this.load.image("sprPlayer", "content/sprPlayer.png");
    this.load.image("brickYellow", "content/brickYellow.png");
    this.load.image("brickGreen", "content/brickGreen.png");
    this.load.image("brickBlue", "content/brickBlue.png");
    this.load.image("brickPurple", "content/brickPurple.png");
  }

  create() {
    // this.anims.create({
    //   key: "sprPlayer",
    //   frames: this.anims.generateFrameNumbers("sprPlayer"),
    //   frameRate: 20,
    //   repeat: -1
    // });

    this.add.image(config.width * 0.5, config.height * 0.9, "sprPlayer");

    this.background = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      "background"
    );

    this.background.setOrigin(0, 0);

    this.brick1 = this.add.image(400, 0, "brickYellow");
    this.brick2 = this.add.image(650, 0, "brickGreen");
    this.brick3 = this.add.image(400, 0, "brickBlue");
    this.brick4 = this.add.image(650, 0, "brickPurple");

    //  The score
    let score = 0;
    this.scoreText = this.add.text(16, 16, "SCORE: " + score, {
      fontSize: "32px",
      fill: "#DC143C"
    });

    this.scoreText;

    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.98,
      "sprPlayer"
    );
    console.log(this.player);

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update() {
    //Check's if the player if alive, if not it will show the game over screen
    if (!this.player.getData("isDead")) {
      this.player.update();
      if (this.keyA.isDown) {
        this.player.moveLeft();
      } else if (this.keyD.isDown) {
        this.player.moveRight();
      }
    }

    this.score += 10;

    this.moveBrick1(this.brick1, 3);

    this.time.addEvent({
      delay: 1000,
      callback: function() {
        this.moveBrick2(this.brick2, 3);
      },
      callbackScope: this,
      loop: false
    });

    this.time.addEvent({
      delay: 2000,
      callback: function() {
        this.moveBrick1(this.brick3, 3);
      },
      callbackScope: this,
      loop: false
    });

    this.time.addEvent({
      delay: 3000,
      callback: function() {
        this.moveBrick2(this.brick4, 3);
      },
      callbackScope: this,
      loop: false
    });

    this.time.addEvent({
      delay: 2000,
      callback: function() {
        this.increaseScore(this.score);
      },
      callbackScope: this,
      loop: false
    });

    this.background.tilePositionY -= 1.5;
  }

  //Sets brick's speed
  moveBrick1(brick, speed) {
    brick.y += speed;
    if (brick.y > config.height) {
      this.resetBrickPosition1(brick);
    }
  }

  moveBrick2(brick, speed) {
    brick.y += speed;
    if (brick.y > config.height) {
      this.resetBrickPosition2(brick);
    }
  }

  //Resets brick's position after it reaches the end of a screen
  resetBrickPosition1(brick) {
    brick.y = 0;
    brick.x = 400;
  }

  resetBrickPosition2(brick) {
    brick.y = 0;
    brick.x = 650;
  }

  increaseScore(item) {
    item += 10;
  }
}
