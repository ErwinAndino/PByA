import InputSystem, { INPUT_ACTIONS } from "../../utils/InputSystem";
import { DE, EN, ES, PT } from "../../utils/enums/languages";
import { FETCHED, FETCHING, READY, TODO } from "../../utils/enums/status";
import { getTranslations, getPhrase, getLanguageConfig } from "../../utils/Translations";
import keys from "../../utils/enums/keys";
import LanguageSelector from "../classes/LanguageSelector.js";
import { auth } from "../../utils/firebase/config.js";
import { signOut } from "firebase/auth";
import createInputs from "../../utils/createInputSystem.js";
import { highlightText, logout } from "../../utils/mainMenuFunctions.js";

export class MainMenu extends Phaser.Scene {

    #wasChangedLanguage = TODO;
    constructor() {
        super("MainMenu");
        const { coop, versus, scoreboard, idioma, } = keys.sceneInitialMenu;
        const { grab, dash, lanzar, select, hit } = keys.controlsPaper
        const { noUser, yesUser, register, continueGoogle, continueGithub, errorGoogle, errorGithub, missingData, login, password } = keys.sceneFirebase;
        this.noUser = noUser;
        this.yesUser = yesUser;
        this.coop = coop;
        this.versus = versus;
        this.scoreboard = scoreboard;
        this.idioma = idioma;
        this.select = select;
    }

    init({ language }) {
        // Si viene desde otra escena, lo usa; si no, lo carga de localStorage
        this.language = language || localStorage.getItem("language") || ES;
    }

    create() {

        this.language = this.language || ES;

        this.isInputLocked = false;

        createInputs(this)

        const { width, height } = this.scale;

        this.registry.set("actualLevel", 0);

        this.add.image(320, 180, "Main_Menu")

        const user = auth.currentUser;

        if (user) {
            const email = user.email;

            this.yesUserText = this.add.text(width / 2, 15, getPhrase(this.yesUser) + " " + email, {
                fontFamily: "Arial",
                fontSize: "22px",
                color: "#ffffff"
            }).setOrigin(0.5);
        } else {
            this.noUserText = this.add.text(width / 2, 15, getPhrase(this.noUser), {
                fontFamily: "Arial",
                fontSize: "22px",
                color: "#ff0d00ff"
            }).setOrigin(0.5);
        }

        this.menuText = this.add.text(width / 10, height / 7, "MENU", {
            fontSize: "50px",
            color: "#000000",
            fontFamily: "MyFont",
            stroke: "#fff",
            strokeThickness: 4,
        }).setOrigin(0);

        this.menuText.angle = -5

        //Titulo PByA
        this.polloText = this.add.text(width / 9, height / 3.7, "POLLO", {
            fontSize: "36px",
            color: "#fff",
            fontFamily: "MyFont"
        }).setOrigin(0);
        this.polloText.angle = -6

        this.bifesText = this.add.text(width / 8.5, height / 3, "BIFES Y", {
            fontSize: "36px",
            color: "#fff",
            fontFamily: "MyFont"
        }).setOrigin(0);
        this.bifesText.angle = -6

        this.achicoriaText = this.add.text(width / 8, height / 2.5, import.meta.env.VITE_TITLE, {
            fontSize: "36px",
            color: "#fff",
            fontFamily: "MyFont"
        }).setOrigin(0);
        this.achicoriaText.angle = -6

        //Botones
        this.coopText = this.add.text(width / 6, height / 2, "◦ " + getPhrase(this.coop), {
            fontSize: "24px",
            color: "#fff",
            fontFamily: "MyFont"
        }).setOrigin(0);
        this.coopText.angle = -5;

        this.versusText = this.add.text(width / 5.8, height / 1.8, "◦ " + getPhrase(this.versus), {
            fontSize: "30px",
            color: "#fff",
            fontFamily: "MyFont"
        }).setOrigin(0);
        this.versusText.angle = -5;

        this.scoreboardText = this.add.text(width / 6.8, height / 1.55, "◦ " + getPhrase(this.scoreboard), {
            fontSize: "24px",
            color: "#fff",
            fontFamily: "MyFont"
        }).setOrigin(0);
        this.scoreboardText.angle = -5;

        this.languageText = this.add.text(width / 6.5, height / 1.4, "◦ " + getPhrase(this.idioma), {
            fontSize: "24px",
            color: "#fff",
            fontFamily: "MyFont"
        }
        ).setOrigin(0);
        this.languageText.angle = -5;

        // paper de controles

        this.westText = this.add.text(width / 1.22, height / 1.62, getPhrase(this.select), {
            fontSize: "24px",
            color: "#303decff",
            fontFamily: "MyFont"
        }).setOrigin(0.5);

        this.westText.angle = 15


        // language selector

        this.languageActive = false


        const langs = [
            { key: "flagES", code: ES },
            { key: "flagEN", code: EN },
        ];
        this.languageSelector = new LanguageSelector(this, 215, 260, langs, this.language, (langCode) => {
            console.log("Intentando cambiar idioma a: ", langCode);
            if (this.language !== langCode) {
                this.getTranslations(langCode)
                localStorage.setItem("language", langCode);
                console.log("Idioma cambiado a:", langCode);
            }

        });
        this.languageSelector.setLanguage(this.language);

        // posicion del highlight inicial
        this.selector = 3
        highlightText(this)
        this.RegisterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.LoginKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.LogoutKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    }

    update() {

        if (this.#wasChangedLanguage === FETCHED) {
            this.#wasChangedLanguage = READY;
            this.coopText.setText("◦ " + getPhrase(this.coop));
            this.versusText.setText("◦ " + getPhrase(this.versus));
            this.scoreboardText.setText("◦ " + getPhrase(this.scoreboard));
            this.languageText.setText("◦ " + getPhrase(this.idioma));
            this.westText.setText(getPhrase(this.select));
            if (this.yesUserText) this.yesUserText.setText(getPhrase(this.yesUser) + " " + auth.currentUser.email);
            else this.noUserText.setText(getPhrase(this.noUser));

        }

        // Si el input está bloqueado, no procesar nada
        if (this.isInputLocked) return;

        if (Phaser.Input.Keyboard.JustDown(this.RegisterKey)) {
            this.sound.stopAll();
            this.scene.start("Register");
        }
        if (Phaser.Input.Keyboard.JustDown(this.LoginKey)) {
            this.sound.stopAll();
            this.scene.start("Login");
        }
        if (Phaser.Input.Keyboard.JustDown(this.LogoutKey)) {
            logout(this)
            this.yesUserText = false;
        }

        if (this.selector === 0 && this.languageSelector.active) {
            // mover entre banderas con A/D o Flechas
            if (this.inputSystem.isJustPressed(INPUT_ACTIONS.LEFT, "player01") || this.inputSystem.isJustPressed(INPUT_ACTIONS.LEFT, "player02")) {
                this.languageSelector.changeLanguage(-1);
            }
            if (this.inputSystem.isJustPressed(INPUT_ACTIONS.RIGHT, "player01") || this.inputSystem.isJustPressed(INPUT_ACTIONS.RIGHT, "player02")) {
                this.languageSelector.changeLanguage(1);
            }

            // confirmar idioma con Z o J
            if (this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player01") || this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player02")) {
                this.languageSelector.confirmSelection();
            }
        }

        // Si no esta activo el language dejar mover arriba y abajo

        if (!this.languageActive) {
            if (this.inputSystem.isJustPressed(INPUT_ACTIONS.UP, "player01") || this.inputSystem.isJustPressed(INPUT_ACTIONS.UP, "player02")) {
                this.selector = Math.min(3, this.selector + 1)
                highlightText(this)
            }
            if (this.inputSystem.isJustPressed(INPUT_ACTIONS.DOWN, "player01") || this.inputSystem.isJustPressed(INPUT_ACTIONS.DOWN, "player02")) {
                this.selector = Math.max(0, this.selector - 1)
                highlightText(this)

            }
        }

        // selección 
        if (this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player01") || this.inputSystem.isJustPressed(INPUT_ACTIONS.WEST, "player02")) {
            if (this.selector === 3) { // COOP
                this.registry.set("mode", 1);
                if (this.registry.get("actualLevel") === 0) {
                    this.scene.start("Load", { nextScene: "Tutorial" });
                } else {
                    this.scene.start("Load", { nextScene: "Game" });
                }


            }
            if (this.selector === 2) { // VERSUS
                this.registry.set("mode", 2);
                if (this.registry.get("actualLevel") === 0) {
                    this.scene.start("Load", { nextScene: "Tutorial" });
                } else {
                    this.scene.start("Load", { nextScene: "Game" });
                }

            }
            if (this.selector === 1) {// SCOREBOARD
            }
            if (this.selector === 0) { // LANGUAGE
                this.languageActive = true
                this.languageSelector.toggleArrows()

            }
        }

    }

    updateWasChangedLanguage = () => {
        this.#wasChangedLanguage = FETCHED;
    };

    async getTranslations(language) {
        this.language = language;
        this.#wasChangedLanguage = FETCHING;
        const { width, height } = this.scale;

        // Bloquea el input mientras se cargan las traducciones
        this.isInputLocked = true;
        this.cameras.main.setAlpha(0.5);

        this.loaderSprite = this.add.sprite(width / 2, height / 2 + 130, "bell").setScale(2);
        this.tweens.add({
            targets: this.loaderSprite,
            scale: 3,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        await getTranslations(language, this.updateWasChangedLanguage);

        this.tweens.add({
            targets: this.loaderSprite,
            scale: 5,
            duration: 400,
            yoyo: true,
            ease: "Back.easeOut",
            onComplete: () => {
                this.loaderSprite.destroy()
                this.cameras.main.setAlpha(1);
                this.isInputLocked = false;
                this.languageActive = false;
            }
        });
    }
}
