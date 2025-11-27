import { Interactuables } from "./Interactuables.js";
import { CircularTimer } from "./CircularTimer.js";
import { Ingredientes } from "./Ingredientes.js";
import { checkTaskQueue } from "../../utils/gameFunctions.js";

export class Task extends Interactuables {
    constructor(scene, x, y, availableIngredients = [], size = 48, textureKey = "order", ingredients = [null], duration = 40000) {

        super(scene, x, y, textureKey, size);

        this.scene = scene;
        this.audio = this.scene.scene.get("Preloader")
        this.textureKey = textureKey;
        this.availableIngredients = availableIngredients;
        this.ingredientList = [];
        if (ingredients[0] === null) {
            this.ingredientAmount = Math.floor(Math.random() * 3) + 1
        } else {
            this.ingredientAmount = ingredients.length
        }
        this.ordersLeft = this.ingredientAmount;
        this.itemsHolded = []

        this.zoneLayout = this.scene.add.image(x + 84, y, "deliverZone")
        this.zoneLayout.setDepth(7)
        this.zoneLayout.setBlendMode(Phaser.BlendModes.LIGHTEN)
        this.taskDuration = 0
        for (let i = 0; i < this.ingredientAmount; i++) {
            if (ingredients[0] === null) {
                const randomIndexPedidosDisponibles = Math.floor(Math.random() * this.availableIngredients.length)
                this.nextIngredient = new Ingredientes(this.scene, x + 5, y + (20 * i) - 15, this.availableIngredients[randomIndexPedidosDisponibles]);
            } else {
                this.nextIngredient = new Ingredientes(this.scene, x + 5, y + (20 * i) - 15, ingredients[i]);
            }

            this.nextIngredient.done = false;
            this.nextIngredient.setGrabbed(true)
            this.itemsHolded.push(this.nextIngredient);
            this.nextIngredient.setVisible(true)
            if (this.nextIngredient.textureKey === "beefMilaSandwich_0" ||
                this.nextIngredient.textureKey === "sanMila" ||
                this.nextIngredient.textureKey === "pancho" ||
                this.nextIngredient.textureKey === "beefSandwich_0"
            ) {

                this.taskDuration += duration * 2;
            } else {
                this.taskDuration += duration
            }
        }




        this.body.setCollideWorldBounds(true);
        this.body.setImmovable(true);
        this.body.setSize(this.body.width - 80, this.body.height - 50)
        this.body.setOffset(this.body.offset.x + 60, this.body.offset.y)
        this.timerText = this.scene.add.text(x, y - 32, "ORDEN", {
            fontFamily: "MyFont",
            fontSize: "18px",
            color: "#3b7ffcff"
        }).setOrigin(.5);

        this.scene.Interactuables.forEach(other => {
            if (other !== this) {
                this.scene.physics.add.collider(this, other);

            }
        });

        this.circleTimer = new CircularTimer(scene, x + 26, y + 33, 8, this.taskDuration, () => { this.failTask() })
        this.circleTimer.start()
    }

    onInteract(player) {
        if (player.holdingItem) {

            const atStart = this.ordersLeft;
            this.itemsHolded.forEach(order => {
                if (this.ordersLeft === atStart) {
                    if (player.itemHolded.textureKey === order.textureKey && !order.done) {
                        order.done = true;
                        this.ordersLeft--;

                        this.scene.Interactuables = this.scene.Interactuables.filter(i => i !== order);
                        order.destroy();
                        this.scene.Interactuables = this.scene.Interactuables.filter(i => i !== player.itemHolded);
                        const itemRef = player.itemHolded;
                        player.holdingSM.changeState("none", { player: player })
                        itemRef.destroy()
                        this.audio.deliveredOrderAudio.play({
                            volume: 0.5, // Ajusta el volumen
                            rate: 1    // Ajusta el pitch
                        });

                    }

                    if (this.ordersLeft <= 0) {
                        this.completeTask(player.kind);
                    }
                }
            });
        }
    }

    failTask() {
        if (this.scene.currentMode === 1) {
            let points = this.scene.registry.get("coopPoints");
            points -= 10;
            this.scene.registry.set("coopPoints", points);
            this.scene.scene.get("HUD").updatePoints();

        } else if (this.scene.currentMode === 2) {
            let points1 = this.scene.registry.get("vsPoints1");
            let points2 = this.scene.registry.get("vsPoints2");
            points1 -= 10;
            points2 -= 10;
            this.scene.registry.set("vsPoints1", points1);
            this.scene.registry.set("vsPoints2", points2);
            this.scene.scene.get("HUD").updatePoints();
        }

        this.clearTask();
    }

    update(dt) {
        this.circleTimer.update(dt)
    }

    completeTask(playerId) {
        if (this.scene.currentMode === 1) {
            this.scene.registry.set("coopPoints", this.scene.registry.get("coopPoints") + 20 * this.ingredientAmount);
            this.scene.scene.get("HUD").updatePoints()
        } else if (this.scene.currentMode === 2) {
            this.scene.registry.set(`vsPoints${playerId}`, this.scene.registry.get(`vsPoints${playerId}`) + 20 * this.ingredientAmount);
            this.scene.scene.get("HUD").updatePoints()
        }
        this.audio.moneyAudio.play({
            volume: 0.5, // Ajusta el volumen
            rate: Phaser.Math.FloatBetween(.8, 1.4)   // Ajusta el pitch
        });

        this.clearTask();
    }

    clearTask() {
        this.scene.Interactuables = this.scene.Interactuables.filter(i => i !== this);
        this.setVisible(false);
        this.setPosition(300, 300);
        checkTaskQueue(this.scene);
        this.circleTimer.circle.setVisible(false);

        this.itemsHolded.forEach(element => {
            this.scene.Interactuables = this.scene.Interactuables.filter(i => i !== element);
            element.destroy();
        });

        this.circleTimer.circle.destroy();
        this.timerText.destroy();
        this.zoneLayout.destroy()
        this.destroy()
    }
}