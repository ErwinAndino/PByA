import { Game } from '../scenes/Game';
import TextBox from "../classes/TextBox";
import { getPhrase } from "../../utils/Translations";
import keys from "../../utils/enums/keys";
import createInputs from '../../utils/createInputSystem';
import createAtlas from '../../utils/createAtlas';
import { spawnPedidos, createLayout, createLevel } from "../../utils/gameFunctions.js";

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
        createAtlas(this);
        createLevel(this);
        this.pedidosDisponibles = ["grilledChicken_2", "beef_2", "choppedChicory_0", "beefSandwich_0"]
        this.ingredientesNecesarios = ["rawChicken_0", "rawBeef_0", "rawChicory_0", "rawBread_0"]
        createInputs(this);
        this.customLayout = [
            { x: 350, y: 300 },
            { x: 400, y: 300 },
            { x: 450, y: 300 },
            { x: 500, y: 300 },
        ];
        createLayout(this);

        this.translatedDialog0 = this.dialog0.map(getPhrase);
        this.translatedDialog1 = this.dialog1.map(getPhrase);
        this.translatedDialog2 = this.dialog2.map(getPhrase);
        this.translatedDialog3 = this.dialog3.map(getPhrase);
        this.translatedDialog4 = this.dialog4.map(getPhrase);

        //MUSICA ---------------------------------------------------
        this.audio.musicTutorialAudio.play()

        this.pelado = this.physics.add.sprite(200, 80, "player01", 6).setScale(1).setTint("#fff3eeff");
        this.pelado.body.pushable = false;
        this.pelado.body.setImmovable(true)
        this.physics.add.collider(this.player, this.pelado);
        this.physics.add.collider(this.player02, this.pelado);

        //Cursors
        this.victoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.nextLevelKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.defeatKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.CaceriaKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.recetarioKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.nextKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.textBox = new TextBox(this, 365, 70, 250, 80, this.pelado);
        this.textBox.showSequence(this.translatedDialog0, 35);

        this.textBox.once("dialogComplete", () => {
            spawnPedidos(this, ["choppedChicory_0"], 600000);
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
        if (Phaser.Input.Keyboard.JustDown(this.nextLevelKey)) {
            this.finishLevel();
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
                spawnPedidos(this, ["grilledChicken_2"], 600000);
            });
        }
        if (this.tutorialProgress === 1 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence(getPhrase(this.translatedDialog2), 35);
            this.textBox.once("dialogComplete", () => {
                spawnPedidos(this, ["beef_2", "grilledChicken_2"], 600000);
            });
        }
        if (this.tutorialProgress === 2 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence(getPhrase(this.translatedDialog3), 35);
            this.textBox.once("dialogComplete", () => {
                spawnPedidos(this, ["beefSandwich_0"], 600000);
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
        console.log("FINISHEATE DE TUTORIAL")
        this.sound.stopAll();
        this.scene.stop("HUD");
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.registry.set("actualLevel", this.actualLevel + 1)
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("Load", { nextScene: "Game" });
        });


    }

}