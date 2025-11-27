import { Interactuables } from "./Interactuables";

export class Ingredientes extends Interactuables {
    constructor(scene, x, y, textureKey = "coal_0") {
        super(scene, x, y, "ingredientsAtlas", 900, scene.ingredientsAtlas[textureKey].index);

        this.setVisible(false)
        this.scene = scene;
        this.textureKey = textureKey;
        this.dataIngredient = this.scene.ingredientsAtlas[textureKey]
        this.grabbed = false;

        this.body.setMass(3);
        this.body.setBounce(.2);
        this.body.setDrag(200)
        this.body.setImmovable(false)
        this.setCollideWorldBounds(true);
        this.setDepth(7);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.scene.physics.add.collider(this.scene.player, this, () => {
            this.scene.player.setVelocity(this.scene.player.body.velocity.x * .8, this.scene.player.body.velocity.y * .8)
        })
        this.scene.physics.add.collider(this.scene.player02, this, () => {
            this.scene.player.setVelocity(this.scene.player.body.velocity.x * .8, this.scene.player.body.velocity.y * .8)
        })
        this.scene.physics.add.collider(this.scene.barra, this)

        this.scene.tweens.add({
            targets: this,
            y: this.y - 8,
            yoyo: true,
            duration: 120,
            repeat: 1
        });


        this.scene.Interactuables.push(this)
        this.scene.ingredientesCreadosArray.push(this);

        this.scene.Interactuables.forEach(other => {
            if (other !== this) {
                this.scene.physics.add.collider(this, other);

            }
        });


    }

    update(dt) {
    }

    setGrabbed(value) {
        this.grabbed = value;

        if (this.body) {
            this.body.enable = !value;
        }
    }

    onInteract(player) {
        if (!this.grabbed && !player.holdingItem) {
            player.holdingSM.changeState("ingredient", { player: player, ingredient: this })
        }
    }

    cook(cocina) {
        this.textureKey = this.dataIngredient.next[cocina];
        this.dataIngredient = this.scene.ingredientsAtlas[this.textureKey];
        this.setTexture("ingredientsAtlas", this.dataIngredient.index);
    }
}