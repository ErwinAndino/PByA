import InputSystem, { INPUT_ACTIONS } from "../../utils/InputSystem";
import { getPhrase } from "../../utils/Translations";
import keys from "../../utils/enums/keys";
export class Load extends Phaser.Scene {
    constructor() {
        super("Load");
        const { grab, dash, lanzar, select, hit } = keys.controlsPaper
        const { N1, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12, N13, N14, N15, N16, N17, N18, N19, N20, N21, N22, N23, N24, N25, N26, N27, N28, N29, N30, N31, N32, N33, N34, N35, N36, N37, N38, N39, N40, didYouKnow, pressAnyKey } = keys.sabiasQue
        this.arrayWierdPhrases = [
            N1,
            N2,
            N3,
            N4,
            N5,
            N6,
            N7,
            N8,
            N9,
            N10,
            N11,
            N12,
            N13,
            N14,
            N15,
            N16,
            N17,
            N18,
            N19,
            N20,
            N21,
            N22,
            N23,
            N24,
            N25,
            N26,
            N27,
            N28,
            N29,
            N30,
            N31,
            N32,
            N33,
            N34,
            N35,
            N36,
            N37,
            N38,
            N39,
            N40,
        ]
        this.didYouKnow = didYouKnow;
        this.pressAnyKey = pressAnyKey;
        this.grab = grab;
        this.dash = dash;
        this.lanzar = lanzar;
        this.hit = hit;
    }

    init(data) {
        // Recibe el nombre de la próxima escena
        this.nextScene = data.nextScene || "MainMenu"; // valor por defecto
    }

    create() {
        this.inputSystem = new InputSystem(this.input);
        this.inputSystem.configureKeyboard({
            [INPUT_ACTIONS.UP]: [Phaser.Input.Keyboard.KeyCodes.W],
            [INPUT_ACTIONS.DOWN]: [Phaser.Input.Keyboard.KeyCodes.S],
            [INPUT_ACTIONS.LEFT]: [Phaser.Input.Keyboard.KeyCodes.A],
            [INPUT_ACTIONS.RIGHT]: [Phaser.Input.Keyboard.KeyCodes.D],
            [INPUT_ACTIONS.SOUTH]: [Phaser.Input.Keyboard.KeyCodes.X],
            [INPUT_ACTIONS.EAST]: [Phaser.Input.Keyboard.KeyCodes.C],
            [INPUT_ACTIONS.WEST]: [Phaser.Input.Keyboard.KeyCodes.Z]
        }, "player1");
        this.inputSystem.configureKeyboard({
            [INPUT_ACTIONS.UP]: [Phaser.Input.Keyboard.KeyCodes.UP],
            [INPUT_ACTIONS.DOWN]: [Phaser.Input.Keyboard.KeyCodes.DOWN],
            [INPUT_ACTIONS.LEFT]: [Phaser.Input.Keyboard.KeyCodes.LEFT],
            [INPUT_ACTIONS.RIGHT]: [Phaser.Input.Keyboard.KeyCodes.RIGHT],
            [INPUT_ACTIONS.SOUTH]: [Phaser.Input.Keyboard.KeyCodes.K],
            [INPUT_ACTIONS.EAST]: [Phaser.Input.Keyboard.KeyCodes.L],
            [INPUT_ACTIONS.WEST]: [Phaser.Input.Keyboard.KeyCodes.J]
        }, "player2");

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const sabiasQueText = this.add.text(width / 2, height / 2 - 150, getPhrase(this.didYouKnow), {
            fontFamily: "MyFont",
            fontSize: "22px",
            color: "#ffffff"
        }).setOrigin(0.5);

        let randomIndex = Math.floor(Math.random() * this.arrayWierdPhrases.length)

        const randomPhrase = this.arrayWierdPhrases[randomIndex];
        console.log(randomIndex)
        console.log(randomPhrase)


        this.add.image(width, height, "hoja").setOrigin(1, 1)

        const randomPhraseText = this.add.text(width / 2, height / 2 - 120, getPhrase(randomPhrase), {
            fontFamily: "MyFont",
            fontSize: "22px",
            color: "#ffffff"
        }).setOrigin(0.5);

        const loaderSprite = this.add.sprite(width / 2, (height / 2) + 130, "campana").setScale(2);
        this.tweens.add({
            targets: loaderSprite,
            scale: 3,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        // Variables de progreso
        this.totalTime = 1000;
        this.elapsed = 0;
        this.ready = false;

        // Input
        this.input.keyboard.on("keydown", () => {
            if (this.ready) this.startNextScene();
        });

        const loadingText = this.add.text(width / 2, height / 2, "", {
            fontFamily: "MyFont",
            fontSize: "20px",
            color: "#ffffff"
        }).setOrigin(0.5);

        // Guardamos referencias
        this.loadingText = loadingText;
        this.loaderSprite = loaderSprite;

        //hoja de botones
        let wText;
        let sText;
        let eText;

        if (this.nextScene === "Caceria") {
            wText = this.hit;
            sText = this.dash;
            eText = null;

        } else {
            wText = this.grab;
            sText = this.dash;
            eText = this.lanzar;
        }

        this.westText = this.add.text(width / 1.2, height / 1.63, getPhrase(wText), {
            fontSize: "24px",
            color: "#303decff",
            fontFamily: "MyFont"
        }).setOrigin(0.5);

        this.westText.angle = 25

        this.southText = this.add.text(width / 1.1, height / 1.45, getPhrase(sText), {
            fontSize: "24px",
            color: "#303decff",
            fontFamily: "MyFont"
        }).setOrigin(0.5);

        this.southText.angle = -10

        this.eastText = this.add.text(width / 1.05, height / 2, getPhrase(eText), {
            fontSize: "24px",
            color: "#303decff",
            fontFamily: "MyFont"
        }).setOrigin(0.5);

        this.eastText.angle = 10
    }

    update(time, delta) {
        if (!this.ready) {
            this.elapsed += delta;
            const progress = Phaser.Math.Clamp(this.elapsed / this.totalTime, 0, 1);


            if (progress >= 1) {
                this.ready = true;
                this.loadingText.setText(getPhrase(this.pressAnyKey));

                // Al finalizar, podés hacer que el sprite “celebre”
                this.tweens.add({
                    targets: this.loaderSprite,
                    scale: 5,
                    duration: 400,
                    yoyo: true,
                    ease: "Back.easeOut"
                });
            }
        }

        if (this.ready) {
            if (
                this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player1") ||
                this.inputSystem.isJustPressed(INPUT_ACTIONS.EAST, "player1") ||
                this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player1") ||
                this.inputSystem.isJustPressed(INPUT_ACTIONS.SOUTH, "player2") ||
                this.inputSystem.isJustPressed(INPUT_ACTIONS.EAST, "player2") ||
                this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player2")
            ) {
                this.startNextScene();
            }
        }
    }

    startNextScene() {
        if (this.nextScene === "Game" || this.nextScene === "Tutorial") {
            this.scene.launch("HUD");
        }
        this.scene.start(this.nextScene);
    }
}