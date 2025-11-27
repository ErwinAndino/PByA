import createInputs from "../../utils/createInputSystem"
import { Boss } from "../classes/Boss";
import { Player } from "../classes/Player";
import { getPhrase } from "../../utils/Translations";
import keys from "../../utils/enums/keys";
import { INPUT_ACTIONS } from "../../utils/InputSystem"


export class Caceria extends Phaser.Scene {
  constructor() {
    super("Caceria");
    const { money, failedToCook, allRecepiesCooked, failedToDodge, bothLose, oneLoses, jugador } = keys.sceneGame;
    this.failedToDodge = failedToDodge;
  }

  init(data) {
  }

  preload() {
    this.currentCycle = "preload";
    this.caceria = true;
    this.actualLevel = this.registry.get("actualLevel");
    this.load.setPath("assets");
    this.currentMode = this.registry.get("mode");
  }

  create() {
    this.gameScene = this.scene.get("Game");
    this.audio = this.scene.get("Preloader");
    const { width, height } = this.scale;
    this.scene.bringToTop();

    this.musicaBoss1 = this.sound.add("musicHunt", { loop: true, volume: 0 });
    this.musicaBoss1.play()
    this.tweens.add({
      targets: this.musicaBoss1,
      volume: 1,        // volumen final
      duration: 3000,   // 3 segundos
      ease: 'Sine.easeInOut'
    });

    this.anims.create({
      key: "boss_attack_1",
      frames: this.anims.generateFrameNumbers("bossAttack01", { start: 0, end: 7 }),
      frameRate: 7,
      repeat: 0
    });
    this.anims.create({
      key: "boss_dash",
      frames: this.anims.generateFrameNumbers("bossAttack02", { start: 0, end: 7 }),
      frameRate: 4,
      repeat: 0
    });

    createInputs(this);

    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.add.image(320, 180, "backgroundHunt");
    // this.nightOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000033, 0.6)
    //   .setOrigin(0)
    //   .setScrollFactor(0); //Esto crea la idea de que ya es de noche

    this.huntAmbient = this.sound.add("huntAmbient", { loop: true, volume: .2 }).play()

    this.player = new Player(this, (width / 2) - 200, 190, "player01", this.inputSystem);
    this.player02 = new Player(this, (width / 2) + 200, 190, "player02", this.inputSystem, 2);
    this.boss = new Boss(this, width / 2, height / 2 - 100, "bossAttack01");

    this.physics.add.collider(this.player, this.player02, () => {
      this.playersTouching = true;
    }, null, this);
    this.physics.add.collider(this.boss, this.player, () => {
      this.playersTouching = true;
    }, null, this);
    this.physics.add.collider(this.boss, this.player02, () => {
      this.playersTouching = true;
    }, null, this);

    //VIDAS
    this.player1Lives = 3;
    this.player2Lives = 3;
    this.lastDamageTimeP1 = 0;
    this.lastDamageTimeP2 = 0;
    // Corazones de Player 1 (izquierda)
    this.heartsP1 = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add.image(30 + i * 30, 30, "heart")
        .setScrollFactor(0)
        .setScale(0.2);
      this.heartsP1.push(heart);
    }

    // Corazones de Player 2 (derecha)
    this.heartsP2 = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add.image(this.scale.width - 30 - i * 30, 30, "heart")
        .setScrollFactor(0)
        .setScale(0.2);
      this.heartsP2.push(heart);
    }
    this.audio.bossHowlAudio.play({
      volume: 0.3, // Ajusta el volumen
      rate: 1    // Ajusta el pitch
    });
  }

  damagePlayer(playerIndex) {
    const now = this.time.now;
    const cooldown = 1000; // 1 segundo

    if (playerIndex === 1) {
      if (now - this.lastDamageTimeP1 < cooldown || this.player.isDashing) return;
      this.lastDamageTimeP1 = now;
      this.player1Lives--;
      this._updateHearts(1);
      this.audio.bossHitAudio.play({
        volume: 0.3, // Ajusta el volumen
        rate: Phaser.Math.FloatBetween(1.2, .8)    // Ajusta el pitch
      });
    } else if (playerIndex === 2) {
      if (now - this.lastDamageTimeP2 < cooldown || this.player02.isDashing) return;
      this.lastDamageTimeP2 = now;
      this.player2Lives--;
      this._updateHearts(2);
      this.audio.bossHitAudio.play({
        volume: 0.3, // Ajusta el volumen
        rate: Phaser.Math.FloatBetween(1.2, .8)    // Ajusta el pitch
      });
    }
  }

  _updateHearts(playerIndex) {
    const hearts = playerIndex === 1 ? this.heartsP1 : this.heartsP2;
    const lives = playerIndex === 1 ? this.player1Lives : this.player2Lives;

    hearts.forEach((heart, i) => {
      heart.setVisible(i < lives);
    });

    if (lives <= 0) {
      if (playerIndex === 1) {
        this.player.setVisible(false);          // Lo oculta visualmente
        this.player.body.enable = false;        // Desactiva su colisión y movimiento
        this.player.active = false;             // Evita que Phaser lo actualice en colisiones
      } else {
        this.player02.setVisible(false);          // Lo oculta visualmente
        this.player02.body.enable = false;        // Desactiva su colisión y movimiento
        this.player02.active = false;
      }

      this.cameras.main.flash(300, 255, 0, 0); // parpadeo rojo breve

      if (this.player1Lives <= 0 && this.player2Lives <= 0) {

        // Esperar 2 segundos y volver al menú
        this.time.delayedCall(2000, () => {
          this.sound.stopAll();
          this.scene.start("Victory", { reason: getPhrase(this.failedToDodge), empate: false, completado: false, boss: true }); // <-- Cambiá por el nombre real de tu escena de menú
        });
      }
    }
  }

  update(t, dt) {
    if (this.player) this.player.update(dt);
    if (this.player02) this.player02.update(dt);
    if (this.boss) {
      this.boss.update(dt);
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (!this.scene.isActive("PauseMenu")) {
        // pausa el juego y lanza el menú
        this.scene.launch("PauseMenu", { from: this.scene.key });
      }
    }
    //PLAYER 1 ----------------------------------------------------------------------------
    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player01")) {
      this.player.attack()
    }

    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player01")) {
      this.player.dash()
    }
    //PLAYER 2 ----------------------------------------------------------------------------
    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player02")) {
      this.player02.attack()
    }

    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player02")) {
      this.player02.dash()
    }

    if (this.playersTouching) {
      if (this.player.isDashing) {
        this._pushPlayers(this.player, this.player02);
      }
      if (this.player02.isDashing) {
        this._pushPlayers(this.player02, this.player);
      }
      this.playersTouching = false; // reset para la siguiente frame
    }
  }

  _pushPlayers(p1, p2) {
    const dir = p1.lastDirection
    const force = 400;

    p2.pushed = true;
    p2.pushedTime = 0;
    p2.body.setVelocity(dir.x * force, dir.y * force);
  }
}
