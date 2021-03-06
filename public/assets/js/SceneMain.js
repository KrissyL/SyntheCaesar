// import { NONAME } from "dns";

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }

  init(data) {
    this.socket = data.socket;
  }

  preload() {
    this.load.spritesheet("sprExplosion", "assets/content/sprExplosion.png", {
      frameWidth: 56,
      frameHeight: 56
    });
    this.load.spritesheet("circlePress", "assets/content/circlePress.png", {
      frameWidth: 108,
      frameHeight: 91
    });
    this.load.spritesheet("sprPlayer", "assets/content/sprPlayer.png", {
      frameWidth: 84,
      frameHeight: 77
    });
    this.load.image("sprLaserPlayer", "assets/content/sprLaserPlayer.png");
    this.load.spritesheet("sprEnemy0", "assets/content/sprEnemy0.png", {
      frameWidth: 60,
      frameHeight: 80
    });
    this.load.spritesheet("sprEnemy1", "assets/content/sprEnemy1.png", {
      frameWidth: 66,
      frameHeight: 66
    });

    this.load.image("sprLaserEnemy0", "assets/content/sprLaserEnemy0.png");
    this.load.spritesheet("sun", "assets/content/sun.png", {
      frameWidth: 176,
      frameHeight: 224
    });
    this.load.image("note", "assets/content/note.png");
    this.load.image("note2", "assets/content/note2.png");
    this.load.image("note3", "assets/content/note3.png");
    this.load.image("circle", "assets/content/circle.png");
    this.load.image("circle2", "assets/content/circle2.png");
    this.load.image("circle3", "assets/content/circle3.png");
    this.load.audio("sndExplode0", "assets/content/sndExplode0.wav");
    this.load.audio("sndExplode1", "assets/content/sndExplode1.wav");
    this.load.audio("sndLaser", "assets/content/sndLaser.wav");

    this.load.bitmapFont(
      "arcade",
      "assets/content/arcade.png",
      "assets/content/arcade.xml"
    );
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      "background"
    );

    this.background.setOrigin(0, 0);

    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "sprEnemy1",
      frames: this.anims.generateFrameNumbers("sprEnemy1"),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "circlePress",
      frames: this.anims.generateFrameNumbers("circlePress"),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "sprPlayer",
      frames: this.anims.generateFrameNumbers("sprPlayer"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "sun",
      frames: this.anims.generateFrameNumbers("sun"),
      frameRate: 5,
      repeat: -1
    });

    this.sfx = {
      explosions: [
        this.sound.add("sndExplode0"),
        this.sound.add("sndExplode1")
      ],
      laser: this.sound.add("sndLaser")
    };

    //Music creation

    music = this.sound.add("gameMusic");
    music.play();

    //  The score

    name = getUser();

    this.scoreText = this.add
      .bitmapText(16, 16, "arcade", name.toUpperCase() + "'S SCORE: " + score)
      .setTint(0xffffff);

    this.scoreText;

    this.otherScoreText = this.add
      .bitmapText(16, 50, "arcade", "THEIR SCORE: " + theirScore)
      .setTint(0xffffff);

    this.otherScoreText.visible = false;

    this.gameOverText = this.add.text(512, 384, "GAME OVER", {
      fontFamily: "Roboto Condensed",
      fontSize: "60px",
      fill: "#fff",
      align: "center"
    });
    this.gameOverText.setOrigin(0.5);

    this.gameOverText.visible = false;

    this.winText = this.add.text(512, 350, "YOU WIN! KEEP GOING!", {
      fontFamily: "Roboto Condensed",
      fontSize: "60px",
      fill: "#fff",
      align: "center"
    });
    this.winText.setOrigin(0.5);

    this.winText.visible = false;

    this.enemies = this.add.group();
    this.playerLasers = this.add.group();
    this.enemyLasers = this.add.group();

    //Spawns meteoroid
    this.time.addEvent({
      delay: 1300,
      callback: function() {
        this.time.addEvent({
          delay: 3000,
          callback: function() {
            let enemy = null;
            enemy = new Meteoroid(
              this,
              Phaser.Math.Between(700, 1000),
              0,
              "sprEnemy0"
            );

            if (enemy !== null) {
              enemy.setScale(Phaser.Math.Between(10, 14) * 0.1);
              this.enemies.add(enemy);
            }
          },
          callbackScope: this,
          loop: true
        });
      },
      callbackScope: this,
      loop: null
    });

    //Spawns rock chaser
    this.time.addEvent({
      delay: 1300,
      callback: function() {
        this.time.addEvent({
          delay: 4000,
          callback: function() {
            let enemy = null;
            enemy = new ChasingRock(
              this,
              Phaser.Math.Between(700, 1000),
              0,
              "sprEnemy1"
            );

            if (enemy !== null) {
              enemy.setScale(Phaser.Math.Between(8, 12) * 0.1);
              this.enemies.add(enemy);
            }
          },
          callbackScope: this,
          loop: true
        });
      },
      callbackScope: this,
      loop: null
    });

    this.player = new Player(
      this,
      this.game.config.width * 0.8,
      this.game.config.height * 0.9,
      "sprPlayer"
    );

    this.sun = new Sun(
      this,
      this.game.config.width * 0.87,
      this.game.config.height * 0.17,
      "sun"
    );

    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.objects = this.physics.add.group();

    let circle = this.physics.add.image(
      this.game.config.width * 0.1,
      this.game.config.height * 0.9,
      "circle"
    );

    let circle2 = this.physics.add.image(
      this.game.config.width * 0.22,
      this.game.config.height * 0.9,
      "circle2"
    );

    let circle3 = this.physics.add.image(
      this.game.config.width * 0.34,
      this.game.config.height * 0.9,
      "circle3"
    );

    this.notes = this.physics.add.group();

    //Note generator
    this.time.addEvent({
      delay: 4200,
      callback: function() {
        this.time.addEvent({
          delay: 450,
          callback: function() {
            let number = Phaser.Math.Between(1, 27);
            if (number < 6) {
              for (let i = 0; i < 1; i++) {
                let x = 102;
                let y = 0;

                let note = this.notes.create(x, y, "note");
                note.setVelocityY(600);

                note;
              }
            } else if (number > 5 && number < 11) {
              for (let i = 0; i < 1; i++) {
                let x = 225;
                let y = 0;

                let note = this.notes.create(x, y, "note2");
                note.setVelocityY(600);

                note;
              }
            } else if (number > 10 && number < 16) {
              for (let i = 0; i < 1; i++) {
                let x = 348;
                let y = 0;

                let note = this.notes.create(x, y, "note3");
                note.setVelocityY(600);

                note;
              }
            } else if (number > 15 && number < 19) {
              for (let i = 0; i < 1; i++) {
                let x = 102;
                let y = 0;

                let x2 = 348;
                let y2 = 0;

                let note = this.notes.create(x, y, "note");
                let note2 = this.notes.create(x2, y2, "note3");
                note.setVelocityY(600);
                note2.setVelocityY(600);

                [note, note2];
              }
            } else if (number > 18 && number < 22) {
              for (let i = 0; i < 1; i++) {
                let x = 102;
                let y = 0;

                let x2 = 225;
                let y2 = 0;

                let note = this.notes.create(x, y, "note");
                let note2 = this.notes.create(x2, y2, "note2");
                note.setVelocityY(600);
                note2.setVelocityY(600);

                [note, note2];
              }
            } else if (number > 21 && number < 25) {
              for (let i = 0; i < 1; i++) {
                let x = 225;
                let y = 0;

                let x2 = 348;
                let y2 = 0;

                let note = this.notes.create(x, y, "note2");
                let note2 = this.notes.create(x2, y2, "note3");
                note.setVelocityY(600);
                note2.setVelocityY(600);

                [note, note2];
              }
            } else if (number > 25) {
              for (let i = 0; i < 1; i++) {
                let x = 102;
                let y = 0;

                let x2 = 225;
                let y2 = 0;

                let x3 = 348;
                let y3 = 0;

                let note = this.notes.create(x, y, "note");
                let note2 = this.notes.create(x2, y2, "note2");
                let note3 = this.notes.create(x3, y3, "note3");
                note.setVelocityY(600);
                note2.setVelocityY(600);
                note3.setVelocityY(600);

                [note, note2, note3];
              }
            }
          },
          callbackScope: this,
          loop: -1
        });
      },
      callbackScope: this,
      loop: null
    });

    this.objects.add(circle);
    this.objects.add(circle2);
    this.objects.add(circle3);

    circle.body.immovable = true;
    circle.body.allowGravity = false;

    circle2.body.immovable = true;
    circle2.body.allowGravity = false;

    circle3.body.immovable = true;
    circle3.body.allowGravity = false;

    this.physics.add.overlap(circle, this.notes, this.collectNote1, null, this);
    this.physics.add.overlap(
      circle2,
      this.notes,
      this.collectNote2,
      null,
      this
    );
    this.physics.add.overlap(
      circle3,
      this.notes,
      this.collectNote3,
      null,
      this
    );

    this.physics.add.collider(this.playerLasers, this.enemies, function(
      playerLaser,
      enemy
    ) {
      if (enemy) {
        if (enemy.onDestroy !== undefined) {
          enemy.onDestroy();
        }
        enemy.explode(true);
        playerLaser.destroy();
      }
    });

    this.physics.add.overlap(this.player, this.enemies, function(
      player,
      enemy
    ) {
      if (!player.getData("isDead") && !enemy.getData("isDead")) {
        player.explode(false);
        player.onDestroy();
        enemy.explode(true);
      }
    });
  }

  update() {
    if (!this.player.getData("isDead")) {
      this.player.update();
      if (this.cursorKeys.left.isDown) {
        this.player.moveLeft();
      } else if (this.cursorKeys.right.isDown) {
        this.player.moveRight();
      }

      if (this.keyA.isDown || this.keyS.isDown || this.keyD.isDown) {
        this.player.setData("isShooting", true);
      } else {
        this.player.setData(
          "timerShootTick",
          this.player.getData("timerShootDelay") - 1
        );
        this.player.setData("isShooting", false);
      }
    } else {
      this.socket.emit("playerDead", name);
      if (this.winText.visible) {
        this.winText.visible = false;
      }
      this.gameOverText.visible = true;
      this.sendScore();
    }

    for (let i = 0; i < this.enemies.getChildren().length; i++) {
      let enemy = this.enemies.getChildren()[i];

      enemy.update();

      if (
        enemy.x < -enemy.displayWidth ||
        enemy.x > this.game.config.width + enemy.displayWidth ||
        enemy.y < -enemy.displayHeight * 4 ||
        enemy.y > this.game.config.height + enemy.displayHeight
      ) {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          enemy.destroy();
        }
      }
    }

    for (let i = 0; i < this.playerLasers.getChildren().length; i++) {
      let laser = this.playerLasers.getChildren()[i];
      laser.update();
      if (
        laser.x < -laser.displayWidth ||
        laser.x > this.game.config.width + laser.displayWidth ||
        laser.y < -laser.displayHeight * 4 ||
        laser.y > this.game.config.height + laser.displayHeight
      ) {
        if (laser) {
          laser.destroy();
        }
      }
    }

    this.startMusic();

    this.score += 10;

    if (this.winText.visible) {
      timedEvent = this.time.delayedCall(5000, this.toggleWinText, [], this);
    }

    this.socket.on("gameOver", name => {
      this.winText.setText(
        name.toUpperCase() + " Died.\nYOU WIN!\n KEEP GOING!"
      );
      this.winText.visible = true;
    });

    this.background.tilePositionY -= 1.5;
  }

  //Resets brick's position after it reaches the end of a screen
  resetBrickPosition1(brick) {
    brick.y = 0;
    brick.x = 650;
  }

  resetBrickPosition2(brick) {
    brick.y = 0;
    brick.x = 900;
  }

  //MUSIC STUFF
  startMusic() {
    music.resume();
  }

  collectNote1(circle, note) {
    if (this.keyA.isDown) {
      let explosion = this.objects.create(circle.x, circle.y, "circlePress");
      note.destroy();
      explosion.anims.play("circlePress");
      explosion.on("animationcomplete", () => {
        explosion.destroy();
      });

      //note.disableBody(true, true);
      this.updateScore();
    }
  }

  collectNote2(circle, note) {
    if (this.keyS.isDown) {
      let explosion = this.objects.create(circle.x, circle.y, "circlePress");
      note.destroy();
      explosion.anims.play("circlePress");
      explosion.on("animationcomplete", () => {
        explosion.destroy();
      });

      //note.disableBody(true, true);
      this.updateScore();
    }
  }

  collectNote3(circle, note) {
    if (this.keyD.isDown) {
      let explosion = this.objects.create(circle.x, circle.y, "circlePress");
      note.destroy();
      explosion.anims.play("circlePress");
      explosion.on("animationcomplete", () => {
        explosion.destroy();
      });

      //note.disableBody(true, true);
      this.updateScore();
    }
  }

  updateScore() {
    this.socket.emit("scoreUpdate", (score += 10), name);
    this.scoreText.setText(name.toUpperCase() + "'S SCORE: " + score);
    this.socket.on("playerScore", (theirScore, player2) => {
      this.otherScoreText.visible = true;
      this.otherScoreText.setText(
        player2.toUpperCase() + "'S SCORE: " + theirScore
      );
    });
  }

  setRandomNote() {
    const rand = Math.floor(Math.random() * strings.length);
    strings[rand].setNote();
  }

  sendScore() {
    $.ajax({
      type: "POST",
      url: "/submit-score",
      data: {
        username: getUser(),
        score: score
      },
      success: function(data) {},
      error: function(xhr) {
        window.alert(JSON.stringify(xhr));
        window.location.replace("/index.html");
      }
    });
  }

  toggleWinText() {
    this.winText.visible = false;
  }
}
