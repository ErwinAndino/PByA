export class Recetario extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, lvl, frame = 0) {
        let texture = "";
        if (lvl === 0) texture = "recipeBook04";
        else if (lvl === 1) texture = "recipeBook01";
        else if (lvl === 2) texture = "recipeBook02";
        else if (lvl === 3) texture = "recipeBook03";
        else if (lvl === 4) texture = "recipeBook04";
        else if (lvl === 5) texture = "recipeBook05";
        else if (lvl === 6) texture = "recipeBook06";
        else if (lvl >= 7) texture = "recipeBook07";

        super(scene, x, y, texture, frame);

        this.scene = scene;
        this.textureKey = texture;
        this.opened = false;
        this.indice = 0;
        this.totalFrames = 4;
        this.moveDistance = 69;
        this.isAnimating = false;
        this.timer = null;

        this.startY = y;
        this.openY = this.startY - this.moveDistance;

        this.setDepth(150)


        this.scene.add.existing(this);

    }

    onInput() {
        if (this.isAnimating) return;

        if (!this.opened) {
            this.open()
        } else {
            this.nextPage();
        }
    }

    open() {
        this.isAnimating = true;

        this.scene.tweens.add({
            targets: this,
            y: this.openY,
            duration: 600,
            ease: "Cubic.easeOut",
            onComplete: () => {
                this.opened = true;
                this.isAnimating = false;
                this.startCloseTimer();
            }
        })
    }

    close() {
        if (!this.opened || this.isAnimating) return;

        this.isAnimating = true;
        this.clearCloseTimer();

        this.scene.tweens.add({
            targets: this,
            y: this.startY,
            duration: 600,
            ease: "Cubic.easeIn",
            onComplete: () => {
                this.opened = false;
                this.isAnimating = false;
            }
        });
    }

    nextPage() {
        this.indice = (this.indice + 1) % this.totalFrames;
        this.setFrame(this.indice);

        this.resetCloseTimer();

        this.scene.tweens.add({
            targets: this,
            y: this.openY + 10,
            duration: 80,
            yoyo: true,
            ease: "Sine.easeInOut"
        });
    }

    startCloseTimer() {
        this.clearCloseTimer();
        this.timer = this.scene.time.delayedCall(4000, () => {
            this.close();
        })
    }

    resetCloseTimer() {
        this.startCloseTimer();
    }

    clearCloseTimer() {
        if (this.timer) {
            this.timer.remove(false);
            this.timer = null;
        }
    }
}