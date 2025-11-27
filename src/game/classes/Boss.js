import { State } from "../state/State";
import { StateMachine } from "../state/StateMachine";
import { AppearState, BossIdleState, AttackState, HurtState, DeadState, DashState } from "../state/bossStates";

export class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 0);
    this.scene = scene;
    this.audio = this.scene.scene.get("Preloader");
    this.actualLevel = this.scene.registry.get("actualLevel");
    this.hp = 500 * this.actualLevel;
    this.key = key
    this.speed = 180;
    this.maxHp = 500 * this.actualLevel;
    this.attackCooldown = 2000;
    this.isAttacking = false;
    this.lastAttack = 0;
    this.isAlive = true;
    this.fx = this.preFX.addColorMatrix();
    this.highlighted = false;
    this.highlightedTimer = 0;
    this.healthBar = this.scene.add.graphics();
    this.healthBar.setDepth(20);
    this.targetHpWidth = 60; // ancho objetivo para tween
    this.currentHpWidth = 60; // ancho actual
    this.barWidth = 60;
    this.barHeight = 8;
    this.gameScene = this.scene.scene.get("Game");


    //cosas del dash
    this.dashCooldown = 4000;
    this.lastDash = 0;

    // Agregar a escena y sistema de físicas
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    this.setDepth(10);
    this.setScale(1)
    this.body.setSize(this.width * .3, this.height)

    //Máquina de estados del boss
    this.behaviorSM = new StateMachine("appear");
    this.behaviorSM.addState("appear", new AppearState());
    this.behaviorSM.addState("idle", new BossIdleState());
    this.behaviorSM.addState("dash", new DashState());
    this.behaviorSM.addState("attack", new AttackState());
    this.behaviorSM.addState("hurt", new HurtState());
    this.behaviorSM.addState("dead", new DeadState());
    this.behaviorSM.changeState("appear", { boss: this });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.isDead) return;

    if (this.isAttacking) {
      this.setVelocity(0, 0);
      return;
    }

    const target = this.getClosestPlayer();
    if (target) {
      this.scene.physics.moveToObject(this, target, this.speed);
      this.setFlipX(target.x > this.x ? true : false)
    } else {
      this.setVelocity(0, 0);
    }
  }

  updateHealthBar(dt) {
    const x = this.x - this.barWidth / 2;
    const y = this.y - 50; // 20px arriba del boss

    // Smooth tween del ancho
    const targetWidth = (this.hp / this.maxHp) * this.barWidth;
    const lerpSpeed = 0.1; // ajusta para suavidad
    this.currentHpWidth += (targetWidth - this.currentHpWidth) * lerpSpeed;

    // Color según porcentaje
    const hpPercent = this.currentHpWidth / this.barWidth;
    let color = 0x00ff00; // verde
    if (hpPercent < 0.5) color = 0xffff00; // amarillo
    if (hpPercent < 0.25) color = 0xff0000; // rojo

    this.healthBar.clear();

    // Fondo
    this.healthBar.fillStyle(0x000000);
    this.healthBar.fillRect(x, y, this.barWidth, this.barHeight);

    // Vida
    this.healthBar.fillStyle(color);
    this.healthBar.fillRect(x, y, this.currentHpWidth, this.barHeight);
  }

  getClosestPlayer() {
    const players = [];
    if (this.scene.player && this.scene.player.active && this.scene.player.visible) {
      players.push(this.scene.player);
    }
    if (this.scene.player02 && this.scene.player02.active && this.scene.player02.visible) {
      players.push(this.scene.player02);
    }

    if (players.length === 0) return null;

    let closest = players[0];
    let closestDist = Phaser.Math.Distance.Between(this.x, this.y, closest.x, closest.y);

    for (let i = 1; i < players.length; i++) {
      const p = players[i];
      const dist = Phaser.Math.Distance.Between(this.x, this.y, p.x, p.y);
      if (dist < closestDist) {
        closest = p;
        closestDist = dist;
      }
    }
    return closest;
  }

  update(dt) {
    if (this.isAlive) {
      this.behaviorSM.update(dt);
      this.lastAttack += dt;
      this.lastDash += dt;
      this.highlightedTimer -= dt;
      if (this.highlightedTimer <= 0 && this.highlighted) {
        this.highlighted = false;
        this.fx.brightness(1);
      }
      // Actualizar posición de la barra
      this.updateHealthBar(dt);
    }
  }

  takeDamage(amount, kind) {
    if (!this.isAlive) return;
    const cooldown = 50;

    // --- Cooldown de daño ---
    const now = this.scene.time.now;
    if (this.lastHitTime && now - this.lastHitTime < cooldown) {
      return; // Ignora si fue golpeado hace menos de cooldown ms
    }
    this.lastHitTime = now;
    this.lastHittedBy = kind

    // --- Aplicar daño ---
    this.hp -= amount;
    console.log(`%cBoss HP: ${this.hp}/${this.maxHp}`, "color: yellow");

    // --- Flash blanco visual ---
    this._flashWhite(cooldown); // <- brilla cooldownms

    // --- Cambiar estado ---
    this.behaviorSM.changeState("hurt", { boss: this });
  }

  _flashWhite(cooldown) {
    this.fx.brightness(80);
    this.highlighted = true;
    this.highlightedTimer = cooldown;
  }

}