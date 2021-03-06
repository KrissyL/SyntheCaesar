class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: "SceneGameOver" });
  }
  preload() {
    this.load.image("mainMenuBg", "assets/content/mainMenuBg.png");
  }
  create() {
    this.title = this.add.text(this.game.config.width * 0.5, 128, "GAME OVER", {
      fontFamily: "monospace",
      fontSize: 48,
      fontStyle: "bold",
      color: "#ffffff",
      align: "center"
    });
    this.title.setOrigin(0.5);

    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };

    this.background = this.add.tileSprite(
      512,
      384,
      config.width,
      config.height,
      "mainMenuBg"
    );

    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnRestart"
    );

    this.btnRestart.setInteractive();

    this.btnRestart.on(
      "pointerover",
      function() {
        this.btnRestart.setTexture("sprBtnRestartHover"); // set the button texture to sprBtnPlayHover
        this.sfx.btnOver.play(); // play the button over sound
      },
      this
    );

    this.btnRestart.on("pointerout", function() {
      this.setTexture("sprBtnRestart");
    });

    this.btnRestart.on(
      "pointerdown",
      function() {
        this.btnRestart.setTexture("sprBtnRestartDown");
        this.sfx.btnDown.play();
      },
      this
    );

    this.btnRestart.on(
      "pointerup",
      function() {
        this.btnRestart.setTexture("sprBtnRestart");
        this.scene.start("SceneMain");
        location.reload();
      },
      this
    );

    // this.backgrounds = [];
    // for (let i = 0; i < 5; i++) {
    //   let keys = ["sprBg0", "sprBg1"];
    //   let key = keys[Phaser.Math.Between(0, keys.length - 1)];
    //   let bg = new ScrollingBackground(this, key, i * 10);
    //   this.backgrounds.push(bg);
    // }
  }

  // update() {
  //   for (let i = 0; i < this.backgrounds.length; i++) {
  //     this.backgrounds[i].update();
  //   }
  // }
}
