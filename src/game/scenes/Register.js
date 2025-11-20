// RegisterScene.js
import Phaser from "phaser";
import { auth } from "../../utils/firebase/config"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export class RegisterScene extends Phaser.Scene {
    constructor() {
        super("Register");
    }

    preload() {}

    create() {
        const { width, height } = this.scale;
        // -----------------------------
        // 1. CREACIÓN DE INPUTS HTML
        // -----------------------------
        this.createInputs();

        this.input.keyboard.manager.preventDefault = false;

        // -----------------------------
        // 2. LISTENERS DE TECLADO
        // -----------------------------
        this.enableKeyboardControls();

        // Texto visual opcional (Phaser)
        this.add.text(100, 50, "Registro", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#ffffff"
        });

        this.errorText = this.add.text(width/2, 300, "", {
            fontFamily: "Arial",
            fontSize: "20px",
            color: "#ff6961" // Rojo suave
        }).setOrigin(.5);

        this.googleBtn = this.add.text(width/2, 250, "Continuar con Google", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#4285F4",
            padding: { x: 10, y: 10 }
        }).setOrigin(.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.loginWithGoogle());
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);

            console.log("Login con Google OK:", result.user.email);

            this.cleanInputs();
            this.input.keyboard.manager.preventDefault = true;
            this.scene.start("MainMenu");

        } catch (error) {
            console.error("Error Google:", error.message);
            if (this.errorText) {
                this.errorText.setText("Error con Google: " + error.message);
            }
        }
    }

    createInputs() {
        // CONTENEDOR
        this.formWrapper = document.createElement("div");
        this.formWrapper.style.position = "absolute";
        this.formWrapper.style.top = "200px";
        this.formWrapper.style.left = "50%";
        this.formWrapper.style.transform = "translateX(-50%)";
        this.formWrapper.style.display = "flex";
        this.formWrapper.style.flexDirection = "column";
        this.formWrapper.style.gap = "12px";
        document.body.appendChild(this.formWrapper);

        // EMAIL
        this.emailInput = document.createElement("input");
        this.emailInput.type = "text";
        this.emailInput.placeholder = "Email";
        Object.assign(this.emailInput.style, {
            width: "260px",
            padding: "10px",
            fontSize: "18px"
        });

        // PASSWORD
        this.passInput = document.createElement("input");
        this.passInput.type = "password";
        this.passInput.placeholder = "Contraseña";
        Object.assign(this.passInput.style, {
            width: "260px",
            padding: "10px",
            fontSize: "18px"
        });

        this.formWrapper.appendChild(this.emailInput);
        this.formWrapper.appendChild(this.passInput);

        // El foco siempre inicia en email
        this.emailInput.focus();

        // Manejo de TAB y ENTER dentro de inputs
        this.applyInputKeyHandlers();
    }

    applyInputKeyHandlers() {
        const email = this.emailInput;
        const pass = this.passInput;

        email.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
                pass.focus();
            }
            if (e.key === "Enter") {
                e.preventDefault();
                console.log("Enter")
                this.submitForm();
            }
        });

        pass.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
                email.focus();
            }
            if (e.key === "Enter") {
                e.preventDefault();
                console.log("Enter")
                this.submitForm();
            }
        });
    }

    enableKeyboardControls() {
        // Capturar ESC y evitar que el input lo bloquee
        document.addEventListener(
            "keydown",
            (e) => {
                const active = document.activeElement;
                const isInputFocused =
                    !!active &&
                    (active.tagName === "INPUT" ||
                        active.tagName === "TEXTAREA" ||
                        active.isContentEditable);

                // Siempre permitir que los inputs reciban sus teclas (Enter, Tab, etc.)
                if (isInputFocused && e.key !== "Escape") {
                    return;
                }

                if (e.key === "Escape") {
                    e.stopPropagation();
                    this.returnToMenu();
                    return;
                }

                // Si necesitas manejar Enter globalmente, hazlo aquí
                // no uses e.stopPropagation() para Enter si quieres que los inputs lo reciban
            },
            true
        );
    }

    async submitForm() {
        const email = this.emailInput.value.trim();
        const password = this.passInput.value.trim();
        this.errorText.setText("");
        
        if (!email || !password) {
            console.log("Faltan datos");
            this.errorText.setText("Faltan Datos");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario registrado OK");
            this.cleanInputs();
            this.input.keyboard.manager.preventDefault = true;
            this.scene.start("MainMenu");
        } catch (error) {
            console.error("Error al registrar:", error.message);
            this.errorText.setText(error.message);
        }
    }

    returnToMenu() {
        this.cleanInputs();
        this.input.keyboard.manager.preventDefault = true;
        this.scene.start("MainMenu");
    }

    cleanInputs() {
        if (this.formWrapper) {
            document.body.removeChild(this.formWrapper);
            this.formWrapper = null;
        }
    }
}
