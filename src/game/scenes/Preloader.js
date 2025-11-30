import { getTranslations, getPhrase } from "../../utils/Translations";
import keys from "../../utils/enums/keys";

export class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader")
        this.fontReady = false;
        this.ready = false;
        this.timerReady = false;
        const { symbol, } = keys.scenePreloader;
        this.symbol = symbol
    }

    preload() {
        //PRELOAD
        this.currentCycle = "preload"
        this.load.setPath("assets");
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Paso 1: cargar solo el ícono de carga
        this.load.image("bell", "SS_Bell.png");


        this.load.once("complete", () => {
            // Mostrar sprite animado
            this.loaderSprite = this.add.sprite(width / 2, height / 2 + 130, "bell").setScale(2);
            this.tweens.add({
                targets: this.loaderSprite,
                scale: 3,
                duration: 200,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });

            this.symbolText = this.add.text(width / 2, height / 1.35, getPhrase(this.symbol), {
                fontFamily: "MyFont",
                fontSize: "22px",
                color: "#ffffff"
            }).setOrigin(0.5);

            this.time.delayedCall(1000, () => {
                this.timerReady = true;
            });

            // Paso 2: cargar el resto de los assets
            this.loadRemainingAssets();
            this.load.start();
        });

        this.load.start(); // inicia el paso 1    
    }

    loadRemainingAssets() {
        this.load.setPath("assets");

        //IMAGENES ------------------------------------------
        this.load.image("background", "BG_Day.png");
        this.load.image("frier", "SS_Frier_01.png");
        this.load.image("frierOn", "SS_Frier_02.png");
        this.load.image("box", "SS_Box.png");
        this.load.image("order", "SS_Order.png");
        this.load.image("deliverTable", "SS_DeliverTable.png");
        this.load.image("ash", "SS_Grill_Ash.png");
        this.load.image("coalIcon", "SS_Icon_Coal.png");
        this.load.image("iconHotCoal", "SS_Icon_Coal_Hot.png");
        this.load.image("cuttingBoard", "SS_CuttingBoard.png");
        this.load.image("deliverZone", "SS_Layout_Deliver_Zone.png");
        this.load.image("recipeBook", "SS_Recipe_Book.png");
        this.load.image("backgroundHunt", "BG_Night.png");
        this.load.image("heart", "Heart.png");
        this.load.image("Main_Menu", "Main_Menu.png");
        this.load.image("paper", "paper.png");
        this.load.image("brazier", "SS_Brazier.png");
        this.load.image("exclamationIcon", "SS_Icon_Exclamation.png");
        this.load.image("flagEN", "Flag_EN.png");
        this.load.image("flagES", "Flag_ES.png");
        this.load.image("profileIcon", "ProfileIcon.png");

        //AUDIO----------------------------------------
        this.load.audio("playerWalk", "./audio/PByA_PJ_Walk.mp3");
        this.load.audio("cook", "./audio/PByA_MT_Grill.mp3");
        this.load.audio("chop", "./audio/PByA_MT_CuttingBoard.mp3");
        this.load.audio("fry", "./audio/PByA_MT_Frier.mp3");
        this.load.audio("cookReady", "./audio/PByA_Cook.mp3");
        this.load.audio("dash", "./audio/PByA_PJ_Dash.mp3");
        this.load.audio("grab", "./audio/PByA_Object.mp3");
        this.load.audio("throw", "./audio/PByA_Object_Throw.mp3");
        this.load.audio("box", "./audio/PByA_MT_Box.mp3");
        this.load.audio("newOrder", "./audio/PByA_Hud_Order_New.mp3");
        this.load.audio("deliveredOrder", "./audio/PByA_Hud_Order_Delivered.mp3");
        this.load.audio("money", "./audio/PByA_Hud_Money.mp3");
        this.load.audio("timeBegin", "./audio/PByA_Hud_Time_Begin.mp3");
        this.load.audio("timeCritical", "./audio/PByA_Hud_Time_Critical.mp3");
        this.load.audio("timeEnd", "./audio/PByA_Hud_Time_End.mp3");
        this.load.audio("playerHit", "./audio/PByA_PJ_Attack_Hit.mp3");
        this.load.audio("bossHit", "./audio/PByA_Boss_Lobizon_Attack_Hit.mp3");
        this.load.audio("bossDeath", "./audio/PByA_Boss_Lobizon_Death.mp3");
        this.load.audio("bossHowl", "./audio/PByA_Boss_Lobizon_Ambient.mp3");
        this.load.audio("musicKitchen", "./audio/music/Ultimate_Cuarteto.mp3");
        this.load.audio("musicHunt", "./audio/music/Ultimate_Chacarera.mp3");
        this.load.audio("huntAmbient", "./audio/PByA_Ambient_Hunt_01.mp3");
        this.load.audio("kitchenAmbientAudio", "./audio/PByA_Ambient_Kitchen_01.mp3");
        this.load.audio("musicTutorial", "./audio/music/Ultimate_Chamame.mp3");

        //SPRITESHEETS--------------------------------
        this.load.spritesheet("bossAttack01", "SS_Boss_Attack_01.png", { frameWidth: 197, frameHeight: 110 })
        this.load.spritesheet("bossAttack02", "SS_Boss_Attack_02.png", { frameWidth: 197, frameHeight: 110 })
        this.load.spritesheet("player01", "SS_Player01.png", { frameWidth: 30, frameHeight: 47 })
        this.load.spritesheet("player02", "SS_Player02.png", { frameWidth: 30, frameHeight: 47 })
        this.load.spritesheet("player1Attack", "SS_Player01_Hit.png", { frameWidth: 41, frameHeight: 47 })
        this.load.spritesheet("player2Attack", "SS_Player02_Hit.png", { frameWidth: 41, frameHeight: 47 })
        this.load.spritesheet("playerAttackEffect", "SS_AttackEffect.png", { frameWidth: 40, frameHeight: 30 })
        this.load.spritesheet("ingredientsAtlas", "SS_Ingredients.png", { frameWidth: 20, frameHeight: 20 })
        this.load.spritesheet("grill", "SS_Grill.png", { frameWidth: 25, frameHeight: 25 })
        this.load.spritesheet("embers", "SS_Grill_Embers.png", { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet("table", "SS_Table.png", { frameWidth: 25, frameHeight: 25 })
        this.load.spritesheet("recipeBook01", "SS_RecipeBook_lvl1.png", { frameWidth: 206, frameHeight: 102 })
        this.load.spritesheet("recipeBook02", "SS_RecipeBook_lvl2.png", { frameWidth: 206, frameHeight: 102 })
        this.load.spritesheet("recipeBook03", "SS_RecipeBook_lvl3.png", { frameWidth: 206, frameHeight: 102 })
        this.load.spritesheet("recipeBook04", "SS_RecipeBook_lvl4.png", { frameWidth: 206, frameHeight: 102 })
        this.load.spritesheet("recipeBook05", "SS_RecipeBook_lvl5.png", { frameWidth: 206, frameHeight: 102 })
        this.load.spritesheet("recipeBook06", "SS_RecipeBook_lvl6.png", { frameWidth: 206, frameHeight: 102 })
        this.load.spritesheet("recipeBook07", "SS_RecipeBook_lvl7.png", { frameWidth: 206, frameHeight: 102 })
        this.load.spritesheet("particleSmoke01", "SS_Particles_Smoke_01.png", { frameWidth: 20, frameHeight: 20 })
        this.load.spritesheet("particleSmoke02", "SS_Particles_Smoke_02.png", { frameWidth: 10, frameHeight: 10 })
        this.load.spritesheet("particleDust01", "SS_Particles_Dust_01.png", { frameWidth: 20, frameHeight: 20 })
        this.load.spritesheet("particleDust02", "SS_Particles_Dust_02.png", { frameWidth: 10, frameHeight: 10 })
        this.load.spritesheet("coalLevel", "SS_Coal_Level.png", { frameWidth: 40, frameHeight: 31 })

        this.load.on("complete", () => {
            //CREAR SONIDOS ---------------------------------------------------
            this.musicKitchenAudio = this.sound.add("musicKitchen", { loop: false, volume: .5 })
            this.musicTutorialAudio = this.sound.add("musicTutorial", { loop: true, volume: .5 })
            this.kitchenAmbientAudio = this.sound.add("kitchenAmbientAudio", { loop: true, volume: 1 })
            this.cookAudio = this.sound.add("cook", { loop: true })
            this.chopAudio = this.sound.add("chop", { loop: true })
            this.fryAudio = this.sound.add("fry", { loop: true })
            this.cookReadyAudio = this.sound.add("cookReady", { loop: false })
            this.dashAudio = this.sound.add("dash", { loop: false })
            this.playerWalkAudio = this.sound.add("playerWalk", { loop: false })
            this.grabAudio = this.sound.add("grab", { loop: false })
            this.throwAudio = this.sound.add("throw", { loop: false })
            this.boxAudio = this.sound.add("box", { loop: false })
            this.newOrderAudio = this.sound.add("newOrder", { loop: false })
            this.deliveredOrderAudio = this.sound.add("deliveredOrder", { loop: false })
            this.moneyAudio = this.sound.add("money", { loop: false })
            this.timeBeginAudio = this.sound.add("timeBegin", { loop: false })
            this.timeCriticalAudio = this.sound.add("timeCritical", { loop: false })
            this.timeEndAudio = this.sound.add("timeEnd", { loop: false })
            this.playerHitAudio = this.sound.add("playerHit", { loop: false })
            this.bossDeathAudio = this.sound.add("bossDeath", { loop: false })
            this.bossHitAudio = this.sound.add("bossHit", { loop: false })
            this.bossHowlAudio = this.sound.add("bossHowl", { loop: false })
            this.assetsReady = true;
        });
    }

    create() {
    }

    update() {
        // Esperar que TODO esté listo antes de pasar
        if (this.assetsReady && this.timerReady) {

            this.tweens.add({
                targets: this.loaderSprite,
                scale: 5,
                duration: 400,
                yoyo: true,
                ease: "Back.easeOut"
            });

            this.time.delayedCall(400, () => {
                this.scene.start("MainMenu")
            });
        }
    }
}