import InputSystem, { INPUT_ACTIONS } from "../../utils/InputSystem";
import { getPhrase } from "../../utils/Translations";
import keys from "../../utils/enums/keys";
export class PauseMenu extends Phaser.Scene {
    constructor() {
        super("PauseMenu");
        const { pause, resume, skipTutorial, mainMenu } = keys.scenePauseMenu
        this.pause = pause;
        this.resume = resume;
        this.skipTutorial = skipTutorial;
        this.mainMenu = mainMenu;
    }
    init(data) {

        this.sceneKey = data.from;
        this.game = this.scene.get(this.sceneKey)
    }
    create() {
        const { width, height } = this.scale;
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

        this.pauseGame();
        this.scene.bringToTop("PauseMenu");

        // fondo semitransparente
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

        this.game.cameras.main.setAlpha(0.5);

        // texto principal
        this.add.text(width / 2, height / 4, getPhrase(this.pause), {
            fontFamily: "MyFont",
            fontSize: "48px",
            color: "#ffffff",
        }).setOrigin(0.5);

        // botón reanudar
        this.resumeText = this.add.text(width / 2, height / 2, getPhrase(this.resume), {
            fontFamily: "MyFont",
            fontSize: "32px",
            color: "#ffffff",
        }).setOrigin(0.5);

        let exitPosition = height / 1.6;

        if (this.sceneKey === "Tutorial") {
            // skip tutorial
            this.skipTutorialText = this.add.text(width / 2, height / 1.6, getPhrase(this.skipTutorial), {
                fontFamily: "MyFont",
                fontSize: "32px",
                color: "#ffffff",
            }).setOrigin(0.5);

            exitPosition = height / 1.3
        }



        // botón salir al menú principal (opcional)
        this.exitText = this.add.text(width / 2, exitPosition, getPhrase(this.mainMenu), {
            fontFamily: "MyFont",
            fontSize: "28px",
            color: "#ffffff",
        }).setOrigin(0.5);

        // también podés permitir cerrar con ESC otra vez
        this.input.keyboard.on("keydown-ESC", () => {
            this.resumeGame();
        });
        this.selector = 1
        if (this.sceneKey === "Tutorial") this.selector = 2

        this.highlightText();
    }
    update() {
        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.UP, "player1") || this.inputSystem.isJustPressed(INPUT_ACTIONS.UP, "player2")) {
            console.log("PA RRIBA")
            if (this.sceneKey === "Tutorial") {
                this.selector = Math.min(2, this.selector + 1)
            } else {
                this.selector = Math.min(1, this.selector + 1)
            }

            this.highlightText()
        }
        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.DOWN, "player1") || this.inputSystem.isJustPressed(INPUT_ACTIONS.DOWN, "player2")) {
            console.log("PA BAJO")
            this.selector = Math.max(0, this.selector - 1)
            this.highlightText()

        }
        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player1") || this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player2")) {
            if (this.sceneKey === "Tutorial") {
                if (this.selector === 2) {// RESUME
                    this.resumeGame();
                } if (this.selector === 1) {// SKIP TUTORIAL
                    this.finishLevel();
                }
            } else {
                if (this.selector === 1) {// RESUME
                    this.resumeGame();
                }
            }


            if (this.selector === 0) { // EXIT
                this.exitToMenu();
            }
        }
    }
    highlightText() {
        this.resumeText.setColor("#fff");
        if (this.sceneKey === "Tutorial") this.skipTutorialText.setColor("#fff");
        this.exitText.setColor("#fff");
        let text = null;
        if (this.sceneKey === "Tutorial") {
            if (this.selector === 2) text = this.resumeText;
            if (this.selector === 1) text = this.skipTutorialText;
        } else {
            if (this.selector === 1) text = this.resumeText;
        }
        if (this.selector === 0) text = this.exitText;
        text.setColor("#2ed12eff");
    }
    pauseGame() {
        this.sound.pauseAll();
        this.scene.pause(this.sceneKey); // pausa esta escena (Game)
        this.scene.pause("HUD");
        if (this.game.CircularTimer) this.game.CircularTimer.pause();
        if (this.game.textBox) this.game.textBox.pause();
        // if (this.emitterHumo2) this.emitterHumo2.on = false; // apaga partículas
        // if (this.audioManager) this.audioManager.pauseAll();
    }
    resumeGame() {
        this.sound.resumeAll();
        this.game.cameras.main.setAlpha(1);
        this.scene.resume(this.sceneKey); // reanuda el juego
        this.scene.resume("HUD");
        if (this.game.CircularTimer) this.game.CircularTimer.resume();
        if (this.game.textBox) this.game.textBox.resume();
        this.scene.stop(); // cierra PauseMenu
    }

    exitToMenu() {
        this.sound.stopAll();
        this.scene.stop(this.sceneKey); // detiene la escena de juego
        this.scene.stop("HUD");
        this.scene.start("MainMenu"); // va al menú principal
    }
    finishLevel() {
        this.sound.stopAll();
        this.scene.stop("HUD");
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.registry.set("actualLevel", 1)
        console.log(this.registry.get("actualLevel"))
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.stop(this.sceneKey); // detiene la escena de juego
            this.scene.start("Load", { nextScene: "Game" });
        });
    }

}
