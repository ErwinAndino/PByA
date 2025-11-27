import { INPUT_ACTIONS } from "../../utils/InputSystem";
import { State } from "./State";

export class IdleState extends State {
    init(params) {
        this.player = params.player;
        this.player?.body?.setVelocity(0);
    }
    update(dt) {
        if (
            this.player.inputSystem.isPressed(INPUT_ACTIONS.UP, this.player.inputId) ||
            this.player.inputSystem.isPressed(INPUT_ACTIONS.DOWN, this.player.inputId) ||
            this.player.inputSystem.isPressed(INPUT_ACTIONS.LEFT, this.player.inputId) ||
            this.player.inputSystem.isPressed(INPUT_ACTIONS.RIGHT, this.player.inputId)
        ) {
            this.player.movingSM.changeState("moving", { player: this.player });
        } else {
            // SETEAR SPRITE QUIETO
            const dir = this.player.lastDirection ? this.player.getDirectionFromVector(this.player.lastDirection) : 'down';
            this.player.setFrame(this.player.idleFrames[dir]);
            this.player.anims.stop(); // Esto corta cualquier animación que estuviera corriendo
        }
    }
    finish() {
        this.player.clearTint();
    }
}

export class MovingState extends State {
    init(params) {
        this.player = params.player;

        this.stepTimer = 0;
        this.stepInterval = 300;
    }
    update(dt) {
        if (!this.player.pushed) {
            this.handleInput(dt);
        }
        // Si no se presiona ninguna tecla, vuelve a idle
        if (
            !this.player.inputSystem.isPressed(INPUT_ACTIONS.UP, this.player.inputId) &&
            !this.player.inputSystem.isPressed(INPUT_ACTIONS.DOWN, this.player.inputId) &&
            !this.player.inputSystem.isPressed(INPUT_ACTIONS.LEFT, this.player.inputId) &&
            !this.player.inputSystem.isPressed(INPUT_ACTIONS.RIGHT, this.player.inputId)
        ) {
            this.player.movingSM.changeState("idle", { player: this.player });
        }

        if (this.player.body.velocity.lengthSq() > 0) {
            this.player.lastDirection = this.player.body.velocity.clone().normalize();
        }


        this.stepTimer += dt;
        if (this.stepTimer >= this.stepInterval) {
            this.stepTimer = 0;
            this.player.audio.playerWalkAudio.play({
                volume: .2,
                rate: Phaser.Math.FloatBetween(.8, 1.2)
            })
            this.player.emitterPolvo2.emitParticle(2, this.player.x, this.player.y + 20);
            // la x e y de esto se le suma a la posicion del emitter por eso la posicion del emitter tiene que ser 0,0
        }


    }
    handleInput(dt) {
        const speed = 200;
        let dir = null;

        if (this.player.inputSystem.isPressed(INPUT_ACTIONS.LEFT, this.player.inputId)) {
            this.player.body.setVelocityX(-speed);
            dir = 'left';
        }
        if (this.player.inputSystem.isPressed(INPUT_ACTIONS.RIGHT, this.player.inputId)) {
            this.player.body.setVelocityX(speed);
            dir = 'right';
        }
        if (this.player.inputSystem.isPressed(INPUT_ACTIONS.UP, this.player.inputId)) {
            this.player.body.setVelocityY(-speed);
            dir = 'up';
        }
        if (this.player.inputSystem.isPressed(INPUT_ACTIONS.DOWN, this.player.inputId)) {
            this.player.body.setVelocityY(speed);
            dir = 'down';
        }
        this.player.body.velocity.normalize().scale(speed);

        if (dir) {
            this.player.anims.play(`p${this.player.kind}_walk_${dir}`, true);
        }
    }
    finish() {
        // FX: Quita tint al salir de moving
        if (!this.player.pushed) {
            this.player.body.setVelocity(0);
        }
        this.player.clearTint();

        // Setear frame de idle según última dirección
        if (this.player.lastDirection) {
            const dir = this.player.getDirectionFromVector(this.player.lastDirection);
            this.player.setFrame(this.player.idleFrames[dir]);
        } else {
            this.player.setFrame(this.player.idleFrames.down);
        }
    }
}

export class HoldingNothingState extends State {
    init(params) {
        this.player = params.player;
        this.player.holdingItem = false;
        this.player.itemHolded = null;
    }
    update(dt) {

    }

    finish() {

    }
}

export class HoldingIngredientState extends State {
    init(params) {
        this.player = params.player;
        this.ingredient = params.ingredient;
        // const ingredintes = Array.isArray(params.ingredient)? params.ingredient:[params.ingredient]


        this.player.holdingItem = true;
        this.player.itemHolded = this.ingredient;

        this.player.itemHolded.setDepth(9)
        this.player.itemHolded.setPosition(this.player.body.center.x, this.player.body.center.y - 10);
        this.player.itemHolded.setGrabbed(true)
        this.player.itemHolded.setVisible(true)
        this.player.audio.grabAudio.play({
            volume: .1,
            rate: 1.2
        })
    }
    update(dt) {
        this.player.itemHolded.setPosition(this.player.body.center.x, this.player.body.center.y - 10);
    }

    finish() {
        this.player.itemHolded.setDepth(7)
        this.player.holdingItem = false;
        this.player.itemHolded.setVisible(true);
        this.player.itemHolded.setGrabbed(false)
        this.player.itemHolded = null;
        this.player.audio.grabAudio.play({
            volume: .1,
            rate: .8
        })
    }
}

export class DashingState extends State {
    init(params) {
        this.player = params.player;

        this.dashDuration = 250;
        this.elapsed = 0;
        this.player.isDashing = true;

        const dashSpeed = 600;

        if (this.player.lastDirection) {
            this.player.body.setVelocity(
                this.player.lastDirection.x * dashSpeed,
                this.player.lastDirection.y * dashSpeed
            );
        }
        const dir = this.player.getDirectionFromVector(this.player.lastDirection);
        const dashFrames = {
            down: 10,   // frame de dash hacia abajo
            up: 34,    // frame de dash hacia arriba
            left: 4,   // frame de dash hacia izquierda
            right: 28  // frame de dash hacia derecha
        };
        this.player.setFrame(dashFrames[dir]);
        this.player.audio.dashAudio.play({
            volume: 0.5, // Ajusta el volumen
            rate: Phaser.Math.FloatBetween(1, 1.4)    // Ajusta el pitch
        });
    }

    update(dt) {
        this.elapsed += dt;
        this.player.emitterPolvo.emitParticle(1, this.player.x, this.player.y + 20);

        if (this.elapsed >= this.dashDuration) {
            if (
                this.player.inputSystem.isPressed(INPUT_ACTIONS.UP, this.player.inputId) ||
                this.player.inputSystem.isPressed(INPUT_ACTIONS.DOWN, this.player.inputId) ||
                this.player.inputSystem.isPressed(INPUT_ACTIONS.LEFT, this.player.inputId) ||
                this.player.inputSystem.isPressed(INPUT_ACTIONS.RIGHT, this.player.inputId)
            ) {
                this.player.movingSM.changeState("moving", { player: this.player });
            } else {
                this.player.movingSM.changeState("idle", { player: this.player });
            }
        }
    }

    finish() {
        this.player.clearTint();
        this.player.isDashing = false;
        this.player.body.setVelocity(0);

        // Setear frame de idle según última dirección
        if (this.player.lastDirection) {
            const dir = this.player.getDirectionFromVector(this.player.lastDirection);
            this.player.setFrame(this.player.idleFrames[dir]);
        } else {
            this.player.setFrame(this.player.idleFrames.down);
        }
    }
}