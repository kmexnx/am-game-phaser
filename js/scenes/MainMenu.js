class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Fondo con estilo Burton
        this.add.image(400, 300, 'title-background');

        // Título del juego con estilo gótico
        const title = this.add.text(400, 150, 'NO PUEDO GRITAR', {
            fontFamily: 'monospace',
            fontSize: 48,
            color: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Añadir efecto de ondulación al título
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Botones de menú con estilo Burton
        const startButton = this.add.text(400, 300, 'Iniciar Juego', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const optionsButton = this.add.text(400, 350, 'Opciones', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const creditsButton = this.add.text(400, 400, 'Créditos', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Interacción con los botones
        startButton.on('pointerover', () => {
            startButton.setColor('#ff0000');
        });
        startButton.on('pointerout', () => {
            startButton.setColor('#ffffff');
        });
        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Similar para los otros botones
        optionsButton.on('pointerover', () => optionsButton.setColor('#ff0000'));
        optionsButton.on('pointerout', () => optionsButton.setColor('#ffffff'));
        
        creditsButton.on('pointerover', () => creditsButton.setColor('#ff0000'));
        creditsButton.on('pointerout', () => creditsButton.setColor('#ffffff'));

        // Música de fondo inquietante - Comentado temporalmente
        /* 
        if (!this.sound.get('music-theme')) {
            this.backgroundMusic = this.sound.add('music-theme', {
                volume: 0.5,
                loop: true
            });
            this.backgroundMusic.play();
        }
        */
    }
}