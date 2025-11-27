import { Scene } from "phaser";
import keys from "../../utils/enums/keys";
import createInputs from "../../utils/createInputSystem.js";
import { INPUT_ACTIONS } from "../../utils/InputSystem.js";
import createAtlas from "../../utils/createAtlas.js";
import { finishLevel, spawnPedidos, createLayout, createLevel } from "../../utils/gameFunctions.js";

export class Game extends Scene {
  constructor(key = "Game") {
    super(key);
    this.cycleText = null;
    this.currentCycle = "init";
    this.player = null;

    const { money, failedToCook, allRecepiesCooked, failedToDodge, bothLose, oneLoses, jugador } = keys.sceneGame;
    this.failedToCook = failedToCook;
    this.allRecepiesCooked = allRecepiesCooked;
    this.failedToDodge = failedToDodge;
    this.bothLose = bothLose;
    this.oneLoses = oneLoses;
    this.jugador = jugador;
  }

  init() {
    this.currentCycle = "init";
    this.caceria = false;
    this.audio = this.scene.get("Preloader")

    this.input.once('pointerdown', () => { //esto es para evitar un warning molesto del audio
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
    });
  }

  preload() {
    this.currentCycle = "preload";
    this.actualLevel = this.registry.get("actualLevel");
    console.log(`%cActual Level: ${this.actualLevel}`, "color: aqua")
    this.load.setPath("assets");
    this.currentMode = this.registry.get("mode");
    console.log(`%cModo de juego: ${this.currentMode}`, "color: yellow")
  }

  create() {
    this.currentCycle = "create";

    createAtlas(this);
    createLevel(this);
    createInputs(this);
    createLayout(this);

    //MUSICA ---------------------------------------------------
    this.audio.musicKitchenAudio.play()
    this.audio.kitchenAmbientAudio.play()

    spawnPedidos(this);
    spawnPedidos(this);
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        spawnPedidos(this);
      },
      loop: true
    });


    //Cursors
    this.victoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    this.defeatKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.CaceriaKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.recetarioKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update(t, dt) {
    this.currentCycle = "update";

    this.nearestBox = this._getClosestBox(this.player)
    this.nearestBox2 = this._getClosestBox(this.player02)

    if (this.player) this.player.update(dt);
    if (this.player02) this.player02.update(dt);
    this.Interactuables.forEach(box => { //updatea todas las cajas
      box.update(dt);
    });

    //PLAYER 1 ----------------------------------------------------------------------------
    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player01")) {
      if (this.nearestBox.activeBox) {
        this.nearestBox.onInteract(this.player)
      } else {
        if (this.player.holdingItem) {
          this.player.holdingSM.changeState("none", { player: this.player })

        }
      }
    }

    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.EAST, "player01") && this.player.holdingItem) {
      const itemToThrow = this.player.itemHolded;
      this.player.holdingSM.changeState("none", { player: this.player });

      const speed = 600;
      itemToThrow.thrownBy = 1;
      itemToThrow.body.setVelocity(this.player.lastDirection.x * speed, this.player.lastDirection.y * speed);
      this.audio.throwAudio.play({
        volume: .4,
        rate: 1
      })
    }

    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player01")) {
      this.player.dash()
    }
    //PLAYER 2 ----------------------------------------------------------------------------
    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player02")) {
      if (this.nearestBox2.activeBox2) {
        this.nearestBox2.onInteract(this.player02)
      } else {
        if (this.player02.holdingItem) {
          this.player02.holdingSM.changeState("none", { player: this.player02 })

        }
      }
    }

    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.EAST, "player02") && this.player02.holdingItem) {
      const itemToThrow = this.player02.itemHolded;
      this.player02.holdingSM.changeState("none", { player: this.player02 });

      const speed = 600;
      itemToThrow.thrownBy = 1;
      itemToThrow.body.setVelocity(this.player02.lastDirection.x * speed, this.player02.lastDirection.y * speed);
    }

    if (this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player02")) {
      this.player02.dash()
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (!this.scene.isActive("PauseMenu")) {
        // pausa el juego y lanza el menú
        this.scene.launch("PauseMenu", { from: this.scene.key });
      }
    }
    if (Phaser.Input.Keyboard.JustDown(this.defeatKey)) {
      if (this.currentMode === 2) {
        this.registry.set("vsPoints2", -10);
      } else {
        this.registry.set("coopPoints", -10)
      }
      finishLevel(this);
    }
    if (Phaser.Input.Keyboard.JustDown(this.victoryKey)) {
      finishLevel(this);
    }
    if (Phaser.Input.Keyboard.JustDown(this.recetarioKey)) {
      this.recetario.onInput()
    }
    if (Phaser.Input.Keyboard.JustDown(this.CaceriaKey)) {
      this.registry.set("actualLevel", this.actualLevel + 1)
      this.sound.stopAll();
      this.scene.stop("HUD");
      this.cameras.main.fadeOut(400);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("Load", { nextScene: "Caceria" });
      });
    }

    if (this.playersTouching) {
      if (this.player.isDashing) {
        this._pushPlayers(this.player, this.player02);
      }
      if (this.player02.isDashing) {
        this._pushPlayers(this.player02, this.player);
      }
      this.playersTouching = false; // reset para la siguiente frame

      if (this.player.isDashing) {
        if (this.player02 && this.player02.holdingItem) {
          this.player02.holdingSM.changeState("none", { player: this.player02 })
        }
      }
      if (this.player02.isDashing) {
        if (this.player && this.player.holdingItem) {
          this.player.holdingSM.changeState("none", { player: this.player })
        }
      }

    }
  }

  _getClosestBox(player) {
    if (!player || !player.body) {
      return null;
    }

    let minDist = Infinity;
    let nearest = null;


    //buscar la box más cercana
    for (const box of this.Interactuables) {
      if (!box.grabbed) {
        const dActual = box.getDistSqToPlayer(player);

        if (dActual < minDist) {
          minDist = dActual;
          nearest = box;
        } else if (dActual === minDist) {
          if (box !== nearest) {
            nearest = box;
          }
        }
      }
    }

    //aplicar estado a las cajas
    for (const box of this.Interactuables) {
      if (box === nearest) box.markAsClosest(true, minDist, player.kind);
      else box.markAsClosest(false, Infinity, player.kind);
    }

    return nearest;
  }

  _pushPlayers(p1, p2) {
    const dir = p1.lastDirection
    const force = 400;

    p2.pushed = true;
    p2.pushedTime = 0;
    p2.body.setVelocity(dir.x * force, dir.y * force);
  }
}
