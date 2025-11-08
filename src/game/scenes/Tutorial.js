import { Game } from '../scenes/Game';
import TextBox from "../classes/TextBox";
export class Tutorial extends Game {
    constructor() {
        super("Tutorial");
        this.cycleText = null;
        this.currentCycle = "init";
        this.player = null;

    }
    create() {
        this.createAtlas();
        this.createLevel();
        this.pedidosDisponibles = ["polloAsado_2", "bife_2", "achicoriaPicada_0", "sanBife_0"]
        this.ingredientesNecesarios = ["polloCrudo_0", "bifeCrudo_0", "achicoriaCruda_0", "panCrudo_0"]
        this.createInputs();
        this.createLayout();




        this.pelado = this.physics.add.image(200, 80, "heart2").setScale(0.3);
        this.pelado.body.pushable = false;
        this.pelado.body.setImmovable(true)
        this.physics.add.collider(this.player, this.pelado);
        this.physics.add.collider(this.player2, this.pelado);

        //Cursors
        this.victoryKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.CaceriaKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.recetarioKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.nextKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.add.text(100, 150, "Soy el nivel tutorial", { fontSize: "20px", color: "#401be2ff" });

        this.textBox = new TextBox(this, 380, 70, 250, 80, this.pelado);
        this.textBox.showSequence([
            "Ey wachos demen bola que no tengo ganas de explicar esto devuelta",
            "ya saben, si quieren mantener el laburo cocinen lo que les piden los clientes",
            "las ordenes llegan aca a la izquierda y les dicen que porqueria tienen que cocinar",
            "si tardan demasiado se me van los clientes y se los voy a descontar a los dos",
            "ayudense o no, no me importa, solo etreguen los pedidos antes que se acabe el dia",
            "ahora piquen una achicoria en la tabla de la mesa para hacer una ensalada y entreguenla."
        ], 35);

        this.textBox.once("dialogComplete", () => {
            console.log("Fin del diálogo");
            this.spawnPedidos(["achicoriaPicada_0"], 600000);
        });
        this.tutorialProgress = 0;
        this.previousPoints = 0;
        this.points = 0;
        this.ready = false;




        this.time.delayedCall(200, () => {
            const hud = this.scene.get("HUD");
            hud.resetTimer(600000)
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
            this.textBox.showSequence([
                "La propina que les den los clientes distribuyansela como se les cante",
                "pero si alguno me empieza a generar perdidas lo rajo, sepanlo",
                "ahora quiero que aprendan a usar la parrilla",
                "agarren carbon de la caja y metanlo en el brasero para hacer unas brasas",
                "despues metan eso en la parrilla con alguna carne",
                "tienen que sacarlo cuando este listo, no antes ni despues",
                "si se les quema se joden y lo hacen devuelta",
                "ahora haganme un pollo a la parrilla y entreguenlo por allá",
            ], 35);
            this.textBox.once("dialogComplete", () => {
                console.log("Fin del diálogo");
                this.spawnPedidos(["polloAsado_2"], 600000);
            });
        }
        if (this.tutorialProgress === 1 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence([
                "Ahora que saben usar la parrilla quiero que me hagan un bife y un pollo asados",
            ], 35);
            this.textBox.once("dialogComplete", () => {
                console.log("Fin del diálogo");
                this.spawnPedidos(["bife_2", "polloAsado_2"], 600000);
            });
        }
        if (this.tutorialProgress === 2 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence([
                "Joya, ahora les voy a pedir algo mas complicado",
                "quiero que me hagan un sandwich de bife y achicoria",
                "para eso tienen que combinar en la mesa pan cortado, achicoria picada y bife asado",
                "corten el pan en la tabla pero no lo destruyan hasta que sea pan rallado, es un corte al medio noma",
                "piquen la achicoria tambien en la tabla y los combinan en la mesa, pero no en la tabla, la tabla es para picar",
                "despues cocinen el bife en la parrilla con las brasas y todo eso y me lo combinan en la mesa tambien",
                "si no me dieron ni bola por alla abajo tienen un libro rojo que es el recetario con las instrucciones",
            ], 35);
            this.textBox.once("dialogComplete", () => {
                console.log("Fin del diálogo");
                this.spawnPedidos(["sanBife_0"], 600000);
            });
        }
        if (this.tutorialProgress === 3 && this.ready) {
            this.tutorialProgress += 1;
            this.ready = false;
            this.textBox.showSequence([
                "Listo, mañana los quiero aca laburando",
                "pero no se hagan los vivos que todavia estan a prueba",

            ], 35);
            this.textBox.once("dialogComplete", () => {
                console.log("Fin del diálogo");
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