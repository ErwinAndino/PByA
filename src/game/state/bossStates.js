import { State } from "./State";

export class AppearState extends State {
    init(params) {
        this.boss = params.boss;
        console.log("%cBoss aparece en escena", "color: purple");
        this.timer = 0;
        this.duration = 1500;
        this.boss.setAlpha(0);
        this.boss.scene.tweens.add({
            targets: this.boss,
            alpha: 1,
            duration: this.duration,
            onComplete: () => {
                this.boss.behaviorSM.changeState("idle", { boss: this.boss });
            }
        });
    }

    update(dt) {
        this.timer += dt;
    }
}

export class BossIdleState extends State {
    init(params) {
        this.boss = params.boss;
    }

    update(dt) {
        const target = this.boss.getClosestPlayer();
        if (target) {
            const dist = Phaser.Math.Distance.Between(this.boss.x, this.boss.y, target.x, target.y);
            if (dist < 120 && this.boss.lastAttack >= this.boss.attackCooldown && !this.boss.isDashing) {
                this.boss.behaviorSM.changeState("attack", { boss: this.boss });
            }
            if (dist < 300 && dist > 50 && this.boss.lastDash >= this.boss.dashCooldown && !this.boss.isAttacking) {
                this.boss.behaviorSM.changeState("dash", { boss: this.boss });
            }
        }
    }
}

export class AttackState extends State {
    init(params) {
        this.boss = params.boss;
        this.boss.isAttacking = true;
        this.boss.setVelocity(0, 0);
        this.boss.lastAttack = 0;

        // Buscar objetivo
        this.target = this.boss.getClosestPlayer();
        if (!this.target) {
            this.boss.behaviorSM.changeState("idle", { boss: this.boss });
            return;
        }

        // Calcular distancia y dirección
        const dx = this.target.x - this.boss.x;
        const dy = Math.abs(this.target.y - this.boss.y); // ignoramos vertical salvo diferencia muy grande
        const dist = Math.abs(dx);

        const attackRange = 120; // distancia máxima del ataque
        if (dist > attackRange || dy > 50) {
            // fuera de rango → no ataca
            this.boss.behaviorSM.changeState("idle", { boss: this.boss });
            this.boss.isAttacking = false;
            return;
        }

        // Determinar dirección (solo izquierda o derecha)
        const facingRight = dx >= 0;
        this.boss.setFlipX(facingRight);
        this.boss.play("boss_attack_1", true);


        this.hitboxFrames = new Set();
        this.boss.lastAttackFrameTime = 0;
        this.attackDelay = 350;

        this.boss.on("animationupdate", (anim, frame) => {
            if (anim.key === "boss_attack_1") {
                const triggerFrames = [2, 4, 6]; // frames donde el ataque pega
                if (triggerFrames.includes(frame.index) && !this.hitboxFrames.has(frame.index)) {

                    const now = this.boss.scene.time.now;
                    if (now - this.boss.lastAttackFrameTime >= this.attackDelay) {
                        this.spawnHitbox(facingRight);
                        this.applyAttackStep();
                        this.boss.audio.dashAudio.play({
                            volume: 0.3, // Ajusta el volumen
                            rate: Phaser.Math.FloatBetween(.8, 1)    // Ajusta el pitch
                        });
                        this.hitboxFrames.add(frame.index);
                    }
                }
            }
        });

        // Volver a idle cuando termina
        this.boss.once(`animationcomplete`, () => {
            this.finishAttack();
        });
    }

    applyAttackStep() {
        const dx = this.target.x - this.boss.x;
        const facingRight = dx >= 0;
        this.boss.setFlipX(facingRight);
        const impulse = 60; // cuanto se mueve hacia adelante
        const dir = facingRight ? 1 : -1;

        this.boss.scene.tweens.add({
            targets: this.boss,
            x: this.boss.x + dir * impulse,
            duration: 120,
            ease: "Sine.easeOut"
        });
    }

    spawnHitbox(facingRight) {
        const hitboxSize = { w: 197, h: 110 };

        this.hitbox = this.boss.scene.add.rectangle(
            this.boss.x,
            this.boss.y,
            hitboxSize.w,
            hitboxSize.h,
            0xff0000,
            0.3
        );

        this.boss.scene.physics.add.existing(this.hitbox);
        this.hitbox.body.setAllowGravity(false);
        this.hitbox.body.setImmovable(true);

        const players = [];
        if (this.boss.scene.player) players.push(this.boss.scene.player);
        if (this.boss.scene.player02) players.push(this.boss.scene.player02);



        players.forEach(player => {
            this.boss.scene.physics.add.overlap(this.hitbox, player, () => {
                this.boss.scene.damagePlayer(player.kind);
                const dx = player.x - this.boss.x;
                const dy = player.y - this.boss.y;
                const angle = Math.atan2(dy, dx);

                this._pushPlayers(angle, player)
            });
        });

        // hitbox dura poco
        this.boss.scene.time.delayedCall(200, () => {
            if (this.hitbox) this.hitbox.destroy();
        });
    }

    _pushPlayers(angle, player) {
        const force = 1000;

        player.pushed = true;
        player.pushedTime = 0;
        player.body.setVelocity(Math.cos(angle) * force, Math.sin(angle) * force);
    }

    finishAttack() {
        this.boss.isAttacking = false;
        this.boss.clearTint();
        this.boss.setFlipX(false)
        this.boss.setFrame(0);
        this.boss.behaviorSM.changeState("idle", { boss: this.boss });
    }

    finish() {
        if (this.hitbox) this.hitbox.destroy();
        this.boss.off("animationupdate-boss_attack_1");
        this.boss.off("animationcomplete-boss_attack_1");
    }
}

export class HurtState extends State {
    init(params) {
        this.boss = params.boss;
        console.log("%cBoss recibe daño", "color: red");
        this.timer = 0;
        this.duration = 300;
        this.boss.audio.playerHitAudio.play({
            volume: 0.3, // Ajusta el volumen
            rate: Phaser.Math.FloatBetween(.8, 1)    // Ajusta el pitch
        });

        if (this.boss.hp <= 0) {
            this.boss.audio.bossDeathAudio.play({
                volume: 0.3, // Ajusta el volumen
                rate: 1    // Ajusta el pitch
            });
            this.boss.behaviorSM.changeState("dead", { boss: this.boss });
        }
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.duration) {
            this.boss.clearTint();
            if (this.boss.hp > 0) {
                this.boss.behaviorSM.changeState("idle", { boss: this.boss });
            }
        }
    }
}

export class DeadState extends State {
    init(params) {
        this.boss = params.boss;
        const scene = this.boss.scene;
        console.log("%cBoss muere", "color: gray");
        this.boss.isAlive = false;
        this.boss.scene.tweens.add({
            targets: this.boss,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                this.boss.healthBar.destroy();
                this.boss.destroy();
                if (scene.registry.get("mode") === 1) {
                    const actualPoints = scene.registry.get("coopPoints");
                    scene.registry.set("coopPoints", actualPoints + 150);
                } else if (scene.registry.get("mode") === 2) {
                    const actualPoints = scene.registry.get(`vsPoints${this.boss.lastHittedBy}`)
                    scene.registry.set(`vsPoints${this.boss.lastHittedBy}`, actualPoints + 150);
                }

                scene.time.delayedCall(1000, () => {
                    scene.sound.stopAll();
                    scene.scene.start("Load", { nextScene: "Game" });
                });
            }
        });
    }
}

export class DashState extends State {
    init(params) {
        this.boss = params.boss;
        this.boss.isDashing = true;
        this.boss.isAttacking = false;
        this.boss.setVelocity(0, 0);
        this.boss.lastDash = 0;

        // Buscar objetivo
        this.target = this.boss.getClosestPlayer();
        if (!this.target) {
            this.finishDash();
            return;
        }

        // Reproducir animación del dash
        this.boss.play("boss_dash", true);

        this.hitboxFrames = new Set();
        this.boss.lastDashFrameTime = 0;
        this.dashImpulse = 350; // fuerza del dash
        this.dashDelay = 100;   // tiempo entre posibles hitboxes (por seguridad)

        this.boss.on("animationupdate", (anim, frame) => {
            if (anim.key === "boss_dash") {
                const frameIndex = frame.index;

                // Frames 1-2: quieto
                if (frameIndex === 3) {
                    this.applyDashImpulse();
                }

                // Frame 4: aplica daño (hitbox)
                if (frameIndex === 4 && !this.hitboxFrames.has(4)) {
                    const now = this.boss.scene.time.now;
                    if (now - this.boss.lastDashFrameTime >= this.dashDelay) {
                        this.spawnHitbox();
                        this.hitboxFrames.add(4);
                        this.boss.audio.dashAudio.play({
                            volume: 0.3, // Ajusta el volumen
                            rate: Phaser.Math.FloatBetween(.2, .6)    // Ajusta el pitch
                        });
                        this.boss.lastDashFrameTime = now;
                    }
                }
            }
        });

        // Cuando termina la animación, volver a idle
        this.boss.once("animationcomplete-boss_dash", () => {
            this.finishDash();
        });
    }

    applyDashImpulse() {
        // Movimiento rápido hacia el jugador
        const target = this.target;
        if (!target) return;

        const dx = target.x - this.boss.x;
        const dy = target.y - this.boss.y;
        const angle = Math.atan2(dy, dx);
        const impulse = this.dashImpulse;

        this.boss.scene.tweens.add({
            targets: this.boss,
            x: this.boss.x + Math.cos(angle) * impulse,
            y: this.boss.y + Math.sin(angle) * impulse,
            duration: 400,
            ease: "Sine.easeOut"
        });
    }

    spawnHitbox() {
        const hitboxSize = { w: 180, h: 100 };

        this.hitbox = this.boss.scene.add.rectangle(
            this.boss.x,
            this.boss.y,
            hitboxSize.w,
            hitboxSize.h,
            0x00ffff,
            0.25
        );

        this.boss.scene.physics.add.existing(this.hitbox);
        this.hitbox.body.setAllowGravity(false);
        this.hitbox.body.setImmovable(true);

        const players = [];
        if (this.boss.scene.player) players.push(this.boss.scene.player);
        if (this.boss.scene.player02) players.push(this.boss.scene.player02);

        players.forEach(player => {
            this.boss.scene.physics.add.overlap(this.hitbox, player, () => {
                this.boss.scene.damagePlayer(player.kind);
            });
        });

        this.boss.scene.time.delayedCall(200, () => {
            if (this.hitbox) this.hitbox.destroy();
        });
    }

    finishDash() {
        this.boss.isDashing = false;
        this.boss.setVelocity(0, 0);
        if (this.hitbox) this.hitbox.destroy();
        this.boss.clearTint();
        this.boss.setFrame(0);
        this.boss.behaviorSM.changeState("idle", { boss: this.boss });
    }

    finish() {
        if (this.hitbox) this.hitbox.destroy();
        this.boss.off("animationupdate-boss_dash");
        this.boss.off("animationcomplete-boss_dash");
    }
}