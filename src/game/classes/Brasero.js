import { CircularTimer } from "./CircularTimer";
import { KitchenBox } from "./KitchenBox";

export class Brasero extends KitchenBox {
    constructor(scene, x, y, size) {
        const textureKey = "brazier";
        super(scene, x, y, textureKey, size);
        this.coalFrame = -1;
        this.textureCoal = scene.add.sprite(x, y - 25, "coalLevel", this.coalFrame); // crea carbon por encima del brazier
        this.textureCoal.setVisible(false);
        this.scene = scene;
        this.audio = this.scene.scene.get("Preloader");
        this.textureKey = textureKey;
        // this.holdingItem = false;
        this.coalLevel = 0;
        this.itemHolded = [];
        this.itemCooked = [];
        this.numeroDeEtapas = 0;
        this.etapas = {};
        this.etapaActual = null;

        this.hasCoal = false;
        this.coalIcon = scene.add.image(x, y - 25, "coalIcon");
        this.coalIcon.setDepth(10);
        this.coalIcon.setVisible(true);
        this.timerCoal = 0;
        this.durationCoal = 10000;
        this.actionSound = this.audio.cookAudio
        this.actionFinish = this.audio.cookReadyAudio

        this.emitterHumo = this.scene.add.particles(x, y, 'particleSmoke01', { // humo grande
            frame: [0, 1, 2],
            speedX: { min: -10, max: 10 },
            speedY: { min: -20, max: -40 },
            lifespan: 1500,
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

        this.emitterHumo2 = this.scene.add.particles(x, y - 25, 'particleSmoke02', { // humo chico
            frame: [0, 1, 2, 3],
            speedX: { min: -10, max: 10 },
            speedY: { min: -20, max: -40 },
            lifespan: 1500,
            quantity: 1,
            frequency: -1,
            scale: 1,
            // scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            // blendMode: 'DARKEN',
            follow: null,
            depth: 12,
            emitZone: {
                source: new Phaser.Geom.Rectangle(-12.5, -12.5, 25, 25), // Área de emisión
                type: "random", // Las partículas se emiten desde posiciones aleatorias dentro del área
            },
        });


        this.circleTimer = new CircularTimer(scene, x + 13, y + 13, 6, this.cookDuration, () => { this.finishCook() }, 3)
    }

    onInteract(player) {
        if (player.holdingItem && this.coalLevel < 5) { //si el jugador tiene algo y esto tiene menos que el maximo
            this.checkIfItemCompatible(player);
        } else if (!player.holdingItem && this.holdingItem === true) { //si el jugador no tiene nada y esto si
            this.checkIfItemCanGo(player);
        }
    }

    checkIfItemCompatible(player) {
        // Protege contra null
        if (!player.itemHolded) return false;

        // Si el aparato acepta el item
        if (this.aparatoAccepts[player.itemHolded.textureKey]) {
            this.scene.tweens.killTweensOf(player.itemHolded);



            this.itemHolded.unshift(player.itemHolded); // coloca el carbon crudo en la segunda posicion
            this.holdingItem = true;
            this.coalLevel = Math.min(5, this.coalLevel + 1);
            this.coalFrame = Math.min(4, this.coalFrame + 1);
            this.textureCoal.setFrame(this.coalFrame);
            this.textureCoal.setVisible(true);
            this.coalIcon.setVisible(false); //saca el exclamationIcon de necesita carbon
            player.holdingSM.changeState("none", { player: player });
            this.itemHolded[0].setPosition(this.body.center.x + 1, this.body.center.y - 21);
            this.itemHolded[0].setVisible(true);
            this.itemHolded[0].setGrabbed(true);

            this.emitterHumo2.frequency = 500 //activa las particulas
            if (!this.circleTimer.active) {
                this.startCook();
            }

            return true; // compatible
        }

        return false; // no compatible
    }
    checkIfItemCanGo(player) {
        const puedeAgarrar = this.itemCooked.some(
            item => item.dataIngredient.index === 12); //si alguno de los items del array esta cocinado continua
        if (!puedeAgarrar) return;

        player.holdingSM.changeState("ingredient", { player: player, ingredient: this.itemCooked[this.itemCooked.length - 1] }); //agarra el utlimo, que deberia estar cocinado
        this.itemCooked.pop();

        this.coalLevel = Math.max(0, this.coalLevel - 1);
        this.coalFrame = Math.max(0, this.coalFrame - 1);
        this.textureCoal.setFrame(this.coalFrame);
        if (this.coalLevel === 0) {
            this.itemHolded = [];
            this.itemCooked = [];
            this.holdingItem = false;
            this.textureCoal.setVisible(false);
            this.coalIcon.setVisible(true);
            this.coalFrame = -1;
            this.emitterHumo2.frequency = -1 //desactiva las particulas
        }

    }

    startCook() {
        const puedeCocinar = this.itemHolded.some(
            item => item.dataIngredient.index != 12); //si alguno de los items del array no esta cocinado continua cocinando
        if (!puedeCocinar) return;

        if (this.itemHolded[0] && this.itemHolded[0].dataIngredient.next && this.itemHolded[0].dataIngredient.next[this.textureKey]) {
            this.circleTimer.start()
            if (this.actionSound) {
                this.actionSound.play();
            }
            // this.setTexture(this.textureOn);
        }
    }


    finishCook() {
        if (this.itemHolded.length > 0) {
            this.itemHolded[0].cook(this.textureKey);
            this.itemCooked.push(this.itemHolded.shift());
        }
        if (this.itemHolded[0] && this.itemHolded[0].dataIngredient.next && this.itemHolded[0].dataIngredient.next[this.textureKey]) {
            this.circleTimer.start()
        } else {
            if (this.actionSound) {
                this.actionSound.stop();
            }
            // this.needsCoal ? false : this.setTexture(this.textureKey)
        }
    }

}