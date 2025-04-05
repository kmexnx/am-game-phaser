class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Fondo con estilo Burton
        this.add.image(400, 300, 'title-background');

        // Título del juego con estilo gótico
        const title = this.add.text(400, 100, 'NO PUEDO GRITAR', {
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

        // Explicación del juego
        const storyText = this.add.text(400, 180, 
            'AM, la supercomputadora, te ha atrapado en su mundo virtual.\n' +
            'Encuentra 5 componentes para construir un terminal de escape.\n' +
            'Mantén tu cordura mientras evitas a AM.', {
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);

        // Botones de menú con estilo Burton
        const startButton = this.add.text(400, 280, 'Iniciar Juego', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const controlsButton = this.add.text(400, 330, 'Controles', {
            fontFamily: 'monospace',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const creditsButton = this.add.text(400, 380, 'Créditos', {
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
        controlsButton.on('pointerover', () => controlsButton.setColor('#ff0000'));
        controlsButton.on('pointerout', () => controlsButton.setColor('#ffffff'));
        controlsButton.on('pointerdown', () => this.showControls());
        
        creditsButton.on('pointerover', () => creditsButton.setColor('#ff0000'));
        creditsButton.on('pointerout', () => creditsButton.setColor('#ffffff'));
        creditsButton.on('pointerdown', () => this.showCredits());

        // La música está comentada por ahora para evitar errores
        // this.playMusic();
        
        // Crear sistema de diálogos para información
        this.infoBox = this.add.rectangle(400, 300, 600, 350, 0x000000, 0.9)
            .setVisible(false);
        
        this.infoText = this.add.text(400, 300, '', {
            fontFamily: 'monospace',
            fontSize: 16,
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 580 }
        }).setOrigin(0.5).setVisible(false);
        
        this.closeButton = this.add.text(650, 150, 'X', {
            fontFamily: 'monospace',
            fontSize: 20,
            color: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.hideInfo())
        .setVisible(false);
    }
    
    playMusic() {
        // Comentado para evitar errores con archivos de audio
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
    
    showControls() {
        const controlsText = 
            'CONTROLES\n\n' +
            'Flechas: Mover al personaje\n' +
            'ESC: Volver al menú principal\n\n' +
            'OBJETIVO\n\n' +
            'Recoge los 5 componentes para activar el portal de escape.\n' +
            'Evita a AM, acercarte a él reducirá tu cordura.\n' +
            'Si tu cordura llega a 0, perderás el control.';
            
        this.showInfo(controlsText);
    }
    
    showCredits() {
        const creditsText = 
            'CRÉDITOS\n\n' +
            'Basado en "I Have No Mouth, and I Must Scream"\n' +
            'de Harlan Ellison\n\n' +
            'Desarrollado con Phaser 3\n' +
            'Estilo visual inspirado en Tim Burton\n\n' +
            '© 2025 - Todos los derechos reservados';
            
        this.showInfo(creditsText);
    }
    
    showInfo(text) {
        this.infoBox.setVisible(true);
        this.infoText.setText(text).setVisible(true);
        this.closeButton.setVisible(true);
    }
    
    hideInfo() {
        this.infoBox.setVisible(false);
        this.infoText.setVisible(false);
        this.closeButton.setVisible(false);
    }
}