import { Game } from '../scenes/Game';
import TextBox from "../classes/TextBox";
import { getPhrase } from "../../utils/Translations";
import keys from "../../utils/enums/keys";
export class Tutorial extends Game {
    constructor() {
        super("Tutorial");
        const { N0_1, N0_2, N0_3, N0_4, N0_5, N0_6, N1_1, N1_2, N1_3, N1_4, N1_5, N1_6, N1_7, N1_8, N2_1, N3_1, N3_2, N3_3, N3_4, N3_5, N3_6, N3_7, N4_1, N4_2 } = keys.sceneTutorial;
        this.cycleText = null;
        this.currentCycle = "init";
        this.player = null;
        this.dialog0 = [N0_1, N0_2, N0_3, N0_4, N0_5, N0_6]
        this.dialog1 = [N1_1, N1_2, N1_3, N1_4, N1_5, N1_6, N1_7, N1_8]
        this.dialog2 = [N2_1]
        this.dialog3 = [N3_1, N3_2, N3_3, N3_4, N3_5, N3_6, N3_7]
        this.dialog4 = [N4_1, N4_2]

    }
    create() {
        this.createAtlas();
        this.createLevel();
        this.pedidosDisponibles = ["polloAsado_2", "bife_2", "achicoriaPicada_0", "sanBife_0"]
        this.ingredientesNecesarios = ["polloCrudo_0", "bifeCrudo_0", "achicoriaCruda_0", "panCrudo_0"]
        this.createInputs();
        this.customLayout = [
            { x: 350, y: 300 },
            { x: 400, y: 300 },
            { x: 450, y: 300 },
            { x: 500, y: 300 },
        ];
        this.createLayout();

        this.translatedDialog0 = this.dialog0.map(getPhrase);
        this.translatedDialog1 = this.dialog1.map(getPhrase);
        this.translatedDialog2 = this.dialog2.map(getPhrase);
        this.translatedDialog3 = this.dialog3.map(getPhrase);
        this.translatedDialog4 = this.dialog4.map(getPhrase);

        this.pelado = this.physics.add.image(200, 80, "heart2").setScale(0.3);
        this.pelado.body.pushable = false;
        this.pelado.body.setImmovable(true)
        this.physics.add.collider(this.player, this.pelado);
        this.physics.add.collider(this.player2, this.pelado);

        //Cursors
        this.victoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.defeatKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.CaceriaKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.recetarioKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.nextKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.textBox = new TextBox(this, 365, 70, 250, 80, this.pelado);
        this.textBox.showSequence(this.translatedDialog0, 35);

        this.textBox.once("dialogComplete", () => {
            this.spawnPedidos(["achicoriaPicada_0"], 600000);
        });
        this.tutorialProgress = 0;
        this.previousPoints = 0;
        this.points = 0;
        this.ready = false;




        this.time.delayedCall(200, () => {
            const hud = this.scene.get("HUD");
            hud.resetTimer(6000000)
        });
    }
    update(t, dt) {
        super.update(t, dt)

        if (Phaser.Input.Keyboard.JustDown(this.nextKey)) {
            this.textBox.skip()
        }

        if (this.currentMode === 1) {
            this.points = this.registry.get("coopPoints");
        } else {
            this.points = this.registry.get("vsPoints1") + this.registry.get("vsPoints2")
        }
        if (this.previousPoints < this.points) {
            this.previousPoints = this.points
            this.ready = true
        }

        if (this.tutorialProgress === 0 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence(getPhrase(this.translatedDialog1), 35);
            this.textBox.once("dialogComplete", () => {
                this.spawnPedidos(["polloAsado_2"], 600000);
            });
        }
        if (this.tutorialProgress === 1 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence(getPhrase(this.translatedDialog2), 35);
            this.textBox.once("dialogComplete", () => {
                this.spawnPedidos(["bife_2", "polloAsado_2"], 600000);
            });
        }
        if (this.tutorialProgress === 2 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence(getPhrase(this.translatedDialog3), 35);
            this.textBox.once("dialogComplete", () => {
                this.spawnPedidos(["sanBife_0"], 600000);
            });
        }
        if (this.tutorialProgress === 3 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence(getPhrase(this.translatedDialog4), 35);
            this.textBox.once("dialogComplete", () => {
                this.finishLevel()
            });
        }
    }

    finishLevel() {
        this.sound.stopAll();
        this.scene.stop("HUD");
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.registry.set("actualLevel", this.actualLevel + 1)
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Load", { nextScene: "Game" });
        });


    }

}