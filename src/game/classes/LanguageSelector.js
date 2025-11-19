export default class LanguageSelector extends Phaser.GameObjects.Container {
    constructor(scene, x, y, languages, actualLanguage, onChange) {
        super(scene, x, y);

        this.scene = scene;
        this.languages = languages; // [{ key, code }]
        this.onChange = onChange;
        this.currentIndex = 0;
        this.active = false;
        console.log(actualLanguage)
        if (actualLanguage === "es") this.currentIndex = 0
        if (actualLanguage === "en") this.currentIndex = 1
        // === Crear elementos ===
        this.flag = scene.add.image(0, 0, this.languages[this.currentIndex].key).setScale(0.5);
        // this.arrowLeft = scene.add.image(-10, 0, "heart").setScale(0.4).setVisible(false);
        // this.arrowRight = scene.add.image(10, 0, "heart").setScale(0.4).setVisible(false);
        this.arrowLeft = scene.add.text(-20, 0, "<", {
            fontSize: "24px",
            color: "#fff",
            fontFamily: "MyFont"
        }
        ).setOrigin(0.5).setVisible(false);
        // this.arrowLeft.angle = -5;

        this.arrowRight = scene.add.text(20, 0, ">", {
            fontSize: "24px",
            color: "#fff",
            fontFamily: "MyFont"
        }
        ).setOrigin(0.5).setVisible(false);
        // this.arrowRight.angle = -5;

        this.add([this.flag, this.arrowLeft, this.arrowRight]);
        scene.add.existing(this);
    }

    toggleArrows() {
        this.active = !this.active;
        this.arrowLeft.setVisible(this.active);
        this.arrowRight.setVisible(this.active);

        if (this.active) {
            this.scene.tweens.add({
                targets: [this.arrowLeft, this.arrowRight],
                alpha: { from: 0, to: 1 },
                duration: 200,
                ease: "Sine.easeOut"
            });
        } else {
            this.scene.tweens.add({
                targets: [this.arrowLeft, this.arrowRight],
                alpha: { from: 1, to: 0 },
                duration: 150,
                ease: "Sine.easeIn"
            });
        }
    }

    changeLanguage(dir) {
        if (!this.active) return;

        this.currentIndex = (this.currentIndex + dir + this.languages.length) % this.languages.length;
        const currentLang = this.languages[this.currentIndex];

        this.updateFlagDisplay(currentLang);
    }

    confirmSelection() {
        if (!this.active) return;

        this.toggleArrows(); // ocultar flechas
        const currentLang = this.languages[this.currentIndex];
        if (this.onChange) this.onChange(currentLang.code);

        // animación de confirmación
        this.scene.tweens.add({
            targets: this.flag,
            scale: { from: 0.5, to: 0.6 },
            yoyo: true,
            duration: 150
        });
    }
    setLanguage(langCode) {
        const index = this.languages.findIndex(l => l.code === langCode);
        if (index !== -1) {
            this.currentIndex = index;
        }
        this.updateFlagDisplay(this.languages[this.currentIndex]); // tu método que cambia la bandera visible
    }
    updateFlagDisplay(currentLang) {
        // animación del cambio de bandera
        this.scene.tweens.add({
            targets: this.flag,
            alpha: 0,
            duration: 100,
            onComplete: () => {
                this.flag.setTexture(currentLang.key);
                this.scene.tweens.add({
                    targets: this.flag,
                    alpha: 1,
                    duration: 100
                });
            }
        });
    }

}
