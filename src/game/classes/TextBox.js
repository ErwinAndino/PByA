export default class TextBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width = 250, height = 80, speaker = null) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scene = scene;
        this.width = width;
        this.height = height;
        this.speaker = speaker; // sprite a controlar
        this.setDepth(16);

        // Fondo de la box
        this.background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xffffff);

        // Texto
        this.textObject = scene.add.text(-width / 2 + 20, -height / 2 + 10, "", {
            fontFamily: "MyFont",
            fontSize: "18px",
            color: "#ffffffff",
            stroke: "#ffffffff",
            strokeThickness: 0,
            wordWrap: { width: width - 40 }
        });

        this.add([this.background, this.textObject]);

        // Propiedades internas
        this.fullText = "";
        this.currentChar = 0;
        this.isTyping = false;
        this.typingEvent = null;
        this.shakeTween = null;

        // Cola de textos
        this.queue = [];
        this.currentIndex = 0;
        this.autoAdvanceDelay = 2400; // ms después de terminar cada texto antes de avanzar
    }

    // Escribe un texto carácter por carácter
    showText(text, speed = 40) {
        // Cancelar evento previo si existía
        if (this.typingEvent) this.typingEvent.remove();
        if (this.shakeTween) this.shakeTween.stop();

        this.fullText = text;
        this.currentChar = 0;
        this.textObject.setText("");
        this.isTyping = true;

        // Animación de "hablar"
        if (this.speaker) {
            // Efecto de sacudida sutil (rebote)
            this.shakeTween = this.scene.tweens.add({
                targets: this.speaker,
                y: this.speaker.y - 2,
                duration: 100,
                yoyo: true,
                repeat: -1
            });
        }

        this.typingEvent = this.scene.time.addEvent({
            delay: speed,
            repeat: text.length - 1,
            callback: () => {
                this.textObject.text += text[this.currentChar];
                this.currentChar++;

                // Si llegó al final del texto
                if (this.currentChar === text.length) {
                    this.isTyping = false;

                    // Detener animación
                    if (this.speaker) {
                        if (this.shakeTween) this.shakeTween.stop();
                    }
                    this.scene.time.delayedCall(this.autoAdvanceDelay, () => this.next());
                }
            }
        });
    }

    // Mostrar una secuencia de textos
    showSequence(lines, speed = 40) {
        if (!Array.isArray(lines) || lines.length === 0) return;

        // Reiniciar cola
        this.queue = lines;
        this.currentIndex = 0;

        this.showText(this.queue[this.currentIndex], speed);
    }

    // Avanzar al siguiente texto en la secuencia
    next(speed = 40) {
        if (this.isTyping) return;

        this.currentIndex++;
        if (this.currentIndex < this.queue.length) {
            this.showText(this.queue[this.currentIndex], speed);
        } else {
            // Fin del diálogo
            this.emit("dialogComplete");
        }
    }

    // Saltar texto actual instantáneamente
    skip() {
        if (this.isTyping) {
            this.textObject.setText(this.fullText);
            this.isTyping = false;
            if (this.typingEvent) this.typingEvent.remove();
            if (this.shakeTween) this.shakeTween.stop();
        } else {
            this.next()
        }
    }

    // Control de visibilidad
    setVisible(visible) {
        super.setVisible(visible);
        this.list.forEach(obj => obj.setVisible(visible));
    }

    pause() {
        if (this.typingEvent && !this.typingEvent.paused) {
            this.typingEvent.paused = true;
        }
    }

    resume() {
        if (this.typingEvent && this.typingEvent.paused) {
            this.typingEvent.paused = false;
        }
    }
}
