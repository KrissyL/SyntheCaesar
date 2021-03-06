class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData("type", type);
    this.setData("isDead", false);
  }

  explode(canDestroy) {
    if (!this.getData("isDead")) {
      // Set the texture to the explosion image, then play the animation
      this.setTexture("sprExplosion"); // this refers to the same animation key we used when we added this.anims.create previously
      this.play("sprExplosion"); // play the animation
      // pick a random explosion sound within the array we defined in this.sfx in SceneMain
      // this.scene.sfx.explosions[
      //   Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)
      // ].play();
      if (this.shootTimer !== undefined) {
        if (this.shootTimer) {
          this.shootTimer.remove(false);
        }
      }
      this.setAngle(0);
      this.body.setVelocity(0, 0);
      this.on(
        "animationcomplete",
        function() {
          if (canDestroy) {
            this.destroy();
          } else {
            this.setVisible(false);
          }
        },
        this
      );
      this.setData("isDead", true);
    }
  }
}

class Player extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, "Player");

    this.play("sprPlayer");

    this.setData("speed", 200);

    this.setData("isShooting", false);
    this.setData("timerShootDelay", 10);
    this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
  }

  moveUp() {
    this.body.velocity.y = -this.getData("speed");
  }
  moveDown() {
    this.body.velocity.y = this.getData("speed");
  }
  moveLeft() {
    this.body.velocity.x = -this.getData("speed");
  }
  moveRight() {
    this.body.velocity.x = this.getData("speed");
  }

  onDestroy() {
    music.stop();
    // this.scene.pause("SceneMain");
    this.scene.time.addEvent({
      // go to game over scene
      delay: 1000,
      callback: function() {
        this.scene.scene.start("SceneGameOver");
      },
      callbackScope: this,
      loop: false
    });
  }

  update() {
    this.body.setVelocity(0, 0);
    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

    if (this.getData("isShooting")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      } else {
        // when the "manual timer" is triggered:
        let laser = new PlayerLaser(this.scene, this.x, this.y);
        this.scene.playerLasers.add(laser);

        // this.scene.sfx.laser.play(); // play the laser sound effect
        this.setData("timerShootTick", 0);
      }
    }
  }
}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserPlayer");
    this.body.velocity.y = -200;
  }
}

class Meteoroid extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy0", "Meteoroid");
    this.play("sprEnemy0");

    this.body.velocity.y = Phaser.Math.Between(50, 100);
  }
}

class ChasingRock extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy1", "ChasingRock");

    this.body.velocity.y = Phaser.Math.Between(50, 100);

    this.states = {
      MOVE_DOWN: "MOVE_DOWN",
      CHASE: "CHASE"
    };
    this.state = this.states.MOVE_DOWN;
  }

  update() {
    if (!this.getData("isDead") && this.scene.player) {
      if (
        Phaser.Math.Distance.Between(
          this.x,
          this.y,
          this.scene.player.x,
          this.scene.player.y
        ) < 320
      ) {
        this.state = this.states.CHASE;
      }

      if (this.state == this.states.CHASE) {
        let dx = this.scene.player.x - this.x;
        let dy = this.scene.player.y - this.y;

        let angle = Math.atan2(dy, dx);

        let speed = 100;
        this.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        if (this.x < this.scene.player.x) {
          this.angle -= 5;
        } else {
          this.angle += 5;
        }
      }
    }
  }
}

class EnemyLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserEnemy0");
    this.body.velocity.y = 200;
  }
}

class Sun extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sun", "sun");
    this.play("sun");
  }
}
