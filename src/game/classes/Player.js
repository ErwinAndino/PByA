import { StateMachine } from "../state/StateMachine.js";
import { State } from "../state/State.js";
import { INPUT_ACTIONS } from "../../utils/InputSystem.js";
import { IdleState, MovingState, HoldingNothingState, HoldingIngredientState, DashingState } from "../state/playerStates.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key, inputSystem, kind = 1,) {
    //INICIALIZANDO VARIABLES---------------------------------------
    super(scene, x, y, key);
    this.scene = scene;
    this.kind = kind;
    this.caceria = this.scene.caceria;
    this.holdingItem = false;
    this.itemHolded = null;
    this.dashCooldown = 1000;
    this.isDashing = false;
    this.lastDash = 0;
    this.pushed = false;
    this.pushedDuration = 400;
    this.pushedTime = 0;
    this.inputId = this.kind === 1 ? "player01" : "player02";
    this.inputSystem = inputSystem;
    this.attackCooldown = 250; // 500 ms
    this.lastAttack = 0;

    this.audio = this.scene.scene.get("Preloader")

    //MAQUINA DE ESTADO DE MOVIMIENTO -------------------------------
    this.movingSM = new StateMachine("idle");
    this.movingSM.addState("idle", new IdleState());
    this.movingSM.addState("moving", new MovingState());
    this.movingSM.addState("dashing", new DashingState());
    this.movingSM.changeState("idle", { player: this });

    //MAQUINA DE ESTADO DE HOLDEO ------------------------------------
    this.holdingSM = new StateMachine("none");
    this.holdingSM.addState("none", new HoldingNothingState())
    this.holdingSM.addState("ingredient", new HoldingIngredientState())
    this.holdingSM.changeState("none", { player: this });

    //AÑADIENDO A LA ESCENA ------------------------------------------
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setDepth(8);
    // HITBOX CUSTOM: por ejemplo, 16x32 centrada
    this.body.setSize(22, 22);
    this.body.setOffset(4, 25); // Ajusta estos valores según tu sprite

    //ROMPER EL SPRITE SHEET
    const directions = ['down', 'up', 'left', 'right'];
    const dirStart = { down: 6, up: 30, left: 0, right: 24 };
    const dirEnd = { down: 9, up: 33, left: 3, right: 27 };

    this.idleFrames = {
      down: 6,  // primer frame de abajo
      up: 30,   // primer frame de arriba
      left: 0,  // primer frame de izquierda
      right: 24 // primer frame de derecha
    };


    directions.forEach(dir => {
      const animKey = `p${kind}_walk_${dir}`;
      if (!this.scene.anims.exists(animKey)) {
        this.scene.anims.create({
          key: animKey,
          frames: this.scene.anims.generateFrameNumbers(key, { start: dirStart[dir], end: dirEnd[dir] }),
          frameRate: 10,
          repeat: -1
        });
      }
    });

    if (!this.scene.anims.exists(`p${kind}_Attack`)) {
      this.scene.anims.create({
        key: `p${kind}_Attack`,
        frames: this.scene.anims.generateFrameNumbers(`player${kind}Attack`, { start: 0, end: 2 }),
        frameRate: null,
        frameDuration: 83,
        repeat: 0
      });
    }
    if (!this.scene.anims.exists(`p_attack_woosh`)) {
      this.scene.anims.create({
        key: `p_attack_woosh`,
        frames: this.scene.anims.generateFrameNumbers(`playerAttackEffect`, { start: 0, end: 2 }),
        frameRate: null,
        frameDuration: 83,
        repeat: 0
      });
    }

    //ULTIMOS ARREGLOS DE SPRITE -----------------------------------------

    this.refreshBody()
    this.setPushable(false)
    this.body.setCollideWorldBounds(true)

    //particulas
    this.emitterPolvo = this.scene.add.particles(0, 0, 'particleDust01', { // particulas dash
      //al usar emitParticle se le suma las x e y dadas a las del emitter, 
      // por eso la posicion del emitter tiene que ser 0,0
      frame: [0, 1, 2],
      speedX: { min: -10, max: 10 },
      speedY: { min: -10, max: -10 },
      lifespan: 500,
      quantity: 2,
      frequency: -1,
      scale: 1,
      // scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      // blendMode: 'DARKEN',
      follow: null,
      depth: 12,
      emitZone: {
        source: new Phaser.Geom.Rectangle(-10, -10, 20, 20), // Área de emisión
        type: "random", // Las partículas se emiten desde posiciones aleatorias dentro del área
      },
    });
    this.emitterPolvo2 = this.scene.add.particles(0, 0, 'particleDust02', { //particulas caminar
      frame: [0, 1, 2, 3],
      speedX: { min: -10, max: 10 },
      speedY: { min: -10, max: -10 },
      lifespan: 500,
      quantity: 1,
      frequency: -1,
      scale: 1,
      // scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      // blendMode: 'DARKEN',
      follow: null,
      depth: 12,
      emitZone: {
        source: new Phaser.Geom.Rectangle(-5, -5, 10, 10), // Área de emisión
        type: "random", // Las partículas se emiten desde posiciones aleatorias dentro del área
      },
    });
  }

  attack() {
    // No ataques si ya estás haciendo dash o empujado
    if (this.isDashing || this.pushed || !this.caceria || !this.active) return;
    if (this.lastAttack < this.attackCooldown) return; // todavía en cooldown
    this.lastAttack = 0;
    this.isAttacking = true;

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.isAttacking = false;
    });

    // Determinar dirección del ataque
    let dir = "right";
    if (this.lastDirection) {
      dir = this.getDirectionFromVector(this.lastDirection);
      if (dir === "up" || dir === "down") {
        if (Math.abs(this.lastDirection.x) > 0) {
          dir = this.lastDirection.x > 0 ? "right" : "left";
        } else {
          dir = "right";
        }
      }
    }

    if (dir === "left") {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }

    const animKey = `p${this.kind}_Attack`;
    this.anims.play(animKey, true);
    this.audio.dashAudio.play({
      volume: 0.3, // Ajusta el volumen
      rate: Phaser.Math.FloatBetween(1.2, 1.6)    // Ajusta el pitch
    });
    this.body.setVelocity(0);

    //woosh aca
    const offset = 20;
    const dirVec = dir === "left" ? new Phaser.Math.Vector2(-1, 0) : new Phaser.Math.Vector2(1, 0);
    const attackX = this.x + dirVec.x * offset;
    const attackY = this.y;

    const woosh = this.scene.add.sprite(attackX, attackY, "playerAttackEffect");
    woosh.play("p_attack_woosh");
    woosh.setDepth(9);
    if (dir === "left") {
      woosh.setFlipX(true);
    } else {
      woosh.setFlipX(false);
    }

    this.scene.physics.add.existing(woosh);
    woosh.body.setAllowGravity(false);
    woosh.body.setImmovable(true);

    this.scene.physics.add.overlap(woosh, this.scene.boss, (hitbox, boss) => {
      if (boss.isAlive && !woosh.hasHit) {
        boss.takeDamage(25, this.kind);
        woosh.hasHit = true;
      }
    });

    woosh.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      woosh.destroy()
    })

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.isAttacking = false;
      this.setFlipX(false);
      if (this.lastDirection) {
        const dir = this.getDirectionFromVector(this.lastDirection);
        this.setFrame(this.idleFrames[dir]);
      }
    });

  }


  update(dt) {
    if (this.isAttacking) {
      this.body.setVelocity(0);
      this.lastAttack += dt;
      this.lastDash += dt;
      this.pushedTime += dt;
      return; // no moverse mientras ataca
    }
    this.movingSM.update(dt);
    this.holdingSM.update(dt);

    this.lastAttack += dt;
    this.lastDash += dt;
    this.pushedTime += dt;
    if (this.pushedDuration < this.pushedTime) {
      this.pushed = false;
    }
  }

  getDirectionFromVector(vec) {
    if (Math.abs(vec.x) > Math.abs(vec.y)) {
      return vec.x > 0 ? 'right' : 'left';
    } else {
      return vec.y > 0 ? 'down' : 'up';
    }
  }

  dash() {
    if (this.lastDash >= this.dashCooldown) {
      if (this.lastDirection) {
        this.movingSM.changeState("dashing", { player: this });
        this.lastDash = 0;
      }
    }
  }
}